package models

import (
	"time"

	"gorm.io/gorm"
)

type BizFAQ struct {
	ID             uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	BizID          uint64 `gorm:"index" json:"biz_id"`
	Question       string `gorm:"type:text" json:"question"`
	Answer         string `gorm:"type:text" json:"answer"`
	PlacementOrder *int   `gorm:"default:0" json:"placement_order"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (BizFAQ) TableName() string {
	return "biz_faqs"
}
