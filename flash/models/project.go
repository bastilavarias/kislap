package models

import "time"

type Project struct {
	ID          uint64    `gorm:"primaryKey;autoIncrement"`
	Name        string    `gorm:"size:255;not null"`
	Description string    `gorm:"type:text"`
	Slug        string    `gorm:"size:255;uniqueIndex;not null"`
	SubDomain   string    `gorm:"column:sub_domain;size:255"`
	Theme       string    `gorm:"size:255;default:default"`
	Layout      string    `gorm:"size:255;default:default"`
	Type        string    `gorm:"type:enum('portfolio','biz','links','waitlist');default:portfolio"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
}
