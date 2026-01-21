package biz

import (
	"encoding/json"
	"flash/internal/project"
	"flash/models"
	objectStorage "flash/sdk/object_storage"
	"fmt"
	"mime/multipart"

	"gorm.io/gorm"
)

type Service struct {
	DB             *gorm.DB
	ProjectService *project.Service
	ObjectStorage  objectStorage.Provider
}

func (service Service) Save(payload Payload) (*models.Biz, error) {

	var themeRaw []byte
	if payload.Theme != nil {
		var err error
		themeRaw, err = json.Marshal(payload.Theme)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal theme: %w", err)
		}
	}

	services, err := service.buildServices(payload.Services, payload.ProjectID)
	if err != nil {
		return nil, err
	}

	products, err := service.buildProducts(payload.Products, payload.ProjectID)
	if err != nil {
		return nil, err
	}

	testimonials, err := service.buildTestimonials(payload.Testimonials, payload.ProjectID)
	if err != nil {
		return nil, err
	}

	socials := buildSocialLinks(payload.SocialLinks)

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
			Services:        services,
			Products:        products,
			Testimonials:    testimonials,
			SocialLinks:     socials,
		}

		if len(themeRaw) > 0 {
			msg := json.RawMessage(themeRaw)
			biz.ThemeObject = &msg
		}

		if err := service.DB.Create(&biz).Error; err != nil {
			return nil, err
		}
	} else {
		err := service.DB.Transaction(func(tx *gorm.DB) error {
			if err := tx.First(&biz, payload.BizID).Error; err != nil {
				return err
			}

			tx.Where("biz_id = ?", biz.ID).Delete(&models.Service{})
			tx.Where("biz_id = ?", biz.ID).Delete(&models.Product{})
			tx.Where("biz_id = ?", biz.ID).Delete(&models.Testimonial{})
			tx.Where("biz_id = ?", biz.ID).Delete(&models.BizSocialLink{})

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

			biz.Services = services
			biz.Products = products
			biz.Testimonials = testimonials
			biz.SocialLinks = socials

			return tx.Save(&biz).Error
		})
		if err != nil {
			return nil, err
		}
	}

	return &biz, nil
}

func (s Service) uploadImage(file *multipart.FileHeader, projectID int64, folder string) (string, error) {
	if file == nil {
		return "", nil
	}
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	path := fmt.Sprintf("projects/%d/biz/%s/%s", projectID, folder, file.Filename)
	url, err := s.ObjectStorage.Upload(path, src, file.Header.Get("Content-Type"))
	if err != nil {
		return "", err
	}
	return url, nil
}

func (s Service) buildServices(reqs []ServiceRequest, projectID int64) ([]models.Service, error) {
	var services []models.Service
	for _, req := range reqs {
		imgURL := req.ImageURL
		if req.Image != nil {
			url, err := s.uploadImage(req.Image, projectID, "services")
			if err != nil {
				return nil, err
			}
			imgURL = &url
		}

		services = append(services, models.Service{
			Name:            req.Name,
			Description:     req.Description,
			Price:           req.Price,
			DurationMinutes: req.DurationMinutes,
			IsFeatured:      req.IsFeatured,
			ImageURL:        imgURL,
		})
	}
	return services, nil
}

func (s Service) buildProducts(reqs []ProductRequest, projectID int64) ([]models.Product, error) {
	var products []models.Product
	for _, req := range reqs {
		imgURL := req.ImageURL
		if req.Image != nil {
			url, err := s.uploadImage(req.Image, projectID, "products")
			if err != nil {
				return nil, err
			}
			imgURL = &url
		}

		products = append(products, models.Product{
			Name:        req.Name,
			Description: req.Description,
			Price:       req.Price,
			Stock:       req.Stock,
			IsActive:    req.IsActive,
			ImageURL:    imgURL,
		})
	}
	return products, nil
}

func (s Service) buildTestimonials(reqs []TestimonialRequest, projectID int64) ([]models.Testimonial, error) {
	var testimonials []models.Testimonial
	for _, req := range reqs {
		avatarURL := req.AvatarURL
		if req.Avatar != nil {
			url, err := s.uploadImage(req.Avatar, projectID, "testimonials")
			if err != nil {
				return nil, err
			}
			avatarURL = &url
		}

		testimonials = append(testimonials, models.Testimonial{
			Author:    req.Author,
			Rating:    req.Rating,
			Content:   req.Content,
			AvatarURL: avatarURL,
		})
	}
	return testimonials, nil
}

func buildSocialLinks(reqs []SocialLinkRequest) []models.BizSocialLink {
	var links []models.BizSocialLink
	for _, req := range reqs {
		links = append(links, models.BizSocialLink{
			Platform: req.Platform,
			URL:      req.URL,
		})
	}
	return links
}
