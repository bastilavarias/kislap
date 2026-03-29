package menu

import (
	"flash/models"
	"fmt"

	"gorm.io/gorm"
)

func (s *Service) syncContent(menuID uint64, projectID int64, categoryRequests []MenuCategoryRequest, itemRequests []MenuItemRequest) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		categoryIDsByKey, keepCategoryIDs, err := s.upsertCategories(tx, menuID, projectID, categoryRequests)
		if err != nil {
			return err
		}
		if err := s.deleteMissingCategories(tx, menuID, keepCategoryIDs); err != nil {
			return err
		}
		return s.syncItems(tx, menuID, projectID, itemRequests, categoryIDsByKey)
	})
}

func (s *Service) upsertCategories(tx *gorm.DB, menuID uint64, projectID int64, requests []MenuCategoryRequest) (map[string]uint64, []uint64, error) {
	categoryIDsByKey := make(map[string]uint64, len(requests))
	keepIDs := make([]uint64, 0, len(requests))

	for index, request := range requests {
		var category models.MenuCategory
		if request.ID != nil {
			if err := tx.Where("menu_id = ? AND id = ?", menuID, *request.ID).First(&category).Error; err != nil {
				return nil, nil, err
			}
		} else {
			category = models.MenuCategory{MenuID: menuID}
		}

		if request.Image != nil {
			imageURL, err := s.uploadFile(request.Image, projectID, fmt.Sprintf("categories/%d", index))
			if err != nil {
				return nil, nil, err
			}
			category.ImageURL = &imageURL
		} else if request.ImageURL == nil {
			category.ImageURL = nil
		}

		category.ClientKey = request.ClientKey
		category.Name = request.Name
		category.Description = request.Description
		category.PlacementOrder = request.PlacementOrder
		category.IsVisible = request.IsVisible

		if err := tx.Save(&category).Error; err != nil {
			return nil, nil, err
		}

		categoryIDsByKey[request.ClientKey] = category.ID
		keepIDs = append(keepIDs, category.ID)
	}

	return categoryIDsByKey, keepIDs, nil
}

func (s *Service) deleteMissingCategories(tx *gorm.DB, menuID uint64, keepIDs []uint64) error {
	query := tx.Where("menu_id = ?", menuID)
	if len(keepIDs) > 0 {
		query = query.Where("id NOT IN ?", keepIDs)
	}
	return query.Delete(&models.MenuCategory{}).Error
}

func (s *Service) syncItems(tx *gorm.DB, menuID uint64, projectID int64, requests []MenuItemRequest, categoryIDsByKey map[string]uint64) error {
	keepIDs := make([]uint64, 0, len(requests))

	for index, request := range requests {
		var item models.MenuItem
		if request.ID != nil {
			if err := tx.Where("menu_id = ? AND id = ?", menuID, *request.ID).First(&item).Error; err != nil {
				return err
			}
		} else {
			item = models.MenuItem{MenuID: menuID}
		}

		categoryID := uint64(0)
		if request.CategoryID != nil {
			categoryID = uint64(*request.CategoryID)
		} else if request.CategoryKey != nil {
			categoryID = categoryIDsByKey[*request.CategoryKey]
		}
		item.MenuCategoryID = categoryID

		if request.Image != nil {
			imageURL, err := s.uploadFile(request.Image, projectID, fmt.Sprintf("items/%d", index))
			if err != nil {
				return err
			}
			item.ImageURL = &imageURL
		} else if request.ImageURL == nil {
			item.ImageURL = nil
		}

		item.Name = request.Name
		item.Description = request.Description
		item.Badge = request.Badge
		item.Price = request.Price
		item.Variants = mapVariantRequests(request.Variants)
		item.PlacementOrder = request.PlacementOrder
		item.IsAvailable = request.IsAvailable
		item.IsFeatured = request.IsFeatured

		if err := tx.Save(&item).Error; err != nil {
			return err
		}
		keepIDs = append(keepIDs, item.ID)
	}

	query := tx.Where("menu_id = ?", menuID)
	if len(keepIDs) > 0 {
		query = query.Where("id NOT IN ?", keepIDs)
	}
	return query.Delete(&models.MenuItem{}).Error
}

func mapVariantRequests(requests []MenuItemVariantRequest) []models.MenuItemVariant {
	if len(requests) == 0 {
		return nil
	}

	variants := make([]models.MenuItemVariant, 0, len(requests))
	for _, request := range requests {
		variants = append(variants, models.MenuItemVariant{
			Name:           request.Name,
			Price:          request.Price,
			IsDefault:      request.IsDefault,
			PlacementOrder: request.PlacementOrder,
		})
	}

	return variants
}
