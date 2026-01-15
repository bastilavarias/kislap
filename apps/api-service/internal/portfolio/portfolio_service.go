package portfolio

import (
	"encoding/json"
	"errors"
	Project "flash/internal/project"
	"flash/models"
	"fmt"

	"gorm.io/gorm"
)

type Service struct {
	DB             *gorm.DB
	ProjectService *Project.Service
}

func (service Service) Save(payload Payload) (*models.Portfolio, error) {
	themeRaw, err := marshalTheme(*payload.Theme)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal theme: %w", err)
	}

	newWorkExperiences := buildWorkExperiences(payload.WorkExperiences)
	newEducation := buildEducation(payload.Education)
	newSkills := buildSkills(payload.Skills)
	newShowcases := buildShowcases(payload.Showcases)

	var portfolio models.Portfolio

	if payload.PortfolioID == nil {
		portfolio = models.Portfolio{
			UserID:          uint64(payload.UserID),
			ProjectID:       uint64(payload.ProjectID),
			Name:            payload.Name,
			Location:        &payload.Location,
			JobTitle:        &payload.JobTitle,
			Introduction:    &payload.Introduction,
			About:           &payload.About,
			Email:           &payload.Email,
			Phone:           payload.Phone,
			Website:         &payload.Website,
			Github:          &payload.Github,
			Linkedin:        &payload.Linkedin,
			Twitter:         &payload.Twitter,
			ThemeName:       &payload.Theme.Preset,
			ThemeObject:     themeRaw,
			LayoutName:      &payload.LayoutName,
			WorkExperiences: newWorkExperiences,
			Education:       newEducation,
			Skills:          newSkills,
			Showcases:       newShowcases,
		}

		if err := service.DB.Create(&portfolio).Error; err != nil {
			return nil, fmt.Errorf("failed to create portfolio: %w", err)
		}
	} else {
		if err := service.DB.First(&portfolio, payload.PortfolioID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, fmt.Errorf("portfolio with ID %d not found", payload.PortfolioID)
			}
			return nil, fmt.Errorf("failed to find portfolio: %w", err)
		}

		portfolio.Name = payload.Name
		portfolio.Location = &payload.Location
		portfolio.JobTitle = &payload.JobTitle
		portfolio.Introduction = &payload.Introduction
		portfolio.About = &payload.About
		portfolio.Email = &payload.Email
		portfolio.Phone = payload.Phone
		portfolio.Website = &payload.Website
		portfolio.Github = &payload.Github
		portfolio.Linkedin = &payload.Linkedin
		portfolio.Twitter = &payload.Twitter
		portfolio.ThemeName = &payload.Theme.Preset
		portfolio.ThemeObject = themeRaw
		portfolio.LayoutName = &payload.LayoutName

		if err := service.DB.Transaction(func(tx *gorm.DB) error {
			if err := tx.Model(&portfolio).Association("WorkExperiences").Clear(); err != nil {
				return err
			}
			if err := tx.Model(&portfolio).Association("Education").Clear(); err != nil {
				return err
			}
			if err := tx.Model(&portfolio).Association("Skills").Clear(); err != nil {
				return err
			}
			if err := tx.Model(&portfolio).Association("Showcases").Clear(); err != nil {
				return err
			}

			portfolio.WorkExperiences = newWorkExperiences
			portfolio.Education = newEducation
			portfolio.Skills = newSkills
			portfolio.Showcases = newShowcases

			return tx.Save(&portfolio).Error
		}); err != nil {
			return nil, fmt.Errorf("failed to update portfolio: %w", err)
		}
	}

	return service.GetByIDWithPreloads(portfolio.ID)
}

func (service Service) GetByIDWithPreloads(id uint64) (*models.Portfolio, error) {
	var portfolio models.Portfolio
	if err := service.DB.
		Preload("WorkExperiences").
		Preload("Education").
		Preload("Skills").
		Preload("Showcases.ShowcaseTechnologies").
		First(&portfolio, id).Error; err != nil {
		return nil, err
	}
	return &portfolio, nil
}

func (service Service) Delete(portfolioID uint64) error {
	portfolio, err := service.GetByIDWithPreloads(portfolioID)

	if err != nil {
		return err
	}

	if err := service.DB.Select(
		"WorkExperiences", "Education", "Skills", "Showcases", "Showcases.Technologies",
	).Delete(&portfolio).Error; err != nil {
		return err
	}

	return nil
}

func buildWorkExperiences(workPayloads []WorkExperienceRequest) []models.WorkExperience {
	var workExperiences []models.WorkExperience
	for _, workExperience := range workPayloads {
		workExperiences = append(workExperiences, models.WorkExperience{
			Company:   workExperience.Company,
			Role:      workExperience.Role,
			URL:       workExperience.URL,
			Location:  workExperience.Location,
			StartDate: workExperience.StartDate,
			EndDate:   workExperience.EndDate,
			About:     workExperience.About,
		})
	}
	return workExperiences
}

func buildEducation(eduPayloads []EducationRequest) []models.Education {
	var education []models.Education
	for _, edu := range eduPayloads {
		education = append(education, models.Education{
			School:    edu.School,
			Level:     edu.Level,
			Degree:    &edu.Degree,
			Location:  &edu.Location,
			YearStart: edu.YearStart,
			YearEnd:   edu.YearEnd,
			About:     &edu.About,
		})
	}
	return education
}

func buildSkills(skillPayloads []SkillRequest) []models.Skill {
	var skills []models.Skill
	for _, skill := range skillPayloads {
		skills = append(skills, models.Skill{
			Name: skill.Name,
			URL:  skill.URL,
		})
	}
	return skills
}

func buildShowcases(showcasePayloads []ShowcaseRequest) []models.Showcase {
	var showcases []models.Showcase
	for _, showcase := range showcasePayloads {
		var technologies []models.ShowcaseTechnology
		for _, technology := range showcase.Technologies {
			technologies = append(technologies, models.ShowcaseTechnology{
				Name: technology.Name,
			})
		}

		showcases = append(showcases, models.Showcase{
			Name:                 showcase.Name,
			Description:          showcase.Description,
			URL:                  showcase.URL,
			Role:                 showcase.Role,
			ShowcaseTechnologies: technologies,
		})
	}
	return showcases
}

func marshalTheme(theme ThemeRequest) (*json.RawMessage, error) {
	themeJSON, err := json.Marshal(theme)
	if err != nil {
		return nil, err
	}
	rawJSON := json.RawMessage(themeJSON)
	return &rawJSON, nil
}
