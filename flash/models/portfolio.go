package models

import "time"

type Portfolio struct {
	ID        uint64    `gorm:"primaryKey;autoIncrement"`
	Name      string    `gorm:"size:255;not null"`
	Intro     string    `gorm:"type:text;not null"`
	Email     string    `gorm:"size:255;not null;uniqueIndex"`
	Password  string    `gorm:"size:255;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
