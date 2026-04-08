package dashboard

import (
	"flash/models"

	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

type PublicMetrics struct {
	SitesPublished int64            `json:"sites_published"`
	ActiveBuilders int64            `json:"active_builders"`
	TotalViews     int64            `json:"total_views"`
	TotalClicks    int64            `json:"total_clicks"`
	CTR            float64          `json:"ctr"`
	ProjectTypes   map[string]int64 `json:"project_types"`
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

func (service Service) PublicMetrics() (*PublicMetrics, error) {
	metrics := &PublicMetrics{
		ProjectTypes: map[string]int64{
			"portfolio": 0,
			"linktree":  0,
			"menu":      0,
			"biz":       0,
			"waitlist":  0,
		},
	}

	if err := service.DB.
		Model(&models.Project{}).
		Where("published = ?", 1).
		Count(&metrics.SitesPublished).Error; err != nil {
		return nil, err
	}

	if err := service.DB.
		Model(&models.Project{}).
		Where("published = ?", 1).
		Distinct("user_id").
		Count(&metrics.ActiveBuilders).Error; err != nil {
		return nil, err
	}

	if err := service.DB.
		Model(&models.PageActivity{}).
		Where("type = ?", "view").
		Count(&metrics.TotalViews).Error; err != nil {
		return nil, err
	}

	if err := service.DB.
		Model(&models.PageActivity{}).
		Where("type = ?", "click").
		Count(&metrics.TotalClicks).Error; err != nil {
		return nil, err
	}

	if metrics.TotalViews > 0 {
		metrics.CTR = float64(metrics.TotalClicks) / float64(metrics.TotalViews) * 100
	}

	type typeCountRow struct {
		Type  string
		Total int64
	}

	var rows []typeCountRow
	if err := service.DB.
		Model(&models.Project{}).
		Select("type, COUNT(*) as total").
		Where("published = ?", 1).
		Group("type").
		Scan(&rows).Error; err != nil {
		return nil, err
	}

	for _, row := range rows {
		metrics.ProjectTypes[row.Type] = row.Total
	}

	return metrics, nil
}
