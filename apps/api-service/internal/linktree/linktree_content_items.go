package linktree

import "flash/models"

func (s *Service) syncContentItems(linktreeID uint64, projectID int64, links []LinktreeLinkRequest, sections []LinktreeSectionRequest) error {
	var existingItems []models.LinktreeLink
	s.DB.Where("linktree_id = ?", linktreeID).Find(&existingItems)

	existingMap := make(map[uint64]*models.LinktreeLink)
	for i := range existingItems {
		existingMap[existingItems[i].ID] = &existingItems[i]
	}

	processedIDs := make(map[uint64]bool)

	for i, req := range links {
		var item models.LinktreeLink

		if req.ID != nil && *req.ID > 0 {
			if match, ok := existingMap[uint64(*req.ID)]; ok {
				item = *match
				processedIDs[item.ID] = true
			}
		}

		item.LinktreeID = linktreeID
		if req.Type != nil && *req.Type != "" {
			item.Type = *req.Type
		} else {
			item.Type = "link"
		}
		item.Title = req.Title
		item.URL = req.URL
		item.Description = req.Description
		item.AppURL = req.AppURL
		item.IconKey = req.IconKey
		item.AccentColor = req.AccentColor
		item.QuoteText = req.QuoteText
		item.QuoteAuthor = req.QuoteAuthor
		item.BannerText = req.BannerText
		item.SupportNote = req.SupportNote
		item.CTALabel = req.CTALabel
		if req.PlacementOrder != nil {
			item.PlacementOrder = *req.PlacementOrder
		} else {
			item.PlacementOrder = i
		}

		if req.Image != nil {
			imgURL, err := s.uploadFile(req.Image, projectID, "linktrees")
			if err != nil {
				return err
			}
			item.ImageURL = &imgURL
		} else if req.ImageURL == nil {
			item.ImageURL = nil
		} else {
			item.ImageURL = req.ImageURL
		}

		if req.SupportQRImage != nil {
			imageURL, err := s.uploadFile(req.SupportQRImage, projectID, "linktrees")
			if err != nil {
				return err
			}
			item.SupportQRImageURL = &imageURL
		} else if req.SupportQRImageURL == nil {
			item.SupportQRImageURL = nil
		} else {
			item.SupportQRImageURL = req.SupportQRImageURL
		}

		if err := s.DB.Save(&item).Error; err != nil {
			return err
		}
	}

	for i, req := range sections {
		var item models.LinktreeLink
		if req.ID != nil && *req.ID > 0 {
			if match, ok := existingMap[uint64(*req.ID)]; ok {
				item = *match
				processedIDs[item.ID] = true
			}
		}

		item.LinktreeID = linktreeID
		if req.Type != "" {
			item.Type = req.Type
		} else {
			item.Type = "promo"
		}
		item.Title = derefString(req.Title)
		item.URL = derefString(req.URL)
		item.Description = req.Description
		item.AppURL = req.AppURL
		item.IconKey = req.IconKey
		item.AccentColor = req.AccentColor
		item.QuoteText = req.QuoteText
		item.QuoteAuthor = req.QuoteAuthor
		item.BannerText = req.BannerText
		item.SupportNote = req.SupportNote
		item.CTALabel = req.CTALabel
		if req.PlacementOrder != nil {
			item.PlacementOrder = *req.PlacementOrder
		} else {
			item.PlacementOrder = i
		}

		if req.Image != nil {
			imageURL, err := s.uploadFile(req.Image, projectID, "sections")
			if err != nil {
				return err
			}
			item.ImageURL = &imageURL
		} else if req.ImageURL == nil {
			item.ImageURL = nil
		} else {
			item.ImageURL = req.ImageURL
		}

		if req.SupportQRImage != nil {
			imageURL, err := s.uploadFile(req.SupportQRImage, projectID, "sections")
			if err != nil {
				return err
			}
			item.SupportQRImageURL = &imageURL
		} else if req.SupportQRImageURL != nil {
			item.SupportQRImageURL = req.SupportQRImageURL
		}

		if err := s.DB.Save(&item).Error; err != nil {
			return err
		}
	}

	for id, item := range existingMap {
		if !processedIDs[id] {
			s.DB.Delete(item)
		}
	}

	return nil
}

func splitLinksAndSections(items []models.LinktreeLink) ([]models.LinktreeLink, []models.LinktreeSection) {
	links := make([]models.LinktreeLink, 0)
	sections := make([]models.LinktreeSection, 0)

	for _, item := range items {
		if item.Type == "" || item.Type == "link" {
			links = append(links, item)
			continue
		}

		sectionType := item.Type
		title := nullable(item.Title)
		url := nullable(item.URL)

		sections = append(sections, models.LinktreeSection{
			ID:                item.ID,
			LinktreeID:        item.LinktreeID,
			PlacementOrder:    item.PlacementOrder,
			Type:              sectionType,
			Title:             title,
			Description:       item.Description,
			URL:               url,
			AppURL:            item.AppURL,
			ImageURL:          item.ImageURL,
			IconKey:           item.IconKey,
			AccentColor:       item.AccentColor,
			QuoteText:         item.QuoteText,
			QuoteAuthor:       item.QuoteAuthor,
			BannerText:        item.BannerText,
			SupportNote:       item.SupportNote,
			SupportQRImageURL: item.SupportQRImageURL,
			CTALabel:          item.CTALabel,
			CreatedAt:         item.CreatedAt,
			UpdatedAt:         item.UpdatedAt,
			DeletedAt:         item.DeletedAt,
		})
	}

	return links, sections
}

func nullable(value string) *string {
	if value == "" {
		return nil
	}
	v := value
	return &v
}

func derefString(value *string) string {
	if value == nil {
		return ""
	}
	return *value
}
