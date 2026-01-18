package models

import (
	"time"

	"gorm.io/gorm"
)

type Testimonial struct {
	ID       uint64  `gorm:"primaryKey;autoIncrement" json:"id"`
	BizID    uint64  `gorm:"index" json:"biz_id"`
	Author   string  `gorm:"size:255" json:"author"`
	Rating   int     `json:"rating"`
	Content  *string `gorm:"type:text" json:"content"`
	ImageURL *string `gorm:"type:text" json:"image_url"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (Testimonial) TableName() string {
	return "testimonials"
}
