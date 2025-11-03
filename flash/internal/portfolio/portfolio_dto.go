package portfolio

type WorkExperienceRequest struct {
	Company   string  `json:"company" binding:"required"`
	Role      string  `json:"role" binding:"required"`
	URL       *string `json:"url"`
	Location  *string `json:"location"`
	StartDate string  `json:"startDate" binding:"required"` // frontend sends string "2024"
	EndDate   *string `json:"endDate"`                      // can be "Present" or "2022"
	About     *string `json:"about"`
}

type EducationRequest struct {
	School    string  `json:"school" binding:"required"`
	Level     string  `json:"level" binding:"required"`
	Degree    string  `json:"degree"`
	Location  string  `json:"location"`
	YearStart *string `json:"yearStart"` // can be null → pointer
	YearEnd   *string `json:"yearEnd"`   // can be null → pointer
	About     string  `json:"about"`
}

type SkillRequest struct {
	Name string  `json:"name" binding:"required"`
	URL  *string `json:"url,omitempty"`
}

type ShowcaseTechnologyRequest struct {
	Name string `json:"name" binding:"required"`
}

type ShowcaseRequest struct {
	Name         string                      `json:"name" binding:"required"`
	Description  *string                     `json:"description"`
	URL          *string                     `json:"url"`
	Role         *string                     `json:"role"`
	Technologies []ShowcaseTechnologyRequest `json:"technologies"`
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
	Styles map[string]ThemeStyle `json:"styles"` // light & dark
}

type CreateUpdatePortfolioRequest struct {
	PortfolioID     *int64                  `json:"portfolio_id"`
	UserID          int64                   `json:"user_id" binding:"required"`
	ProjectID       int64                   `json:"project_id" binding:"required"`
	Name            string                  `json:"name" binding:"required"`
	Location        string                  `json:"location"`
	JobTitle        string                  `json:"job_title"`
	Introduction    string                  `json:"introduction"`
	About           string                  `json:"about"`
	Email           string                  `json:"email" binding:"required,email"`
	Phone           string                  `json:"phone" binding:"required"`
	Website         string                  `json:"website"`
	Github          string                  `json:"github"`
	Linkedin        string                  `json:"linkedin"`
	Twitter         string                  `json:"twitter"`
	Theme           *ThemeRequest           `json:"theme"`
	WorkExperiences []WorkExperienceRequest `json:"work_experiences"`
	Education       []EducationRequest      `json:"education"`
	Skills          []SkillRequest          `json:"skills"`
	Showcases       []ShowcaseRequest       `json:"showcases"`
}

type Payload struct {
	PortfolioID     *int64
	UserID          int64
	ProjectID       int64
	Name            string
	Location        string
	JobTitle        string
	Introduction    string
	About           string
	Email           string
	Phone           string
	Website         string
	Github          string
	Linkedin        string
	Twitter         string
	Theme           *ThemeRequest
	WorkExperiences []WorkExperienceRequest
	Education       []EducationRequest
	Skills          []SkillRequest
	Showcases       []ShowcaseRequest
}

func (request CreateUpdatePortfolioRequest) ToServicePayload() Payload {
	return Payload(request)
}
