package document

import "io"

type ParseDocumentRequest struct {
	Type string `form:"type" binding:"required"`
}

type FilePayload struct {
	Name string
	File io.ReadSeeker
}

type Payload struct {
	Type  string
	Files []FilePayload
}

func (request ParseDocumentRequest) ToServicePayload(file io.ReadSeeker, fileName string) Payload {
	return Payload{
		Type: request.Type,
		Files: []FilePayload{
			{
				Name: fileName,
				File: file,
			},
		},
	}
}

type PortfolioResponse struct {
	Name            *string `json:"name"`
	JobTitle        *string `json:"job_title"`
	Introduction    string  `json:"introduction"`
	About           string  `json:"about"`
	Email           string  `json:"email"`
	Phone           string  `json:"phone"`
	Website         string  `json:"website"`
	Github          string  `json:"github"`
	Linkedin        string  `json:"linkedin"`
	Twitter         string  `json:"twitter"`
	WorkExperiences []struct {
		Company   string  `json:"company"`
		Role      string  `json:"role"`
		URL       string  `json:"url"`
		Location  string  `json:"location"`
		StartDate string  `json:"start_date"`
		EndDate   *string `json:"end_date"`
		About     *string `json:"about"`
	} `json:"work_experiences"`
	Education []struct {
		School    string  `json:"school"`
		Level     *string `json:"level"`
		Degree    *string `json:"degree"`
		Location  *string `json:"location"`
		YearStart *string `json:"year_start"`
		YearEnd   *string `json:"year_end"`
		About     *string `json:"about"`
	} `json:"education"`
	Skills []struct {
		Name string  `json:"name"`
		URL  *string `json:"url"`
	} `json:"skills"`
	Showcases []struct {
		Name         string `json:"name"`
		Description  string `json:"description"`
		Role         string `json:"role"`
		URL          string `json:"url"`
		Technologies []struct {
			Name string `json:"name"`
		} `json:"technologies"`
	} `json:"showcases"`
}

type MenuResponse struct {
	Name          *string `json:"name"`
	Description   *string `json:"description"`
	Phone         *string `json:"phone"`
	Email         *string `json:"email"`
	WebsiteURL    *string `json:"website_url"`
	WhatsApp      *string `json:"whatsapp"`
	Address       *string `json:"address"`
	City          *string `json:"city"`
	Country       *string `json:"country"`
	GoogleMapsURL *string `json:"google_maps_url"`
	Categories []struct {
		Name        string  `json:"name"`
		Description *string `json:"description"`
		Items       []struct {
			Name        string  `json:"name"`
			Description *string `json:"description"`
			Price       *string `json:"price"`
			Badge       *string `json:"badge"`
		} `json:"items"`
	} `json:"categories"`
}
