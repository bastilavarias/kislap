package menu

import "mime/multipart"

type ThemeStyle map[string]string

type ThemeRequest struct {
	Preset string                       `json:"preset"`
	Styles map[string]map[string]string `json:"styles"`
}

type QRSettingsRequest struct {
	ForegroundColor string `json:"foreground_color"`
	BackgroundColor string `json:"background_color"`
	ShowLogo        bool   `json:"show_logo"`
}

type BusinessHoursEntryRequest struct {
	Day    string `json:"day"`
	Open   string `json:"open"`
	Close  string `json:"close"`
	Closed bool   `json:"closed"`
}

type SocialLinkRequest struct {
	Platform string `json:"platform"`
	URL      string `json:"url"`
}

type GalleryImageRequest struct {
	ImageURL *string               `json:"image_url"`
	Image    *multipart.FileHeader `json:"image"`
}

type MenuCategoryRequest struct {
	ID             *int64                `json:"id"`
	ClientKey      string                `json:"client_key"`
	Name           string                `json:"name"`
	Description    *string               `json:"description"`
	ImageURL       *string               `json:"image_url"`
	Image          *multipart.FileHeader `json:"image"`
	PlacementOrder int                   `json:"placement_order"`
	IsVisible      bool                  `json:"is_visible"`
}

type MenuItemRequest struct {
	ID             *int64                `json:"id"`
	CategoryID     *int64                `json:"category_id"`
	CategoryKey    *string               `json:"category_key"`
	Name           string                `json:"name"`
	Description    *string               `json:"description"`
	ImageURL       *string               `json:"image_url"`
	Image          *multipart.FileHeader `json:"image"`
	Badge          *string               `json:"badge"`
	Price          string                `json:"price"`
	Variants       []MenuItemVariantRequest `json:"variants"`
	PlacementOrder int                   `json:"placement_order"`
	IsAvailable    bool                  `json:"is_available"`
	IsFeatured     bool                  `json:"is_featured"`
}

type MenuItemVariantRequest struct {
	Name           string `json:"name"`
	Price          string `json:"price"`
	IsDefault      bool   `json:"is_default"`
	PlacementOrder int    `json:"placement_order"`
}

type CreateUpdateMenuRequest struct {
	MenuID        *int64                      `json:"menu_id"`
	ProjectID     int64                       `json:"project_id" binding:"required"`
	UserID        int64                       `json:"user_id" binding:"required"`
	Name          string                      `json:"name" binding:"required"`
	Description   *string                     `json:"description"`
	LogoURL       *string                     `json:"logo_url"`
	Logo          *multipart.FileHeader       `json:"logo"`
	CoverImageURL *string                     `json:"cover_image_url"`
	CoverImage    *multipart.FileHeader       `json:"cover_image"`
	Phone         *string                     `json:"phone"`
	Email         *string                     `json:"email"`
	WebsiteURL    *string                     `json:"website_url"`
	Address       *string                     `json:"address"`
	City          *string                     `json:"city"`
	GoogleMapsURL *string                     `json:"google_maps_url"`
	LayoutName    string                      `json:"layout_name"`
	Theme         *ThemeRequest               `json:"theme"`
	QRSettings    *QRSettingsRequest          `json:"qr_settings"`
	SearchEnabled bool                        `json:"search_enabled"`
	HoursEnabled  bool                        `json:"hours_enabled"`
	BusinessHours []BusinessHoursEntryRequest `json:"business_hours"`
	SocialLinks   []SocialLinkRequest         `json:"social_links"`
	GalleryImages []GalleryImageRequest       `json:"gallery_images"`
	Categories    []MenuCategoryRequest       `json:"categories"`
	Items         []MenuItemRequest           `json:"items"`
}

type Payload struct {
	MenuID        *int64
	ProjectID     int64
	UserID        int64
	Name          string
	Description   *string
	LogoURL       *string
	Logo          *multipart.FileHeader
	CoverImageURL *string
	CoverImage    *multipart.FileHeader
	Phone         *string
	Email         *string
	WebsiteURL    *string
	Address       *string
	City          *string
	GoogleMapsURL *string
	LayoutName    string
	Theme         *ThemeRequest
	QRSettings    *QRSettingsRequest
	SearchEnabled bool
	HoursEnabled  bool
	BusinessHours []BusinessHoursEntryRequest
	SocialLinks   []SocialLinkRequest
	GalleryImages []GalleryImageRequest
	Categories    []MenuCategoryRequest
	Items         []MenuItemRequest
}

func (request *CreateUpdateMenuRequest) ToServicePayload() Payload {
	return Payload{
		MenuID:        request.MenuID,
		ProjectID:     request.ProjectID,
		UserID:        request.UserID,
		Name:          request.Name,
		Description:   request.Description,
		LogoURL:       request.LogoURL,
		Logo:          request.Logo,
		CoverImageURL: request.CoverImageURL,
		CoverImage:    request.CoverImage,
		Phone:         request.Phone,
		Email:         request.Email,
		WebsiteURL:    request.WebsiteURL,
		Address:       request.Address,
		City:          request.City,
		GoogleMapsURL: request.GoogleMapsURL,
		LayoutName:    request.LayoutName,
		Theme:         request.Theme,
		QRSettings:    request.QRSettings,
		SearchEnabled: request.SearchEnabled,
		HoursEnabled:  request.HoursEnabled,
		BusinessHours: request.BusinessHours,
		SocialLinks:   request.SocialLinks,
		GalleryImages: request.GalleryImages,
		Categories:    request.Categories,
		Items:         request.Items,
	}
}
