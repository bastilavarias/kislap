package portfolio

import (
	"flash/models"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service Service) Create(payload Payload) (*models.Portfolio, *error) {
	var workExperiences []models.WorkExperience
	for _, workExperience := range payload.WorkExperiences {
		workExperiences = append(workExperiences, models.WorkExperience{
			Company:   &workExperience.Company,
			Role:      &workExperience.Role,
			Location:  &workExperience.Location,
			StartDate: &workExperience.StartDate,
			EndDate:   workExperience.EndDate,
			About:     workExperience.About,
		})
	}

	var education []models.Education
	for _, edu := range payload.Education {
		education = append(education, models.Education{
			School:    &edu.School,
			Level:     edu.Level,
			Degree:    edu.Degree,
			Location:  edu.Location,
			YearStart: edu.YearStart,
			YearEnd:   edu.YearEnd,
			About:     edu.About,
		})
	}

	var skills []models.Skill
	for _, skill := range payload.Skills {
		skills = append(skills, models.Skill{
			Name: skill.Name,
			URL:  skill.URL,
		})
	}

	var showcases []models.Showcase
	for _, showcase := range payload.Showcases {
		showcases = append(showcases, models.Showcase{
			Name:        showcase.Name,
			Description: &showcase.Description,
			Role:        &showcase.Role,
		})

		var technologies []models.ShowcaseTechnology
		for _, technology := range payload.Showcases {
			technologies = append(technologies, models.ShowcaseTechnology{
				Name: technology.Name,
			})
		}
	}

	portfolio := models.Portfolio{
		UserID:       uint64(payload.UserID),
		ProjectID:    uint64(payload.ProjectID),
		Name:         &payload.Name,
		JobTitle:     &payload.JobTitle,
		Introduction: &payload.Introduction,
		About:        &payload.About,
		Email:        &payload.Email,
		Phone:        &payload.Phone,
		Website:      &payload.Website,
		Github:       &payload.Github,
		Linkedin:     &payload.Linkedin,
		Twitter:      &payload.Twitter,

		WorkExperiences: workExperiences,
		Education:       education,
		Skills:          skills,
		Showcases:       showcases,
	}

	return &portfolio, nil
}
