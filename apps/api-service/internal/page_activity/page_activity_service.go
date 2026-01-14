package page_activity

import (
	"flash/models"
	"time"

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
type Visit struct {
	IPAddress string    `json:"ip_address"`
	CreatedAt time.Time `json:"created_at"`
}

type RecentActivity struct {
	Type      string      `json:"type"`
	PageURL   string      `json:"page_url"`
	IPAddress string      `json:"ip_address"`
	ModelData interface{} `json:"model"`
	CreatedAt time.Time   `json:"created_at"`
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

	db := service.DB.Model(&models.PageActivity{}).Where("project_id = ?", projectID)

	if err := db.Where("type = ?", "view").Count(&stats.TotalViews).Error; err != nil {
		return nil, err
	}

	if err := db.Where("type = ?", "click").Count(&stats.TotalClicks).Error; err != nil {
		return nil, err
	}

	if err := db.Distinct("ip_address").Count(&stats.UniqueVisitors).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

func (service *Service) GetVisits(projectID uint64, page int, limit int) ([]Visit, int64, error) {
	var visits []Visit
	var total int64

	if limit <= 0 {
		limit = 5
	}
	if page <= 0 {
		page = 1
	}

	offset := (page - 1) * limit

	baseQuery := service.DB.
		Model(&models.PageActivity{}).
		Select(`
			ip_address,
			MAX(created_at) AS created_at
		`).
		Where("project_id = ?", projectID).
		Where("type = ?", "view").
		Group("ip_address")

	if err := service.DB.
		Model(&models.PageActivity{}).
		Select("ip_address").
		Where("project_id = ?", projectID).
		Where("type = ?", "view").
		Group("ip_address").
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := baseQuery.
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(&visits).Error; err != nil {
		return nil, 0, err
	}

	return visits, total, nil
}

func (service *Service) GetRecentActivities(projectID uint64, page int, limit int) ([]RecentActivity, int64, error) {
	var raw []models.PageActivity
	var total int64
	activities := []RecentActivity{}

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	offset := (page - 1) * limit

	tx := service.DB.Model(&models.PageActivity{}).
		Where("project_id = ?", projectID)

	if err := tx.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := tx.
		Order("id DESC").
		Offset(offset).
		Limit(limit).
		Find(&raw).
		Error

	if err != nil {
		return nil, 0, err
	}

	for _, r := range raw {
		var model interface{}

		if r.ModelName != nil && r.ModelID != nil {
			switch *r.ModelName {
			case "Showcase":
				var m models.Showcase
				service.DB.First(&m, *r.ModelID)
				model = m

			default:
				model = nil
			}
		}

		activities = append(activities, RecentActivity{
			Type:      r.Type,
			PageURL:   r.PageURL,
			IPAddress: r.IPAddress,
			ModelData: model,
			CreatedAt: r.CreatedAt,
		})
	}

	return activities, total, nil
}
