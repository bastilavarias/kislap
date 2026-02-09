package linktree

import (
	"encoding/json"
	"mime/multipart"
)

type LinktreeLinkRequest struct {
	ID             *int64                `form:"id" json:"id"`
	Title          string                `form:"title" json:"title"`
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

type CreateUpdateLinktreeRequest struct {
	LinktreeID *int64 `form:"linktree_id" json:"linktree_id"`
	ProjectID  int64  `form:"project_id" json:"project_id" binding:"required"`
	UserID     int64  `form:"user_id" json:"user_id" binding:"required"`

	Name    string                `form:"name" json:"name"`
	Tagline string                `form:"tagline" json:"tagline"`
	LogoURL *string               `form:"logo_url" json:"logo_url"`
	Logo    *multipart.FileHeader `form:"logo" json:"logo"`

	LayoutName string        `form:"layout_name" json:"layout_name"`
	Theme      *ThemeRequest `form:"theme" json:"theme"`

	Links []LinktreeLinkRequest `form:"links" json:"links"`
}

type ThemeRequest struct {
	Preset string          `json:"preset"`
	Values json.RawMessage `json:"values"`
}

func (request *CreateUpdateLinktreeRequest) ToServicePayload() Payload {
	return Payload{
		LinktreeID: request.LinktreeID,
		ProjectID:  request.ProjectID,
		UserID:     request.UserID,
		Name:       request.Name,
		Tagline:    request.Tagline,
		LogoURL:    request.LogoURL,
		Logo:       request.Logo,
		LayoutName: request.LayoutName,
		Theme:      request.Theme,
		Links:      request.Links,
	}
}
