package project

const TYPE_RESUME = "resume"

type CreateUpdateProjectRequest struct {
	Name        string                 `json:"name" binding:"required"`
	Description string                 `json:"description"`
	SubDomain   string                 `json:"sub_domain" binding:"required"`
	Type        string                 `json:"type" binding:"required,oneof=portfolio biz links waitlist"`
	LayoutName  string                 `json:"layout_name" binding:"required"`
	ThemeName   string                 `json:"theme_name" binding:"required"`
	ThemeObject map[string]interface{} `json:"theme_object" binding:"required"`
}

type Payload struct {
	Name        string
	Description string
	SubDomain   string
	Type        string
	LayoutName  string
	ThemeName   string
	ThemeObject map[string]interface{}
}

func (request CreateUpdateProjectRequest) ToServicePayload() Payload {
	return Payload(request)
}
