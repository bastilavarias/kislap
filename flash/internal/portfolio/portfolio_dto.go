package portfolio

import (
	_ "github.com/go-playground/validator/v10"
)

type CreateUpdatePortfolioRequest struct {
	UserID       int64  `json:"user_id" binding:"required"`
	ProjectID    int64  `json:"project_id" binding:"required"`
	Name         string `json:"name" binding:"required"`
	JobTitle     string `json:"job_title" binding:"required"`
	Introduction string `json:"introduction"`
	About        string `json:"about"`
	Email        string `json:"email" binding:"required,email"`
	Phone        string `json:"phone" binding:"required"`
	Website      string `json:"website" binding:"omitempty,url"`
	Github       string `json:"github" binding:"omitempty,url"`
	Linkedin     string `json:"linkedin" binding:"omitempty,url"`
	Twitter      string `json:"twitter" binding:"omitempty,url"`

	WorkExperiences []struct {
		Company   string  `json:"company" binding:"required"`
		Role      string  `json:"role" binding:"required"`
		Location  string  `json:"location"`
		StartDate string  `json:"start_date" binding:"required"`
		EndDate   *string `json:"end_date" binding:"omitempty"`
		About     *string `json:"about"`
	} `json:"work_experiences" binding:"dive"`

	Education []struct {
		School    string  `json:"school" binding:"required"`
		Level     *string `json:"level"`
		Degree    *string `json:"degree"`
		Location  *string `json:"location"`
		YearStart *int    `json:"year_start"`
		YearEnd   *int    `json:"year_end"`
		About     *string `json:"about"`
	} `json:"education" binding:"dive"`

	Skills []struct {
		Name string  `json:"name" binding:"required"`
		URL  *string `json:"url" binding:"omitempty,url"`
	} `json:"skills" binding:"dive"`

	Showcases []struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
		Role        string `json:"role"`

		Technologies []struct {
			Name string `json:"name" binding:"required"`
		} `json:"technologies" binding:"dive"`
	} `json:"showcases" binding:"dive"`
}

type Payload struct {
	UserID       int
	ProjectID    int
	Name         string
	JobTitle     string
	Introduction string
	About        string
	Email        string
	Phone        string
	Website      string
	Github       string
	Linkedin     string
	Twitter      string

	WorkExperiences []struct {
		Company   string
		Role      string
		Location  string
		StartDate string
		EndDate   *string
		About     *string
	}

	Education []struct {
		School    string
		Level     *string
		Degree    *string
		Location  *string
		YearStart *int
		YearEnd   *int
		About     *string
	}

	Skills []struct {
		Name string
		URL  *string
	}

	Showcases []struct {
		Name        string
		Description string
		Role        string

		Technologies []struct {
			Name string
		}
	}
}

func (request CreateUpdatePortfolioRequest) ToServicePayload() Payload {
	return Payload(request)
}
