package portfolio

import (
	_ "github.com/go-playground/validator/v10"
	"time"
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
		Company   string     `json:"company" binding:"required"`
		Role      string     `json:"role" binding:"required"`
		Location  string     `json:"location"`
		StartDate time.Time  `json:"start_date" binding:"required"`
		EndDate   *time.Time `json:"end_date" binding:"omitempty"`
		About     *string    `json:"about"`
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
		StartDate time.Time
		EndDate   *time.Time
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
	payload := Payload{
		UserID:       int(request.UserID),
		ProjectID:    int(request.ProjectID),
		Name:         request.Name,
		JobTitle:     request.JobTitle,
		Introduction: request.Introduction,
		About:        request.About,
		Email:        request.Email,
		Phone:        request.Phone,
		Website:      request.Website,
		Github:       request.Github,
		Linkedin:     request.Linkedin,
		Twitter:      request.Twitter,
	}

	for _, workExperiences := range request.WorkExperiences {
		payload.WorkExperiences = append(payload.WorkExperiences, struct {
			Company   string
			Role      string
			Location  string
			StartDate time.Time
			EndDate   *time.Time
			About     *string
		}{
			Company:   workExperiences.Company,
			Role:      workExperiences.Role,
			Location:  workExperiences.Location,
			StartDate: workExperiences.StartDate,
			EndDate:   workExperiences.EndDate,
			About:     workExperiences.About,
		})
	}

	for _, education := range request.Education {
		payload.Education = append(payload.Education, struct {
			School    string
			Level     *string
			Degree    *string
			Location  *string
			YearStart *int
			YearEnd   *int
			About     *string
		}{
			School:    education.School,
			Level:     education.Level,
			Degree:    education.Degree,
			Location:  education.Location,
			YearStart: education.YearStart,
			YearEnd:   education.YearEnd,
			About:     education.About,
		})
	}

	for _, skill := range request.Skills {
		payload.Skills = append(payload.Skills, struct {
			Name string
			URL  *string
		}{
			Name: skill.Name,
			URL:  skill.URL,
		})
	}

	for _, showcase := range request.Showcases {
		showcase := struct {
			Name         string
			Description  string
			Role         string
			Technologies []struct {
				Name string
			}
		}{
			Name:        showcase.Name,
			Description: showcase.Description,
			Role:        showcase.Role,
		}

		for _, tech := range showcase.Technologies {
			showcase.Technologies = append(showcase.Technologies, struct {
				Name string
			}{
				Name: tech.Name,
			})
		}

		payload.Showcases = append(payload.Showcases, showcase)
	}

	return payload
}
