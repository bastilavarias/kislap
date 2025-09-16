package portfolio

import (
	"flash/models"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service Service) Create(payload Payload) (*models.Portfolio, error) {
	var workExperiences []models.WorkExperience
	for _, workExperience := range payload.WorkExperiences {
		workExperiences = append(workExperiences, models.WorkExperience{
			Company:   workExperience.Company,
			Role:      workExperience.Role,
			Location:  &workExperience.Location,
			StartDate: &workExperience.StartDate,
			EndDate:   workExperience.EndDate,
			About:     workExperience.About,
		})
	}

	var education []models.Education
	for _, edu := range payload.Education {
		education = append(education, models.Education{
			School:    edu.School,
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

	rawPortfolio := models.Portfolio{
		UserID:       uint64(payload.UserID),
		ProjectID:    uint64(payload.ProjectID),
		Name:         payload.Name,
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

	if err := service.DB.
		Create(&rawPortfolio).Error; err != nil {
		return nil, err
	}

	var portfolio models.Portfolio
	err := service.DB.Find(&portfolio, rawPortfolio.ID).Error
	if err != nil {
		return nil, err
	}

	return &portfolio, nil
}

func (service Service) Get(portfolioID uint64) (*models.Portfolio, error) {
	var portfolio models.Portfolio
	err := service.DB.
		Preload("User").
		Preload("Project").
		Preload("WorkExperiences").
		Preload("Education").
		Preload("Skills").
		Preload("Showcases").
		First(&portfolio, portfolioID).Error
	if err != nil {
		return nil, err
	}

	if &portfolio.ID == nil {
		return nil, gorm.ErrRecordNotFound
	}

	return &portfolio, nil
}

func (service Service) Update(portfolioID uint64, payload Payload) (*models.Portfolio, error) {
	portfolio, err := service.Get(portfolioID)
	if err != nil {
		return nil, err
	}

	portfolio.Name = payload.Name
	portfolio.JobTitle = &payload.JobTitle
	portfolio.Introduction = &payload.Introduction
	portfolio.About = &payload.About
	portfolio.Email = &payload.Email
	portfolio.Phone = &payload.Phone
	portfolio.Website = &payload.Website
	portfolio.Github = &payload.Github
	portfolio.Linkedin = &payload.Linkedin
	portfolio.Twitter = &payload.Twitter
	portfolio.ProjectID = uint64(payload.ProjectID)
	portfolio.UserID = uint64(payload.UserID)

	service.DB.Where("portfolio_id = ?", portfolioID).Delete(&models.WorkExperience{})
	service.DB.Where("portfolio_id = ?", portfolioID).Delete(&models.Education{})
	service.DB.Where("portfolio_id = ?", portfolioID).Delete(&models.Skill{})
	service.DB.Where("portfolio_id = ?", portfolioID).Delete(&models.Showcase{})
	service.DB.Where("portfolio_id = ?", portfolioID).Delete(&models.ShowcaseTechnology{})

	var workExperiences []models.WorkExperience
	for _, workExperience := range payload.WorkExperiences {
		workExperiences = append(workExperiences, models.WorkExperience{
			PortfolioID: portfolioID,
			Company:     workExperience.Company,
			Role:        workExperience.Role,
			Location:    &workExperience.Location,
			StartDate:   &workExperience.StartDate,
			EndDate:     workExperience.EndDate,
			About:       workExperience.About,
		})
	}
	portfolio.WorkExperiences = workExperiences

	var education []models.Education
	for _, edu := range payload.Education {
		education = append(education, models.Education{
			PortfolioID: portfolioID,
			School:      edu.School,
			Level:       edu.Level,
			Degree:      edu.Degree,
			Location:    edu.Location,
			YearStart:   edu.YearStart,
			YearEnd:     edu.YearEnd,
			About:       edu.About,
		})
	}
	portfolio.Education = education

	var skills []models.Skill
	for _, skill := range payload.Skills {
		skills = append(skills, models.Skill{
			PortfolioID: portfolioID,
			Name:        skill.Name,
			URL:         skill.URL,
		})
	}
	portfolio.Skills = skills

	var showcases []models.Showcase
	for _, showcase := range payload.Showcases {
		var technologies []models.ShowcaseTechnology
		for _, technology := range showcase.Technologies {
			technologies = append(technologies, models.ShowcaseTechnology{
				Name: technology.Name,
			})
		}
		showcases = append(showcases, models.Showcase{
			PortfolioID:          portfolioID,
			Name:                 showcase.Name,
			Description:          &showcase.Description,
			Role:                 &showcase.Role,
			ShowcaseTechnologies: technologies,
		})
	}
	portfolio.Showcases = showcases

	if err := service.DB.Session(&gorm.Session{FullSaveAssociations: true}).Updates(&portfolio).Error; err != nil {
		return nil, err
	}

	return service.Get(portfolioID)
}

func (service Service) Delete(portfolioID uint64) error {
	portfolio, err := service.Get(portfolioID)

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
