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

type Service struct {
	DB             *gorm.DB
	ProjectService *project.Service
	ObjectStorage  objectStorage.Provider
}

func (service *Service) Save(payload Payload) (*models.Biz, error) {
	var themeRaw *json.RawMessage
	var themeName *string

	if payload.Theme != nil {
		tr, err := marshalTheme(*payload.Theme)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal theme: %w", err)
		}
		themeRaw = tr
		themeName = &payload.Theme.Preset
	}

	var biz models.Biz
	isNew := payload.BizID == nil

	if isNew {
		biz = models.Biz{
			UserID:          uint64(payload.UserID),
			ProjectID:       uint64(payload.ProjectID),
			ServicesEnabled: payload.ServicesEnabled,
			ProductsEnabled: payload.ProductsEnabled,
			BookingEnabled:  payload.BookingEnabled,
			OrderingEnabled: payload.OrderingEnabled,
			ThemeName:       themeName,
			ThemeObject:     themeRaw,
			LayoutName:      &payload.LayoutName,
		}
	} else {
		if err := service.DB.First(&biz, payload.BizID).Error; err != nil {
			return nil, err
		}
	}

	// --- 1. Map Top-Level Fields ---
	biz.Name = payload.Name
	biz.Tagline = &payload.Tagline
	biz.Description = &payload.Description // About Us Text
	biz.Email = &payload.Email
	biz.Phone = payload.Phone
	biz.Address = payload.Address
	biz.MapLink = payload.MapLink
	biz.Schedule = payload.Schedule
	biz.OperationHours = payload.OperationHours
	biz.ServicesEnabled = payload.ServicesEnabled
	biz.ProductsEnabled = payload.ProductsEnabled
	biz.BookingEnabled = payload.BookingEnabled
	biz.OrderingEnabled = payload.OrderingEnabled
	biz.LayoutName = &payload.LayoutName

	if payload.Theme != nil {
		biz.ThemeName = themeName
		biz.ThemeObject = themeRaw
	}

	// --- 2. Handle Root Level File Uploads ---
	// Logo
	if payload.Logo != nil {
		if biz.LogoURL != nil {
			service.deleteImageInBackground(*biz.LogoURL)
		}
		url, _ := service.uploadImage(payload.Logo, int64(biz.ProjectID), "branding")
		biz.LogoURL = &url
	} else if payload.LogoURL == nil && biz.LogoURL != nil {
		service.deleteImageInBackground(*biz.LogoURL)
		biz.LogoURL = nil
	}

	// Hero Image
	if payload.HeroImage != nil {
		if biz.HeroImageURL != nil {
			service.deleteImageInBackground(*biz.HeroImageURL)
		}
		url, _ := service.uploadImage(payload.HeroImage, int64(biz.ProjectID), "hero")
		biz.HeroImageURL = &url
	}

	// About Image
	if payload.AboutImage != nil {
		if biz.AboutImageURL != nil {
			service.deleteImageInBackground(*biz.AboutImageURL)
		}
		url, _ := service.uploadImage(payload.AboutImage, int64(biz.ProjectID), "about")
		biz.AboutImageURL = &url
	}

	// New Fields for Hero
	biz.HeroTitle = payload.HeroTitle
	biz.HeroDescription = payload.HeroDescription

	// --- 3. Save Biz & Sync Collections ---
	err := service.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&biz).Error; err != nil {
			return err
		}
		return service.runAllSyncs(tx, &biz, payload)
	})

	if err != nil {
		return nil, err
	}

	service.DB.Preload("Services").
		Preload("Products").
		Preload("Testimonials").
		Preload("SocialLinks").
		Preload("FAQs").
		Preload("GalleryImages").
		First(&biz, biz.ID)

	return &biz, nil
}

