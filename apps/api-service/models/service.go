package models

import (
	"time"

	"gorm.io/gorm"
)

type Service struct {
	ID              uint64  `gorm:"primaryKey;autoIncrement" json:"id"`
	BizID           uint64  `gorm:"index" json:"biz_id"`
	Name            string  `gorm:"size:255" json:"name"`
	Description     *string `gorm:"type:text" json:"description"`
	Price           float64 `gorm:"type:decimal(10,2)" json:"price"`
	DurationMinutes int     `json:"duration_minutes"`
	IsFeatured      bool    `gorm:"default:false" json:"is_featured"`
	ImageURL        *string `gorm:"type:text" json:"image_url"`
	PlacementOrder  *int    `gorm:"type:int" json:"placement_order"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (Service) TableName() string {
	return "services"
}
