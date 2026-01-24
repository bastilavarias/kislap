package biz

import (
	"encoding/json"
	"flash/internal/project"
	"flash/models"
	objectStorage "flash/sdk/object_storage"
	"fmt"
	"mime/multipart"
	"time"

	"gorm.io/gorm"
)

// Changed receiver to pointer *Service for better performance/state handling
type Service struct {
	DB             *gorm.DB
	ProjectService *project.Service
	ObjectStorage  objectStorage.Provider
}

// Helper to run deletions in background
func (s *Service) deleteImageInBackground(path string) {
	if path == "" {
		return
	}
	go func(p string) {
		// Note: Ensure your ObjectStorage.Delete creates its own context or handles timeouts
		_, err := s.ObjectStorage.Delete(p)
		if err != nil {
			fmt.Printf("Failed to delete background image %s: %v\n", p, err)
		}
	}(path)
}

func (s *Service) Save(payload Payload) (*models.Biz, error) {
	// 1. Prepare Theme JSON
	var themeRaw []byte
	if payload.Theme != nil {
		var err error
		themeRaw, err = json.Marshal(payload.Theme)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal theme: %w", err)
		}
	}

	var biz models.Biz

	// 2. Handle Creation (New Business)
	if payload.BizID == nil {
		// For creation, we can use the old "build" logic or just manual construction
		// Since we don't have IDs yet, we assume everything is new.

		// Note: For cleaner code, I'm defining a mini-sync or build here,
		// but typically you just create the structs.
		// To save space, I will delegate to the sync functions even for creation
		// by passing an empty Biz ID, effectively forcing "Creates" for everything.

		biz = models.Biz{
			UserID:          uint64(payload.UserID),
			ProjectID:       uint64(payload.ProjectID),
			Name:            payload.Name,
			Tagline:         &payload.Tagline,
			Description:     &payload.Description,
			Email:           &payload.Email,
			Phone:           payload.Phone,
			Address:         payload.Address,
			Website:         &payload.Website,
			ServicesEnabled: payload.ServicesEnabled,
			ProductsEnabled: payload.ProductsEnabled,
			BookingEnabled:  payload.BookingEnabled,
			OrderingEnabled: payload.OrderingEnabled,
			LayoutName:      &payload.LayoutName,
		}
		if len(themeRaw) > 0 {
			msg := json.RawMessage(themeRaw)
			biz.ThemeObject = &msg
		}

		// Create the parent Biz first to get an ID
		if err := s.DB.Create(&biz).Error; err != nil {
			return nil, err
		}

		// Now sync the children (all will be treated as new inserts)
		if err := s.runAllSyncs(s.DB, &biz, payload); err != nil {
			return nil, err
		}

	} else {
		// 3. Handle Update (Existing Business)
		err := s.DB.Transaction(func(tx *gorm.DB) error {
			if err := tx.First(&biz, payload.BizID).Error; err != nil {
				return err
			}

			// Update fields
			biz.Name = payload.Name
			biz.Tagline = &payload.Tagline
			biz.Description = &payload.Description
			biz.Email = &payload.Email
			biz.Phone = payload.Phone
			biz.Address = payload.Address
			biz.Website = &payload.Website
			biz.ServicesEnabled = payload.ServicesEnabled
			biz.ProductsEnabled = payload.ProductsEnabled
			biz.BookingEnabled = payload.BookingEnabled
			biz.OrderingEnabled = payload.OrderingEnabled
			biz.LayoutName = &payload.LayoutName

			if len(themeRaw) > 0 {
				msg := json.RawMessage(themeRaw)
				biz.ThemeObject = &msg
			}

			if err := tx.Save(&biz).Error; err != nil {
				return err
			}

			// Run Syncs
			return s.runAllSyncs(tx, &biz, payload)
		})
		if err != nil {
			return nil, err
		}
	}

	// Refetch to return full object with associations
	s.DB.Preload("Services").Preload("Products").Preload("Testimonials").Preload("SocialLinks").First(&biz, biz.ID)

	return &biz, nil
}

