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

	LogoURL         *string `gorm:"size:255" json:"logo_url"`
	HeroTitle       *string `gorm:"size:255" json:"hero_title"`
	HeroDescription *string `gorm:"type:text" json:"hero_description"`
	HeroImageURL    *string `gorm:"size:255" json:"hero_image_url"`
	AboutImageURL   *string `gorm:"size:255" json:"about_image_url"`

	Email          *string `gorm:"size:255" json:"email"`
	Phone          *string `gorm:"size:255" json:"phone"`
	Address        *string `gorm:"size:255" json:"address"`
	MapLink        *string `gorm:"type:text" json:"map_link"`
	Schedule       *string `gorm:"size:255" json:"schedule"`
	OperationHours *string `gorm:"size:255" json:"operation_hours"`

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
	FAQs         []BizFAQ        `gorm:"foreignKey:BizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"biz_faqs"`
	Gallery      []BizGallery    `gorm:"foreignKey:BizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"biz_gallery"`
}

func (Biz) TableName() string {
	return "bizs"
}
