package menu

import (
	"encoding/json"
	"flash/models"
	objectStorage "flash/sdk/object_storage"
	"fmt"
	"mime/multipart"
	"time"

	"gorm.io/gorm"
)

type Service struct {
	DB            *gorm.DB
	ObjectStorage objectStorage.Provider
}

func NewService(db *gorm.DB, storage objectStorage.Provider) *Service {
	return &Service{DB: db, ObjectStorage: storage}
}

func (s *Service) Get(projectID int64) (*models.Menu, error) {
	var menu models.Menu
	err := s.DB.
		Preload("Categories", func(db *gorm.DB) *gorm.DB { return db.Order("placement_order asc") }).
		Preload("Items", func(db *gorm.DB) *gorm.DB { return db.Order("placement_order asc") }).
		Where("project_id = ?", projectID).
		First(&menu).Error
	if err != nil {
		return nil, err
	}
	return &menu, nil
}

func (s *Service) Save(payload Payload) (*models.Menu, error) {
	var menu models.Menu
	isNew := payload.MenuID == nil
	if isNew {
		menu = models.Menu{ProjectID: uint64(payload.ProjectID), UserID: uint64(payload.UserID)}
	} else if err := s.DB.First(&menu, *payload.MenuID).Error; err != nil {
		return nil, err
	}

	themeRaw, themeName := marshalTheme(payload.Theme)
	qrRaw := marshalJSON(payload.QRSettings)
	hoursRaw := marshalJSON(payload.BusinessHours)
	socialRaw := marshalJSON(payload.SocialLinks)
	galleryRaw, err := s.resolveGalleryImages(payload.GalleryImages, payload.ProjectID)
	if err != nil {
		return nil, err
	}

	menu.Name = payload.Name
	menu.Description = payload.Description
	menu.Phone = payload.Phone
	menu.Email = payload.Email
	menu.WebsiteURL = payload.WebsiteURL
	menu.WhatsApp = payload.WhatsApp
	menu.Address = payload.Address
	menu.City = payload.City
	menu.Country = payload.Country
	menu.GoogleMapsURL = payload.GoogleMapsURL
	menu.LayoutName = &payload.LayoutName
	menu.ThemeName = themeName
	menu.ThemeObject = themeRaw
	menu.QRSettings = qrRaw
	menu.SearchEnabled = payload.SearchEnabled
	menu.HoursEnabled = payload.HoursEnabled
	menu.BusinessHours = hoursRaw
	menu.SocialLinks = socialRaw
	menu.GalleryImages = galleryRaw

	if payload.Logo != nil {
		logoURL, err := s.uploadFile(payload.Logo, payload.ProjectID, "logo")
		if err != nil {
			return nil, err
		}
		menu.LogoURL = &logoURL
	} else if payload.LogoURL == nil {
		menu.LogoURL = nil
	}

	if payload.CoverImage != nil {
		coverURL, err := s.uploadFile(payload.CoverImage, payload.ProjectID, "cover")
		if err != nil {
			return nil, err
		}
		menu.CoverImageURL = &coverURL
	} else if payload.CoverImageURL == nil {
		menu.CoverImageURL = nil
	}

	if err := s.DB.Save(&menu).Error; err != nil {
		return nil, err
	}

	if err := s.syncContent(menu.ID, payload.ProjectID, payload.Categories, payload.Items); err != nil {
		return nil, err
	}

	return s.Get(int64(menu.ProjectID))
}

func marshalTheme(theme *ThemeRequest) (*json.RawMessage, *string) {
	if theme == nil {
		return nil, nil
	}
	raw := marshalJSON(theme)
	preset := theme.Preset
	return raw, &preset
}

func marshalJSON(value any) *json.RawMessage {
	if value == nil {
		return nil
	}
	encoded, err := json.Marshal(value)
	if err != nil || string(encoded) == "null" || string(encoded) == "[]" {
		return nil
	}
	raw := json.RawMessage(encoded)
	return &raw
}

func (s *Service) uploadFile(file *multipart.FileHeader, projectID int64, folder string) (string, error) {
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer src.Close()

	uniqueName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	path := fmt.Sprintf("projects/%d/menu/%s/%s", projectID, folder, uniqueName)
	contentType := file.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	url, err := s.ObjectStorage.Upload(path, src, contentType)
	if err != nil {
		return "", fmt.Errorf("storage upload failed: %w", err)
	}
	return url, nil
}

func (s *Service) resolveGalleryImages(
	requests []GalleryImageRequest,
	projectID int64,
) (*json.RawMessage, error) {
	if len(requests) == 0 {
		return nil, nil
	}

	images := make([]string, 0, len(requests))
	for _, request := range requests {
		if request.Image != nil {
			url, err := s.uploadFile(request.Image, projectID, "gallery")
			if err != nil {
				return nil, err
			}
			images = append(images, url)
			continue
		}

		if request.ImageURL != nil && *request.ImageURL != "" {
			images = append(images, *request.ImageURL)
		}
	}

	if len(images) == 0 {
		return nil, nil
	}

	return marshalJSON(images), nil
}
