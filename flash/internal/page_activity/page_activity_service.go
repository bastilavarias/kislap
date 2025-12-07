package page_activity

import (
	"flash/models"

	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

type Stats struct {
	TotalViews     int64 `json:"total_views"`
	TotalClicks    int64 `json:"total_clicks"`
	UniqueVisitors int64 `json:"unique_visitors"`
}
type PageCount struct {
	PageURL string `json:"page_url"`
	Count   int64  `json:"count"`
}

func (service *Service) Track(payload Payload) error {
	activity := models.PageActivity{
		ProjectID: payload.ProjectID,
		Type:      payload.Type,
		PageURL:   payload.PageURL,
		IPAddress: payload.IPAddress,
		ModelID:   payload.ModelID,
		ModelName: payload.ModelName,
	}

	return service.DB.Create(&activity).Error
}

func (service *Service) GetStats(projectID uint64, page int, limit int) (*Stats, error) {
	var stats Stats

	base := service.DB.Model(&models.PageActivity{}).Where("project_id = ?", projectID)

	if err := base.Where("type = ?", "view").Count(&stats.TotalViews).Error; err != nil {
		return nil, err
	}

	if err := base.Where("type = ?", "click").Count(&stats.TotalClicks).Error; err != nil {
		return nil, err
	}

	if err := base.Distinct("ip_address").Count(&stats.UniqueVisitors).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

func (service *Service) GetTopPages(projectID uint64, limit int) ([]PageCount, int64, error) {
	var topPages []PageCount
	var total int64

	if limit <= 0 {
		limit = 5
	}

	pageActivity := service.DB.Model(&models.PageActivity{}).
		Where("project_id = ?", projectID).
		Where("type = ?", "view")

	if err := pageActivity.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := pageActivity.
		Select("page_url, count(*) as count").
		Group("page_url").
		Order("count(*) DESC").
		Order("page_url").
		Limit(limit).
		Scan(&topPages).
		Error

	return topPages, total, err
}

func (service *Service) GetRecentActivities(projectID uint64, page int, limit int) ([]models.PageActivity, error) {
	var activities []models.PageActivity

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	offset := (page - 1) * limit

	err := service.DB.
		Model(&models.PageActivity{}).
		Where("project_id = ?", projectID).
		Order("id DESC").
		Offset(offset).
		Limit(limit).
		Find(&activities).
		Error

	return activities, err
}