func (service *Service) runAllSyncs(db *gorm.DB, biz *models.Biz, payload Payload) error {
	if err := service.syncServices(db, biz.ID, int64(biz.ProjectID), payload.Services); err != nil {
		return err
	}
	if err := service.syncProducts(db, biz.ID, int64(biz.ProjectID), payload.Products); err != nil {
		return err
	}
	if err := service.syncTestimonials(db, biz.ID, int64(biz.ProjectID), payload.Testimonials); err != nil {
		return err
	}
	if err := service.syncSocialLinks(db, biz.ID, payload.SocialLinks); err != nil {
		return err
	}
	if err := service.syncFAQs(db, biz.ID, payload.FAQs); err != nil {
		return err
	}
	if err := service.syncGalleryImages(db, biz.ID, int64(biz.ProjectID), payload.GalleryImages); err != nil {
		return err
	}
	return nil
}

// Updated Sync Products to include Category
func (service *Service) syncProducts(db *gorm.DB, bizID uint64, projectID int64, requests []ProductRequest) error {
	var existing []models.Product
	db.Where("biz_id = ?", bizID).Find(&existing)

	existingMap := make(map[uint64]*models.Product)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)

	for _, request := range requests {
		var model models.Product
		var oldImage string

		if request.ID != nil && *request.ID != 0 {
			if match, ok := existingMap[uint64(*request.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
				if match.ImageURL != nil {
					oldImage = *match.ImageURL
				}
			}
		}

		newImgURL := model.ImageURL
		if request.Image != nil {
			url, _ := service.uploadImage(request.Image, projectID, "products")
			newImgURL = &url
			if oldImage != "" {
				service.deleteImageInBackground(oldImage)
			}
		}

		model.BizID = bizID
		model.Name = request.Name
		model.Category = request.Category // Added Category
		model.Description = request.Description
		model.Price = request.Price
		model.Stock = request.Stock
		model.IsActive = request.IsActive
		model.ImageURL = newImgURL
		model.PlacementOrder = request.PlacementOrder

		db.Save(&model)
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			db.Delete(item)
			if item.ImageURL != nil {
				service.deleteImageInBackground(*item.ImageURL)
			}
		}
	}
	return nil
}

// New Sync FAQs
func (service *Service) syncFAQs(db *gorm.DB, bizID uint64, requests []FAQRequest) error {
	db.Where("biz_id = ?", bizID).Delete(&models.BizFAQ{})
	for _, request := range requests {
		model := models.BizFAQ{
			BizID:          bizID,
			Question:       request.Question,
			Answer:         request.Answer,
			PlacementOrder: request.PlacementOrder,
		}
		db.Create(&model)
	}
	return nil
}

// New Sync Gallery
func (service *Service) syncGalleryImages(db *gorm.DB, bizID uint64, projectID int64, requests []GalleryImageRequest) error {
	var existing []models.BizGallery
	db.Where("biz_id = ?", bizID).Find(&existing)

	existingMap := make(map[uint64]*models.BizGallery)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)

	for _, request := range requests {
		var model models.BizGallery
		var oldImage string

		if request.ID != nil && *request.ID != 0 {
			if match, ok := existingMap[uint64(*request.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
				if match.ImageURL != nil {
					oldImage = *match.ImageURL
				}
			}
		}

		newImgURL := model.ImageURL
		if request.Image != nil {
			url, _ := service.uploadImage(request.Image, projectID, "gallery")
			newImgURL = &url
			if oldImage != "" {
				service.deleteImageInBackground(oldImage)
			}
		} else if request.ImageURL != nil {
			newImgURL = request.ImageURL
		}

		model.BizID = bizID
		model.ImageURL = newImgURL
		model.PlacementOrder = request.PlacementOrder
		db.Save(&model)
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			db.Delete(item)
			if item.ImageURL != nil {
				service.deleteImageInBackground(*item.ImageURL)
			}
		}
	}
	return nil
}

// ... syncServices, syncTestimonials, syncSocialLinks (Keep as is or adjust categories if needed)

