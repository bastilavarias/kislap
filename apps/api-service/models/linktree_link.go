package models

import (
	"time"

	"gorm.io/gorm"
)

type LinktreeLink struct {
	ID         uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	LinktreeID uint64 `gorm:"index" json:"linktree_id"`

	PlacementOrder    int     `json:"placement_order"`
	Type              string  `gorm:"size:80;default:link" json:"type"`
	Title             string  `gorm:"size:255" json:"title"`
	URL               string  `gorm:"type:text" json:"url"`
	AppURL            *string `gorm:"type:text" json:"app_url"`
	ImageURL          *string `gorm:"size:255" json:"image_url"`
	Description       *string `gorm:"type:text" json:"description"`
	IconKey           *string `gorm:"size:80" json:"icon_key"`
	AccentColor       *string `gorm:"size:50" json:"accent_color"`
	QuoteText         *string `gorm:"type:text" json:"quote_text"`
	QuoteAuthor       *string `gorm:"size:255" json:"quote_author"`
	BannerText        *string `gorm:"type:text" json:"banner_text"`
	SupportNote       *string `gorm:"type:text" json:"support_note"`
	SupportQRImageURL *string `gorm:"size:255" json:"support_qr_image_url"`
	CTALabel          *string `gorm:"size:100" json:"cta_label"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (LinktreeLink) TableName() string {
	return "linktree_links"
}
