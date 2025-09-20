package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Project struct {
	ID          uint64          `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string          `gorm:"size:255;not null" json:"name"`
	Description string          `gorm:"type:text" json:"description,omitempty"`
	Slug        string          `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	SubDomain   *string         `gorm:"column:sub_domain;size:255" json:"sub_domain,omitempty"`
	Type        string          `gorm:"type:enum('portfolio','biz','links','waitlist');default:portfolio" json:"type"`
	LayoutName  string          `gorm:"size:255;default:default" json:"layout"`
	ThemeName   string          `gorm:"size:255;default:default" json:"theme_name"`
	ThemeObject json.RawMessage `gorm:"type:json" json:"theme_object"`
	CreatedAt   time.Time       `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time       `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt  `gorm:"index" json:"deleted_at,omitempty"`
}
