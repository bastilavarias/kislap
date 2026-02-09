package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Linktree struct {
	ID        uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	ProjectID uint64 `gorm:"index" json:"project_id"`
	UserID    uint64 `gorm:"index" json:"user_id"`

	Name    string  `gorm:"size:255" json:"name"`
	Tagline *string `gorm:"size:255" json:"tagline"`
	LogoURL *string `gorm:"size:255" json:"logo_url"`

	LayoutName  *string          `gorm:"size:255;default:linktree-default" json:"layout_name"`
	ThemeName   *string          `gorm:"size:255;default:default" json:"theme_name"`
	ThemeObject *json.RawMessage `gorm:"type:json" json:"theme_object"`

	Links []LinktreeLink `gorm:"foreignKey:LinktreeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"links"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (Linktree) TableName() string {
	return "linktrees"
}
