package portfolio

import "time"

type WorkExperienceRequest struct {
	Company   string     `json:"company" binding:"required"`
	Role      string     `json:"role" binding:"required"`
	Location  string     `json:"location"`
	StartDate time.Time  `json:"start_date" binding:"required"`
	EndDate   *time.Time `json:"end_date" binding:"omitempty"`
	About     *string    `json:"about"`
}

type EducationRequest struct {
	School    string  `json:"school" binding:"required"`
	Level     string  `json:"level" binding:"required"`
	Degree    *string `json:"degree"`
	Location  *string `json:"location"`
	YearStart *int    `json:"year_start"`
	YearEnd   *int    `json:"year_end"`
	About     *string `json:"about"`
}

type SkillRequest struct {
	Name string  `json:"name" binding:"required"`
	URL  *string `json:"url" binding:"omitempty,url"`
}

type ShowcaseTechnologyRequest struct {
	Name string `json:"name" binding:"required"`
}

type ShowcaseRequest struct {
	Name         string                      `json:"name" binding:"required"`
	Description  string                      `json:"description"`
	Role         string                      `json:"role"`
	Technologies []ShowcaseTechnologyRequest `json:"technologies" binding:"dive"`
}

type CreateUpdatePortfolioRequest struct {
	UserID          int64                   `json:"user_id" binding:"required"`
	ProjectID       int64                   `json:"project_id" binding:"required"`
	Name            string                  `json:"name" binding:"required"`
	JobTitle        string                  `json:"job_title" binding:"required"`
	Introduction    string                  `json:"introduction"`
	About           string                  `json:"about"`
	Email           string                  `json:"email" binding:"required,email"`
	Phone           string                  `json:"phone" binding:"required"`
	Website         string                  `json:"website" binding:"omitempty,url"`
	Github          string                  `json:"github" binding:"omitempty,url"`
	Linkedin        string                  `json:"linkedin" binding:"omitempty,url"`
	Twitter         string                  `json:"twitter" binding:"omitempty,url"`
	WorkExperiences []WorkExperienceRequest `json:"work_experiences" binding:"dive"`
	Education       []EducationRequest      `json:"education" binding:"dive"`
	Skills          []SkillRequest          `json:"skills" binding:"dive"`
	Showcases       []ShowcaseRequest       `json:"showcases" binding:"dive"`
}

type WorkExperiencePayload struct {
	Company   string
	Role      string
	Location  string
	StartDate time.Time
	EndDate   *time.Time
	About     *string
}

type EducationPayload struct {
	School    string
	Level     string
	Degree    *string
	Location  *string
	YearStart *int
	YearEnd   *int
	About     *string
}

type SkillPayload struct {
	Name string
	URL  *string
}

type ShowcaseTechnologyPayload struct {
	Name string
}

type ShowcasePayload struct {
	Name         string
	Description  string
	Role         string
	Technologies []ShowcaseTechnologyPayload
}

type Payload struct {
	UserID          int
	ProjectID       int
	Name            string
	JobTitle        string
	Introduction    string
	About           string
	Email           string
	Phone           string
	Website         string
	Github          string
	Linkedin        string
	Twitter         string
	WorkExperiences []WorkExperiencePayload
	Education       []EducationPayload
	Skills          []SkillPayload
	Showcases       []ShowcasePayload
}

func (req CreateUpdatePortfolioRequest) ToServicePayload() Payload {
	return Payload{
		UserID:          int(req.UserID),
		ProjectID:       int(req.ProjectID),
		Name:            req.Name,
		JobTitle:        req.JobTitle,
		Introduction:    req.Introduction,
		About:           req.About,
		Email:           req.Email,
		Phone:           req.Phone,
		Website:         req.Website,
		Github:          req.Github,
		Linkedin:        req.Linkedin,
		Twitter:         req.Twitter,
		WorkExperiences: mapWorkExperiences(req.WorkExperiences),
		Education:       mapEducation(req.Education),
		Skills:          mapSkills(req.Skills),
		Showcases:       mapShowcases(req.Showcases),
	}
}

func mapWorkExperiences(reqs []WorkExperienceRequest) []WorkExperiencePayload {
	result := make([]WorkExperiencePayload, len(reqs))
	for i, we := range reqs {
		result[i] = WorkExperiencePayload{
			Company:   we.Company,
			Role:      we.Role,
			Location:  we.Location,
			StartDate: we.StartDate,
			EndDate:   we.EndDate,
			About:     we.About,
		}
	}
	return result
}

func mapEducation(reqs []EducationRequest) []EducationPayload {
	result := make([]EducationPayload, len(reqs))
	for i, edu := range reqs {
		result[i] = EducationPayload{
			School:    edu.School,
			Level:     edu.Level,
			Degree:    edu.Degree,
			Location:  edu.Location,
			YearStart: edu.YearStart,
			YearEnd:   edu.YearEnd,
			About:     edu.About,
		}
	}
	return result
}

func mapSkills(reqs []SkillRequest) []SkillPayload {
	result := make([]SkillPayload, len(reqs))
	for i, s := range reqs {
		result[i] = SkillPayload{
			Name: s.Name,
			URL:  s.URL,
		}
	}
	return result
}

func mapShowcases(reqs []ShowcaseRequest) []ShowcasePayload {
	result := make([]ShowcasePayload, len(reqs))
	for i, sc := range reqs {
		techs := make([]ShowcaseTechnologyPayload, len(sc.Technologies))
		for j, t := range sc.Technologies {
			techs[j] = ShowcaseTechnologyPayload{Name: t.Name}
		}
		result[i] = ShowcasePayload{
			Name:         sc.Name,
			Description:  sc.Description,
			Role:         sc.Role,
			Technologies: techs,
		}
	}
	return result
}
