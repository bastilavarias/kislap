package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Menu struct {
	ID        uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	ProjectID uint64 `gorm:"index" json:"project_id"`
	UserID    uint64 `gorm:"index" json:"user_id"`

	Name                  string           `gorm:"column:name;size:255" json:"name"`
	Description           *string          `gorm:"column:description;type:text" json:"description"`
	LogoURL               *string          `gorm:"column:logo_url;size:255" json:"logo_url"`
	CoverImageURL         *string          `gorm:"column:cover_image_url;size:255" json:"cover_image_url"`
	Phone                 *string          `gorm:"column:phone;size:50" json:"phone"`
	Email                 *string          `gorm:"column:email;size:255" json:"email"`
	WebsiteURL            *string          `gorm:"column:website_url;type:text" json:"website_url"`
	Address               *string          `gorm:"column:address;type:text" json:"address"`
	City                  *string          `gorm:"column:city;size:120" json:"city"`
	GoogleMapsURL         *string          `gorm:"column:google_maps_url;type:text" json:"google_maps_url"`
	LayoutName            *string          `gorm:"column:layout_name;size:255;default:menu-default" json:"layout_name"`
	ThemeName             *string          `gorm:"column:theme_name;size:255;default:default" json:"theme_name"`
	ThemeObject           *json.RawMessage `gorm:"column:theme_object;type:json" json:"theme_object"`
	QRSettings            *json.RawMessage `gorm:"column:qr_settings;type:json" json:"qr_settings"`
	DisplayPosterSettings *json.RawMessage `gorm:"column:display_poster_settings;type:json" json:"display_poster_settings"`
	DisplayPosterImageURL *string          `gorm:"column:display_poster_image_url;size:255" json:"display_poster_image_url"`
	SearchEnabled         bool             `gorm:"column:search_enabled;default:true" json:"search_enabled"`
	HoursEnabled          bool             `gorm:"column:hours_enabled;default:false" json:"hours_enabled"`
	BusinessHours         *json.RawMessage `gorm:"column:business_hours;type:json" json:"business_hours"`
	SocialLinks           *json.RawMessage `gorm:"column:social_links;type:json" json:"social_links"`
	GalleryImages         *json.RawMessage `gorm:"column:gallery_images;type:json" json:"gallery_images"`

	Categories []MenuCategory `gorm:"foreignKey:MenuID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"categories"`
	Items      []MenuItem     `gorm:"foreignKey:MenuID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"items"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (Menu) TableName() string {
	return "menus"
}
