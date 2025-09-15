package portfolio

import (
	"flash/models"
	"fmt"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service Service) Create(payload Payload) {
	var workExperiences []models.WorkExperience
	for _, we := range payload.WorkExperiences {
		workExperiences = append(workExperiences, models.WorkExperience{
			Company:   &we.Company,
			Role:      &we.Role,
			Location:  &we.Location,
			StartDate: &we.StartDate,
			EndDate:   &we.EndDate,
			About:     &we.About,
		})
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
	}
}
