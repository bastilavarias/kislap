package models

import (
	"time"

	"gorm.io/gorm"
)

type Portfolio struct {
	ID           uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	ProjectID    *uint64        `gorm:"index" json:"project_id"`
	UserID       *uint64        `gorm:"index" json:"user_id"`
	Name         *string        `gorm:"size:255" json:"name"`
	JobTitle     *string        `gorm:"size:255" json:"job_title"`
	Introduction *string        `gorm:"type:text" json:"introduction"`
	About        *string        `gorm:"type:text" json:"about"`
	Email        *string        `gorm:"size:255" json:"email"`
	Phone        *string        `gorm:"size:255" json:"phone"`
	Website      *string        `gorm:"size:255" json:"website"`
	Github       *string        `gorm:"size:255" json:"github"`
	Linkedin     *string        `gorm:"size:255" json:"linkedin"`
	Twitter      *string        `gorm:"size:255" json:"twitter"`
	CreatedAt    time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	Project *Project `gorm:"foreignKey:ProjectID;constraint:OnDelete:SET NULL;"`
	User    *User    `gorm:"foreignKey:UserID;constraint:OnDelete:SET NULL;"`
}
