package linktree

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

func (s *Service) Get(projectID int64) (*models.Linktree, error) {
	var linktree models.Linktree
	err := s.DB.Preload("Links", func(db *gorm.DB) *gorm.DB {
		return db.Order("placement_order asc")
	}).Where("project_id = ?", projectID).First(&linktree).Error

	if err != nil {
		return nil, err
	}
	linktree.Links, linktree.Sections = splitLinksAndSections(linktree.Links)
	return &linktree, nil
}

func (s *Service) Save(payload Payload) (*models.Linktree, error) {
	var themeRaw *json.RawMessage
	var themeName *string

	if payload.Theme != nil {
		combined, _ := json.Marshal(payload.Theme)
		raw := json.RawMessage(combined)
		themeRaw = &raw
		themeName = &payload.Theme.Preset
	}

	var linktree models.Linktree
	isNew := payload.LinktreeID == nil

	if isNew {
		linktree = models.Linktree{
			UserID:    uint64(payload.UserID),
			ProjectID: uint64(payload.ProjectID),
		}
	} else {
		if err := s.DB.First(&linktree, *payload.LinktreeID).Error; err != nil {
			return nil, err
		}
	}

	linktree.Name = payload.Name
	linktree.Tagline = &payload.Tagline
	linktree.About = &payload.About
	linktree.Phone = &payload.Phone
	linktree.Email = &payload.Email
	linktree.LayoutName = &payload.LayoutName
	linktree.BackgroundStyle = &payload.BackgroundStyle

	if themeName != nil {
		linktree.ThemeName = themeName
		linktree.ThemeObject = themeRaw
	}

	if payload.Logo != nil {
		logoUrl, err := s.uploadFile(payload.Logo, payload.ProjectID, "logo")
		if err != nil {
			return nil, err
		}
		linktree.LogoURL = &logoUrl
	} else if payload.LogoURL == nil {
		linktree.LogoURL = nil
	}

	if err := s.DB.Save(&linktree).Error; err != nil {
		return nil, err
	}

	if err := s.syncContentItems(linktree.ID, payload.ProjectID, payload.Links, payload.Sections); err != nil {
		return nil, err
	}

	return s.Get(int64(linktree.ProjectID))
}

func (s *Service) uploadFile(file *multipart.FileHeader, projectID int64, folder string) (string, error) {
	if file == nil {
		return "", nil
	}
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer src.Close()

	uniqueName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	path := fmt.Sprintf("projects/%d/linktree/%s/%s", projectID, folder, uniqueName)

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
