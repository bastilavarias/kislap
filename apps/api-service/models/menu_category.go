package models

import (
	"time"

	"gorm.io/gorm"
)

type MenuCategory struct {
	ID        uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	MenuID    uint64 `gorm:"index" json:"menu_id"`
	ClientKey string `gorm:"size:80" json:"client_key"`

	Name           string  `gorm:"size:255" json:"name"`
	Description    *string `gorm:"type:text" json:"description"`
	ImageURL       *string `gorm:"size:255" json:"image_url"`
	PlacementOrder int     `gorm:"default:0" json:"placement_order"`
	IsVisible      bool    `gorm:"default:true" json:"is_visible"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (MenuCategory) TableName() string {
	return "menu_categories"
}
