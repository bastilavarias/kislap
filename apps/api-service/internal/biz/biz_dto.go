package biz

import (
	"encoding/json"
	"mime/multipart"
)

type ServiceRequest struct {
	Name            string                `form:"name" json:"name"`
	Description     *string               `form:"description" json:"description"`
	Price           float64               `form:"price" json:"price"`
	DurationMinutes int                   `form:"duration_minutes" json:"duration_minutes"`
	IsFeatured      bool                  `form:"is_featured" json:"is_featured"`
	ImageURL        *string               `form:"image_url" json:"image_url"`
	Image           *multipart.FileHeader `form:"image" json:"-"`
}

type ProductRequest struct {
	Name        string                `form:"name" json:"name"`
	Description *string               `form:"description" json:"description"`
	Price       float64               `form:"price" json:"price"`
	Stock       int                   `form:"stock" json:"stock"`
	IsActive    bool                  `form:"is_active" json:"is_active"`
	ImageURL    *string               `form:"image_url" json:"image_url"`
	Image       *multipart.FileHeader `form:"image" json:"-"`
}

type TestimonialRequest struct {
	Author   string                `form:"author" json:"author"`
	Rating   int                   `form:"rating" json:"rating"`
	Content  *string               `form:"content" json:"content"`
	ImageURL *string               `form:"image_url" json:"image_url"`
	Image    *multipart.FileHeader `form:"image" json:"-"`
}

type SocialLinkRequest struct {
	Platform string `form:"platform" json:"platform"`
	URL      string `form:"url" json:"url"`
}

type ThemeRequest struct {
	Name   string          `form:"name" json:"name"`
	Object json.RawMessage `form:"object" json:"object"`
}

type CreateUpdateBizRequest struct {
	BizID     *int64 `form:"biz_id" json:"biz_id"`
	ProjectID int64  `form:"project_id" json:"project_id" binding:"required"`

	Name        string `form:"name" json:"name"`
	Slug        string `form:"slug" json:"slug"`
	Tagline     string `form:"tagline" json:"tagline"`
	Description string `form:"description" json:"description"`

	Email   string  `form:"email" json:"email"`
	Phone   *string `form:"phone" json:"phone"`
	Address *string `form:"address" json:"address"`
	Website string  `form:"website" json:"website"`

	ServicesEnabled bool `form:"services_enabled" json:"services_enabled"`
	ProductsEnabled bool `form:"products_enabled" json:"products_enabled"`
	BookingEnabled  bool `form:"booking_enabled" json:"booking_enabled"`
	OrderingEnabled bool `form:"ordering_enabled" json:"ordering_enabled"`

	LayoutName string        `form:"layout_name" json:"layout_name"`
	Theme      *ThemeRequest `form:"theme" json:"theme"`

	Services     []ServiceRequest     `form:"services" json:"services"`
	Products     []ProductRequest     `form:"products" json:"products"`
	Testimonials []TestimonialRequest `form:"testimonials" json:"testimonials"`
	SocialLinks  []SocialLinkRequest  `form:"social_links" json:"social_links"`
}

type Payload struct {
	CreateUpdateBizRequest
	UserID int64
}

func (request CreateUpdateBizRequest) ToServicePayload(userID int64) Payload {
	return Payload{
		CreateUpdateBizRequest: request,
		UserID:                 userID,
	}
}