func (service *Service) syncServices(db *gorm.DB, bizID uint64, projectID int64, requests []ServiceRequest) error {
	var existing []models.Service
	db.Where("biz_id = ?", bizID).Find(&existing)
	existingMap := make(map[uint64]*models.Service)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)
	for _, request := range requests {
		var model models.Service
		var oldImage string
		if request.ID != nil && *request.ID != 0 {
			if match, ok := existingMap[uint64(*request.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
				if match.ImageURL != nil {
					oldImage = *match.ImageURL
				}
			}
		}
		newImgURL := model.ImageURL
		if request.Image != nil {
			url, _ := service.uploadImage(request.Image, projectID, "services")
			newImgURL = &url
			if oldImage != "" {
				service.deleteImageInBackground(oldImage)
			}
		}
		model.BizID = bizID
		model.Name = request.Name
		model.Description = request.Description
		model.Price = request.Price
		model.DurationMinutes = request.DurationMinutes
		model.IsFeatured = request.IsFeatured
		model.ImageURL = newImgURL
		model.PlacementOrder = request.PlacementOrder
		db.Save(&model)
	}
	for id, item := range existingMap {
		if !processedIDs[id] {
			db.Delete(item)
			if item.ImageURL != nil {
				service.deleteImageInBackground(*item.ImageURL)
			}
		}
	}
	return nil
}

func (service *Service) syncTestimonials(db *gorm.DB, bizID uint64, projectID int64, requests []TestimonialRequest) error {
	var existing []models.Testimonial
	db.Where("biz_id = ?", bizID).Find(&existing)
	existingMap := make(map[uint64]*models.Testimonial)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)
	for _, request := range requests {
		var model models.Testimonial
		var oldAvatar string
		if request.ID != nil && *request.ID != 0 {
			if match, ok := existingMap[uint64(*request.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
				if match.AvatarURL != nil {
					oldAvatar = *match.AvatarURL
				}
			}
		}
		newAvatarURL := model.AvatarURL
		if request.Avatar != nil {
			url, _ := service.uploadImage(request.Avatar, projectID, "testimonials")
			newAvatarURL = &url
			if oldAvatar != "" {
				service.deleteImageInBackground(oldAvatar)
			}
		}
		model.BizID = bizID
		model.Author = request.Author
		model.Rating = request.Rating
		model.Content = request.Content
		model.AvatarURL = newAvatarURL
		model.PlacementOrder = request.PlacementOrder
		db.Save(&model)
	}
	for id, item := range existingMap {
		if !processedIDs[id] {
			db.Delete(item)
			if item.AvatarURL != nil {
				service.deleteImageInBackground(*item.AvatarURL)
			}
		}
	}
	return nil
}

func (service *Service) syncSocialLinks(db *gorm.DB, bizID uint64, requests []SocialLinkRequest) error {
	var existing []models.BizSocialLink
	db.Where("biz_id = ?", bizID).Find(&existing)
	existingMap := make(map[uint64]*models.BizSocialLink)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)
	for _, request := range requests {
		var model models.BizSocialLink
		if request.ID != nil && *request.ID != 0 {
			if match, ok := existingMap[uint64(*request.ID)]; ok {
				model = *match
				processedIDs[model.ID] = true
			}
		}
		model.BizID = bizID
		model.Platform = request.Platform
		model.URL = request.URL
		db.Save(&model)
	}
	for id, item := range existingMap {
		if !processedIDs[id] {
			db.Delete(item)
		}
	}
	return nil
}

func (service *Service) uploadImage(file *multipart.FileHeader, projectID int64, folder string) (string, error) {
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
	url, err := service.ObjectStorage.Upload(path, src, contentType)
	if err != nil {
		return "", fmt.Errorf("storage upload failed: %w", err)
	}
	return url, nil
}

func (service *Service) deleteImageInBackground(path string) {
	if path == "" {
		return
	}
	go func(url string) {
		_, err := service.ObjectStorage.Delete(url)
		if err != nil {
			fmt.Printf("Failed to delete background image %s: %v\n", url, err)
		}
	}(path)
}

func marshalTheme(theme ThemeRequest) (*json.RawMessage, error) {
	themeJSON, err := json.Marshal(theme)
	if err != nil {
		return nil, err
	}
	rawJSON := json.RawMessage(themeJSON)
	return &rawJSON, nil
}
