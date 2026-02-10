package linktree

import (
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
	About   string
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
	About   string                `form:"about" json:"about"`
	LogoURL *string               `form:"logo_url" json:"logo_url"`
	Logo    *multipart.FileHeader `form:"logo" json:"logo"`

	LayoutName string        `form:"layout_name" json:"layout_name"`
	Theme      *ThemeRequest `form:"theme" json:"theme"`

	Links []LinktreeLinkRequest `form:"links" json:"links"`
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

func (request *CreateUpdateLinktreeRequest) ToServicePayload() Payload {
	return Payload{
		LinktreeID: request.LinktreeID,
		ProjectID:  request.ProjectID,
		UserID:     request.UserID,
		Name:       request.Name,
		Tagline:    request.Tagline,
		About:      request.About,
		LogoURL:    request.LogoURL,
		Logo:       request.Logo,
		LayoutName: request.LayoutName,
		Theme:      request.Theme,
		Links:      request.Links,
	}
}
