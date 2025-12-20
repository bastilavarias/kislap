package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	FirstName    string         `gorm:"size:255;not null" json:"first_name"`
	LastName     string         `gorm:"size:255;not null" json:"last_name"`
	Email        string         `gorm:"size:255;not null;unique" json:"email"`
	Password     *string        `gorm:"size:255;not null" json:"-"`
	MobileNumber *string        `gorm:"size:20" json:"mobile_number,omitempty"`
	Role         string         `gorm:"size:50;not null;default:default" json:"role"`
	RefreshToken *string        `gorm:"size:255" json:"refresh_token,omitempty"`
	ImageURL     *string        `gorm:"size:255" json:"image_url,omitempty"`
	Newsletter   bool           `gorm:"type:int" json:"newsletter"`
	Github       bool           `gorm:"type:int" json:"github"`
	Google       bool           `gorm:"type:int" json:"google"`
	CreatedAt    time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}
