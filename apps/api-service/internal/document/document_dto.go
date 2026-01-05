package document

import "io"

type ParseDocumentRequest struct {
	Type string `form:"type" binding:"required"`
}

type Payload struct {
	Type string
	File io.Reader
}

func (request ParseDocumentRequest) ToServicePayload(file io.Reader) Payload {
	return Payload{
		Type: request.Type,
		File: file,
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
