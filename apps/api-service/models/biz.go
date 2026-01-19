package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Biz struct {
	ID        uint64 `gorm:"primaryKey;autoIncrement" json:"id"`
	ProjectID uint64 `gorm:"index" json:"project_id"`
	UserID    uint64 `gorm:"index" json:"user_id"`

	Name        string  `gorm:"size:255" json:"name"`
	Tagline     *string `gorm:"size:255" json:"tagline"`
	Description *string `gorm:"type:text" json:"description"`

	Email     *string `gorm:"size:255" json:"email"`
	Phone     *string `gorm:"size:255" json:"phone"`
	Address   *string `gorm:"size:255" json:"address"`
	Website   *string `gorm:"size:255" json:"website"`
	Instagram *string `gorm:"size:255" json:"instagram"`

	ServicesEnabled bool `gorm:"default:true" json:"services_enabled"`
	ProductsEnabled bool `gorm:"default:true" json:"products_enabled"`
	BookingEnabled  bool `gorm:"default:false" json:"booking_enabled"`
	OrderingEnabled bool `gorm:"default:false" json:"ordering_enabled"`

	ThemeName   *string          `gorm:"size:255;default:default" json:"theme_name"`
	ThemeObject *json.RawMessage `gorm:"type:json" json:"theme_object"`
	LayoutName  *string          `gorm:"size:255" json:"layout_name"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	Services     []Service       `gorm:"foreignKey:BizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"services"`
	Products     []Product       `gorm:"foreignKey:BizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"products"`
	Testimonials []Testimonial   `gorm:"foreignKey:BizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"testimonials"`
	SocialLinks  []BizSocialLink `gorm:"foreignKey:BizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"social_links"`
}

func (Biz) TableName() string {
	return "bizs"
}
