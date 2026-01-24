package models

import (
	"time"

	"gorm.io/gorm"
)

type Project struct {
	ID          uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID      uint64         `gorm:"index" json:"user_id"`
	Name        string         `gorm:"size:255;not null" json:"name"`
	Description string         `gorm:"type:text" json:"description,omitempty"`
	Slug        string         `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	SubDomain   *string        `gorm:"column:sub_domain;size:255" json:"sub_domain,omitempty"`
	OGImageURL  *string        `gorm:"column:og_image_url;size:255" json:"og_image_url,omitempty"`
	Type        string         `gorm:"type:enum('portfolio','biz','links','waitlist');default:portfolio" json:"type"`
	Published   bool           `gorm:"type:int" json:"published"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	User      *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Portfolio *Portfolio `gorm:"foreignKey:ProjectID" json:"portfolio,omitempty"`
	Biz       *Biz       `gorm:"foreignKey:ProjectID" json:"biz,omitempty"`
}

func (Project) TableName() string {
	return "projects"
}
