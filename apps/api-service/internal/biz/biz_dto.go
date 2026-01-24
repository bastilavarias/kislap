package biz

import (
	"mime/multipart"
)

type ServiceRequest struct {
	ID              *int64                `form:"id" json:"id"`
	Name            string                `form:"name" json:"name"`
	Description     *string               `form:"description" json:"description"`
	Price           float64               `form:"price" json:"price"`
	DurationMinutes int                   `form:"duration_minutes" json:"duration_minutes"`
	IsFeatured      bool                  `form:"is_featured" json:"is_featured"`
	ImageURL        *string               `form:"image_url" json:"image_url"`
	Image           *multipart.FileHeader `form:"image" json:"image"`
	PlacementOrder  *int                  `form:"placement_order" json:"placement_order"`
}

type ProductRequest struct {
	ID             *int64                `form:"id" json:"id"`
	Name           string                `form:"name" json:"name"`
	Description    *string               `form:"description" json:"description"`
	Price          float64               `form:"price" json:"price"`
	Stock          int                   `form:"stock" json:"stock"`
	IsActive       bool                  `form:"is_active" json:"is_active"`
	ImageURL       *string               `form:"image_url" json:"image_url"`
	Image          *multipart.FileHeader `form:"image" json:"image"`
	PlacementOrder *int                  `form:"placement_order" json:"placement_order"`
}

type TestimonialRequest struct {
	ID             *int64                `form:"id" json:"id"`
	Author         string                `form:"author" json:"author"`
	Rating         int                   `form:"rating" json:"rating"`
	Content        *string               `form:"content" json:"content"`
	AvatarURL      *string               `form:"avatar_url" json:"avatar_url"`
	Avatar         *multipart.FileHeader `form:"avatar" json:"avatar"`
	PlacementOrder *int                  `form:"placement_order" json:"placement_order"`
}

type SocialLinkRequest struct {
	ID             *int64 `form:"id" json:"id"`
	Platform       string `form:"platform" json:"platform"`
	URL            string `form:"url" json:"url"`
	PlacementOrder *int   `form:"placement_order" json:"placement_order"`
}

type ThemeStyle struct {
	Background               string `json:"background"`
	Foreground               string `json:"foreground"`
	Card                     string `json:"card"`
	CardForeground           string `json:"card-foreground"`
	Popover                  string `json:"popover"`
	PopoverForeground        string `json:"popover-foreground"`
	Primary                  string `json:"primary"`
	PrimaryForeground        string `json:"primary-foreground"`
	Secondary                string `json:"secondary"`
	SecondaryForeground      string `json:"secondary-foreground"`
	Muted                    string `json:"muted"`
	MutedForeground          string `json:"muted-foreground"`
	Accent                   string `json:"accent"`
	AccentForeground         string `json:"accent-foreground"`
	Destructive              string `json:"destructive"`
	Border                   string `json:"border"`
	Input                    string `json:"input"`
	Ring                     string `json:"ring"`
	Chart1                   string `json:"chart-1"`
	Chart2                   string `json:"chart-2"`
	Chart3                   string `json:"chart-3"`
	Chart4                   string `json:"chart-4"`
	Chart5                   string `json:"chart-5"`
	Radius                   string `json:"radius"`
	Sidebar                  string `json:"sidebar"`
	SidebarForeground        string `json:"sidebar-foreground"`
	SidebarPrimary           string `json:"sidebar-primary"`
	SidebarPrimaryForeground string `json:"sidebar-primary-foreground"`
	SidebarAccent            string `json:"sidebar-accent"`
	SidebarAccentForeground  string `json:"sidebar-accent-foreground"`
	SidebarBorder            string `json:"sidebar-border"`
	SidebarRing              string `json:"sidebar-ring"`
	FontSans                 string `json:"font-sans"`
	FontSerif                string `json:"font-serif"`
	FontMono                 string `json:"font-mono"`
	ShadowColor              string `json:"shadow-color"`
	ShadowOpacity            string `json:"shadow-opacity"`
	ShadowBlur               string `json:"shadow-blur"`
	ShadowSpread             string `json:"shadow-spread"`
	ShadowOffsetX            string `json:"shadow-offset-x"`
	ShadowOffsetY            string `json:"shadow-offset-y"`
	LetterSpacing            string `json:"letter-spacing"`
	Spacing                  string `json:"spacing"`
}

type ThemeRequest struct {
	Preset string                `json:"preset"`
	Styles map[string]ThemeStyle `json:"styles"`
}

type CreateUpdateBizRequest struct {
	BizID     *int64 `form:"biz_id" json:"biz_id"`
	ProjectID int64  `form:"project_id" json:"project_id" binding:"required"`
	UserID    int64  `form:"user_id" json:"user_id" binding:"required"`

	Name        string `form:"name" json:"name"`
	Tagline     string `form:"tagline" json:"tagline"`
	Description string `form:"description" json:"description"`

	Email   string  `form:"email" json:"email"`
	Phone   *string `form:"phone" json:"phone"`
	Address *string `form:"address" json:"address"`

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
	BizID     *int64
	ProjectID int64
	UserID    int64

	Name        string
	Tagline     string
	Description string

	Email   string
	Phone   *string
	Address *string

	ServicesEnabled bool
	ProductsEnabled bool
	BookingEnabled  bool
	OrderingEnabled bool

	LayoutName string
	Theme      *ThemeRequest

	Services     []ServiceRequest
	Products     []ProductRequest
	Testimonials []TestimonialRequest
	SocialLinks  []SocialLinkRequest
}

func (request CreateUpdateBizRequest) ToServicePayload() Payload {
	return Payload(request)
}
