package models

import (
	"time"

	"gorm.io/gorm"
)

type BizSocialLink struct {
	ID       uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	BizID    uint64 `gorm:"index" json:"biz_id"`
	Platform string `gorm:"size:255" json:"platform"`
	URL      string `gorm:"type:text" json:"url"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (BizSocialLink) TableName() string {
	return "biz_social_links"
}
