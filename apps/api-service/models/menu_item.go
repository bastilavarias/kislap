package models

import (
	"time"

	"gorm.io/gorm"
)

type MenuItemVariant struct {
	Name           string `json:"name"`
	Price          string `json:"price"`
	IsDefault      bool   `json:"is_default"`
	PlacementOrder int    `json:"placement_order"`
}

type MenuItem struct {
	ID             uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	MenuID         uint64 `gorm:"index" json:"menu_id"`
	MenuCategoryID uint64 `gorm:"index" json:"menu_category_id"`

	Name           string  `gorm:"size:255" json:"name"`
	Description    *string `gorm:"type:text" json:"description"`
	ImageURL       *string `gorm:"size:255" json:"image_url"`
	Badge          *string `gorm:"size:80" json:"badge"`
	Price          string  `gorm:"size:80" json:"price"`
	Variants       []MenuItemVariant `gorm:"serializer:json;type:json" json:"variants"`
	PlacementOrder int     `gorm:"default:0" json:"placement_order"`
	IsAvailable    bool    `gorm:"default:true" json:"is_available"`
	IsFeatured     bool    `gorm:"default:false" json:"is_featured"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (MenuItem) TableName() string {
	return "menu_items"
}
