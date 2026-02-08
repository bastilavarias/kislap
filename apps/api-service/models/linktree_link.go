package models

import (
	"time"

	"gorm.io/gorm"
)

type LinktreeLink struct {
	ID         uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	LinktreeID uint64 `gorm:"index" json:"linktree_id"`

	PlacementOrder int     `json:"placement_order"`
	Title          string  `gorm:"size:255" json:"title"`
	URL            string  `gorm:"type:text" json:"url"`
	ImageURL       *string `gorm:"size:255" json:"image_url"`
	Description    *string `gorm:"type:text" json:"description"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (LinktreeLink) TableName() string {
	return "linktree_links"
}
