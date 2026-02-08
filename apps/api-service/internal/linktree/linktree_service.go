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
	return &linktree, nil
}

func (s *Service) Save(payload Payload) (*models.Linktree, error) {
	var themeRaw *json.RawMessage
	var themeName *string

	if payload.Theme != nil {
		// Create a JSON object combining preset and values if needed,
		// or just store the values. Matches existing Biz logic.
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

	// 1. Update Basic Fields
	linktree.Name = payload.Name
	linktree.Tagline = &payload.Tagline
	linktree.LayoutName = &payload.LayoutName

	if themeName != nil {
		linktree.ThemeName = themeName
		linktree.ThemeObject = themeRaw
	}

	// 2. Handle Logo Upload
	if payload.Logo != nil {
		logoUrl, err := s.uploadFile(payload.Logo, payload.ProjectID, "logo")
		if err != nil {
			return nil, err
		}
		linktree.LogoURL = &logoUrl
	} else if payload.LogoURL == nil {
		// If both file and URL are null, it means image was removed
		linktree.LogoURL = nil
	}

	// 3. Save Parent
	if err := s.DB.Save(&linktree).Error; err != nil {
		return nil, err
	}

	// 4. Handle Links (Children)
	if err := s.syncLinks(linktree.ID, payload.ProjectID, payload.Links); err != nil {
		return nil, err
	}

	// Refresh to return full object
	return s.Get(int64(linktree.ProjectID))
}

func (s *Service) syncLinks(linktreeID uint64, projectID int64, requests []LinktreeLinkRequest) error {
	var existingLinks []models.LinktreeLink
	s.DB.Where("linktree_id = ?", linktreeID).Find(&existingLinks)

	existingMap := make(map[uint64]*models.LinktreeLink)
	for i := range existingLinks {
		existingMap[existingLinks[i].ID] = &existingLinks[i]
	}

	processedIDs := make(map[uint64]bool)

	for i, req := range requests {
		var link models.LinktreeLink

		if req.ID != nil && *req.ID > 0 {
			if match, ok := existingMap[uint64(*req.ID)]; ok {
				link = *match
				processedIDs[link.ID] = true
			}
		}

		link.LinktreeID = linktreeID
		link.Title = req.Title
		link.URL = req.URL
		link.Description = req.Description
		link.PlacementOrder = i // Use array index for order

		// Handle Link Image Upload
		if req.Image != nil {
			imgUrl, err := s.uploadFile(req.Image, projectID, "links")
			if err != nil {
				return err
			}
			link.ImageURL = &imgUrl
		} else if req.ImageURL == nil {
			link.ImageURL = nil
		} else {
			// Keep existing URL
			link.ImageURL = req.ImageURL
		}

		if err := s.DB.Save(&link).Error; err != nil {
			return err
		}
	}

	// Delete removed items
	for id, item := range existingMap {
		if !processedIDs[id] {
			s.DB.Delete(item)
		}
	}

	return nil
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