// Wrapper to run all syncs
func (s *Service) runAllSyncs(tx *gorm.DB, biz *models.Biz, payload Payload) error {
	if err := s.syncServices(tx, biz.ID, int64(biz.ProjectID), payload.Services); err != nil {
		return err
	}
	if err := s.syncProducts(tx, biz.ID, int64(biz.ProjectID), payload.Products); err != nil {
		return err
	}
	if err := s.syncTestimonials(tx, biz.ID, int64(biz.ProjectID), payload.Testimonials); err != nil {
		return err
	}
	if err := s.syncSocialLinks(tx, biz.ID, payload.SocialLinks); err != nil {
		return err
	}
	return nil
}

// ==========================================
// SYNC FUNCTIONS
// ==========================================

func (s *Service) syncServices(tx *gorm.DB, bizID uint64, projectID int64, requests []ServiceRequest) error {
	// 1. Fetch Existing
	var existing []models.Service
	if err := tx.Where("biz_id = ?", bizID).Find(&existing).Error; err != nil {
		return err
	}
	existingMap := make(map[uint64]*models.Service)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)

	// 2. Upsert (Update or Insert)
	for _, req := range requests {
		var model models.Service
		var oldImage string

		// Check if Update
		if req.ID != nil && *req.ID != 0 {
			if match, ok := existingMap[uint64(*req.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
				if match.ImageURL != nil {
					oldImage = *match.ImageURL
				}
			}
		}

		// Handle Image
		newImgURL := model.ImageURL // Keep existing by default
		if req.Image != nil {
			// Upload New
			url, err := s.uploadImage(req.Image, projectID, "services")
			if err != nil {
				return err
			}
			newImgURL = &url
			// Delete Old
			if oldImage != "" {
				s.deleteImageInBackground(oldImage)
			}
		} else if req.ImageURL == nil && oldImage != "" {
			// Handle case where user explicitly removed image (optional logic)
			// If you want to support removing image without replacing, check if req.ImageURL is explicitly nil/empty
			// For now, we assume if req.Image is nil, we keep the old URL unless logic dictates otherwise
		}

		// Assign Fields
		model.BizID = bizID
		model.Name = req.Name
		model.Description = req.Description
		model.Price = req.Price
		model.DurationMinutes = req.DurationMinutes
		model.IsFeatured = req.IsFeatured
		model.ImageURL = newImgURL

		if model.ID != 0 {
			if err := tx.Save(&model).Error; err != nil {
				return err
			}
		} else {
			if err := tx.Create(&model).Error; err != nil {
				return err
			}
		}
	}

	// 3. Delete Missing
	for id, item := range existingMap {
		if !processedIDs[id] {
			if err := tx.Delete(item).Error; err != nil {
				return err
			}
			if item.ImageURL != nil {
				s.deleteImageInBackground(*item.ImageURL)
			}
		}
	}
	return nil
}

func (s *Service) syncProducts(tx *gorm.DB, bizID uint64, projectID int64, requests []ProductRequest) error {
	var existing []models.Product
	if err := tx.Where("biz_id = ?", bizID).Find(&existing).Error; err != nil {
		return err
	}

	existingMap := make(map[uint64]*models.Product)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)

	for _, req := range requests {
		var model models.Product
		var oldImage string

		// Check Update
		// Assumes ProductRequest has an `ID *int64` field
		if req.ID != nil && *req.ID != 0 {
			if match, ok := existingMap[uint64(*req.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
				if match.ImageURL != nil {
					oldImage = *match.ImageURL
				}
			}
		}

		newImgURL := model.ImageURL
		if req.Image != nil {
			url, err := s.uploadImage(req.Image, projectID, "products")
			if err != nil {
				return err
			}
			newImgURL = &url
			if oldImage != "" {
				s.deleteImageInBackground(oldImage)
			}
		}

		model.BizID = bizID
		model.Name = req.Name
		model.Description = req.Description
		model.Price = req.Price
		model.Stock = req.Stock
		model.IsActive = req.IsActive
		model.ImageURL = newImgURL

		if model.ID != 0 {
			if err := tx.Save(&model).Error; err != nil {
				return err
			}
		} else {
			if err := tx.Create(&model).Error; err != nil {
				return err
			}
		}
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			if err := tx.Delete(item).Error; err != nil {
				return err
			}
			if item.ImageURL != nil {
				s.deleteImageInBackground(*item.ImageURL)
			}
		}
	}
	return nil
}

