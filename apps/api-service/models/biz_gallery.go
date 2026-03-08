package models

import (
	"time"

	"gorm.io/gorm"
)

type BizGallery struct {
	ID             uint64  `gorm:"primaryKey;autoIncrement" json:"id"`
	BizID          uint64  `gorm:"index" json:"biz_id"`
	ImageURL       *string `gorm:"size:255" json:"image_url"`
	PlacementOrder *int    `gorm:"default:0" json:"placement_order"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (BizGallery) TableName() string {
	return "biz_gallery"
}
