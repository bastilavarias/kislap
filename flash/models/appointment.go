package models

import (
	"time"

	"gorm.io/gorm"
)

type Appointment struct {
	ID        uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint64 `gorm:"not null;index" json:"user_id"`
	ProjectID uint64 `gorm:"not null;index" json:"project_id"`

	Date     *time.Time `gorm:"type:date" json:"date,omitempty"`
	TimeFrom *time.Time `gorm:"column:time_from;type:time" json:"time_from,omitempty"`
	TimeTo   *time.Time `gorm:"column:time_to;type:time" json:"time_to,omitempty"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	User    *User    `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user,omitempty"`
	Project *Project `gorm:"foreignKey:ProjectID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"project,omitempty"`
}
