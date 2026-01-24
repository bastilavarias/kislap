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

func (service *Service) deleteImageInBackground(path string) {
	if path == "" {
		return
	}
	go func(p string) {
		_, err := service.ObjectStorage.Delete(p)
		if err != nil {
			fmt.Printf("Failed to delete background image %s: %v\n", p, err)
		}
	}(path)
}

func (service *Service) Save(payload Payload) (*models.Biz, error) {
	var themeRaw []byte
	if payload.Theme != nil {
		var err error
		themeRaw, err = json.Marshal(payload.Theme)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal theme: %w", err)
		}
	}

	var biz models.Biz

	if payload.BizID == nil {
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

		if err := service.DB.Create(&biz).Error; err != nil {
			return nil, err
		}

		if err := service.runAllSyncs(service.DB, &biz, payload); err != nil {
			return nil, err
		}

	} else {
		err := service.DB.Transaction(func(tx *gorm.DB) error {
			if err := tx.First(&biz, payload.BizID).Error; err != nil {
				return err
			}

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

			return service.runAllSyncs(tx, &biz, payload)
		})
		if err != nil {
			return nil, err
		}
	}

	service.DB.Preload("Services").Preload("Products").Preload("Testimonials").Preload("SocialLinks").First(&biz, biz.ID)

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
	return nil
}

func (service *Service) syncServices(db *gorm.DB, bizID uint64, projectID int64, requests []ServiceRequest) error {
	var existing []models.Service
	if err := db.Where("biz_id = ?", bizID).Find(&existing).Error; err != nil {
		return err
	}
	existingMap := make(map[uint64]*models.Service)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)

	for _, req := range requests {
		var model models.Service
		var oldImage string

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
			url, err := service.uploadImage(req.Image, projectID, "services")
			if err != nil {
				return err
			}
			newImgURL = &url
			if oldImage != "" {
				service.deleteImageInBackground(oldImage)
			}
		} else if req.ImageURL == nil && oldImage != "" {
		}

		model.BizID = bizID
		model.Name = req.Name
		model.Description = req.Description
		model.Price = req.Price
		model.DurationMinutes = req.DurationMinutes
		model.IsFeatured = req.IsFeatured
		model.ImageURL = newImgURL

		if model.ID != 0 {
			if err := db.Save(&model).Error; err != nil {
				return err
			}
		} else {
			if err := db.Create(&model).Error; err != nil {
				return err
			}
		}
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			if err := db.Delete(item).Error; err != nil {
				return err
			}
			if item.ImageURL != nil {
				service.deleteImageInBackground(*item.ImageURL)
			}
		}
	}
	return nil
}

func (service *Service) syncProducts(db *gorm.DB, bizID uint64, projectID int64, requests []ProductRequest) error {
	var existing []models.Product
	if err := db.Where("biz_id = ?", bizID).Find(&existing).Error; err != nil {
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

		fmt.Println(req)

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
			url, err := service.uploadImage(req.Image, projectID, "products")
			if err != nil {
				return err
			}
			newImgURL = &url
			if oldImage != "" {
				service.deleteImageInBackground(oldImage)
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
			if err := db.Save(&model).Error; err != nil {
				return err
			}
		} else {
			if err := db.Create(&model).Error; err != nil {
				return err
			}
		}
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			if err := db.Delete(item).Error; err != nil {
				return err
			}
			if item.ImageURL != nil {
				service.deleteImageInBackground(*item.ImageURL)
			}
		}
	}
	return nil
}

func (service *Service) syncTestimonials(db *gorm.DB, bizID uint64, projectID int64, requests []TestimonialRequest) error {
	var existing []models.Testimonial
	if err := db.Where("biz_id = ?", bizID).Find(&existing).Error; err != nil {
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
			url, err := service.uploadImage(req.Avatar, projectID, "testimonials")
			if err != nil {
				return err
			}
			newAvatarURL = &url
			if oldAvatar != "" {
				service.deleteImageInBackground(oldAvatar)
			}
		}

		model.BizID = bizID
		model.Author = req.Author
		model.Rating = req.Rating
		model.Content = req.Content
		model.AvatarURL = newAvatarURL

		if model.ID != 0 {
			if err := db.Save(&model).Error; err != nil {
				return err
			}
		} else {
			if err := db.Create(&model).Error; err != nil {
				return err
			}
		}
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			if err := db.Delete(item).Error; err != nil {
				return err
			}
			if item.AvatarURL != nil {
				service.deleteImageInBackground(*item.AvatarURL)
			}
		}
	}
	return nil
}

func (service *Service) syncSocialLinks(db *gorm.DB, bizID uint64, requests []SocialLinkRequest) error {
	var existing []models.BizSocialLink
	if err := db.Where("biz_id = ?", bizID).Find(&existing).Error; err != nil {
		return err
	}

	existingMap := make(map[uint64]*models.BizSocialLink)
	for i := range existing {
		existingMap[existing[i].ID] = &existing[i]
	}
	processedIDs := make(map[uint64]bool)

	for _, req := range requests {
		var model models.BizSocialLink

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
			if err := db.Save(&model).Error; err != nil {
				return err
			}
		} else {
			if err := db.Create(&model).Error; err != nil {
				return err
			}
		}
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			if err := db.Delete(item).Error; err != nil {
				return err
			}
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