func (s *Service) syncTestimonials(tx *gorm.DB, bizID uint64, projectID int64, requests []TestimonialRequest) error {
	var existing []models.Testimonial
	if err := tx.Where("biz_id = ?", bizID).Find(&existing).Error; err != nil {
		return err
	}

	existingMap := make(map[uint64]*models.Testimonial)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)

	for _, req := range requests {
		var model models.Testimonial
		var oldAvatar string

		// Assumes TestimonialRequest has an `ID *int64` field
		if req.ID != nil && *req.ID != 0 {
			if match, ok := existingMap[uint64(*req.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
				if match.AvatarURL != nil {
					oldAvatar = *match.AvatarURL
				}
			}
		}

		newAvatarURL := model.AvatarURL
		if req.Avatar != nil {
			url, err := s.uploadImage(req.Avatar, projectID, "testimonials")
			if err != nil {
				return err
			}
			newAvatarURL = &url
			if oldAvatar != "" {
				s.deleteImageInBackground(oldAvatar)
			}
		}

		model.BizID = bizID
		model.Author = req.Author
		model.Rating = req.Rating
		model.Content = req.Content
		model.AvatarURL = newAvatarURL

		if model.ID != 0 {
			if err := tx.Save(&model).Error; err != nil {
				return err
			}
		} else {
			if err := tx.Create(&model).Error; err != nil {
				return err
			}
		}
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			if err := tx.Delete(item).Error; err != nil {
				return err
			}
			if item.AvatarURL != nil {
				s.deleteImageInBackground(*item.AvatarURL)
			}
		}
	}
	return nil
}

func (s *Service) syncSocialLinks(tx *gorm.DB, bizID uint64, requests []SocialLinkRequest) error {
	var existing []models.BizSocialLink
	if err := tx.Where("biz_id = ?", bizID).Find(&existing).Error; err != nil {
		return err
	}

	existingMap := make(map[uint64]*models.BizSocialLink)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)

	for _, req := range requests {
		var model models.BizSocialLink

		// Assumes SocialLinkRequest has an `ID *int64` field
		// If it doesn't, standard behavior is usually Delete All + Insert for simple links
		if req.ID != nil && *req.ID != 0 {
			if match, ok := existingMap[uint64(*req.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
			}
		}

		model.BizID = bizID
		model.Platform = req.Platform
		model.URL = req.URL

		if model.ID != 0 {
			if err := tx.Save(&model).Error; err != nil {
				return err
			}
		} else {
			if err := tx.Create(&model).Error; err != nil {
				return err
			}
		}
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			if err := tx.Delete(item).Error; err != nil {
				return err
			}
		}
	}
	return nil
}

func (s *Service) uploadImage(file *multipart.FileHeader, projectID int64, folder string) (string, error) {
	if file == nil {
		return "", nil
	}

	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer src.Close()

	uniqueName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	path := fmt.Sprintf("projects/%d/biz/%s/%s", projectID, folder, uniqueName)

	contentType := file.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	url, err := s.ObjectStorage.Upload(path, src, contentType)
	if err != nil {
		return "", fmt.Errorf("storage upload failed: %w", err)
	}

	// Important: If 'url' is a full URL (e.g. https://domain.com/path),
	// ensure your delete function can handle it or return the relative path here.
	return url, nil
}
