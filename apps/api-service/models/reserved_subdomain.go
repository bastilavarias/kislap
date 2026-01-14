package models

import (
	"time"
)

type ReservedSubDomain struct {
	ID        uint64    `gorm:"primaryKey;autoIncrement" json:"id"`
	SubDomain string    `gorm:"column:sub_domain;size:255;uniqueIndex;not null" json:"sub_domain"`
	Type      *string   `gorm:"size:255" json:"type,omitempty"` // Pointer because migration is nullable
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (ReservedSubDomain) TableName() string {
	return "reserved_sub_domains"
}
