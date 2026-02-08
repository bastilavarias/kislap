package linktree

import (
	"encoding/json"
	"mime/multipart"
)

type LinktreeLinkRequest struct {
	ID             *int64                `form:"id" json:"id"`
	Title          string                `form:"platform" json:"platform"`
	URL            string                `form:"url" json:"url"`
	Description    *string               `form:"description" json:"description"`
	ImageURL       *string               `form:"image_url" json:"image_url"`
	Image          *multipart.FileHeader `form:"image" json:"image"`
	PlacementOrder *int                  `form:"placement_order" json:"placement_order"`
}

type Payload struct {
	LinktreeID *int64
	ProjectID  int64
	UserID     int64

	Name    string
	Tagline string
	LogoURL *string
	Logo    *multipart.FileHeader

	LayoutName string
	Theme      *ThemeRequest

	Links []LinktreeLinkRequest
}

type ThemeRequest struct {
	Preset string          `json:"preset"`
	Values json.RawMessage `json:"values"`
}

func (r *LinktreeDTO) ToServicePayload(projectID, userID int64, linktreeID *int64) Payload {
	return Payload{
		LinktreeID: linktreeID,
		ProjectID:  projectID,
		UserID:     userID,
		Name:       r.Name,
		Tagline:    r.Tagline,
		LogoURL:    r.LogoURL,
		LayoutName: r.LayoutName,
		Theme:      r.Theme,
		Links:      r.SocialLinks,
	}
}

type LinktreeDTO struct {
	ID          *int64                `form:"id" json:"id"`
	Name        string                `form:"name" json:"name"`
	Tagline     string                `form:"tagline" json:"tagline"`
	LogoURL     *string               `form:"logo_url" json:"logo_url"`
	LayoutName  string                `form:"layout_name" json:"layout_name"`
	Theme       *ThemeRequest         `form:"theme" json:"theme"`
	SocialLinks []LinktreeLinkRequest `form:"social_links" json:"social_links"`
}
