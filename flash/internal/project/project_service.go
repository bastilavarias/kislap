package project

import (
	"errors"
	"flash/models"
	"flash/sdk/dns"
	"flash/utils"

	"gorm.io/gorm"
)

type Service struct {
	DB  *gorm.DB
	DNS dns.Provider
}

func (service Service) List() (*[]models.Project, error) {
	var projects []models.Project
	if err := service.DB.Find(&projects).Error; err != nil {
		return nil, err
	}

	return &projects, nil
}

func (service Service) Create(payload Payload) (*models.Project, error) {
	var count int64
	if err := service.DB.Model(&models.Project{}).
		Where("sub_domain = ?", payload.SubDomain).
		Count(&count).Error; err != nil {
		return nil, err
	}

	if count > 0 {
		return nil, errors.New("domain already taken")
	}

	slug := utils.Slugify(payload.Name, 0)
	newProj := models.Project{
		Name:        payload.Name,
		Description: payload.Description,
		SubDomain:   &payload.SubDomain,
		Slug:        slug,
		Type:        payload.Type,
	}

	if err := service.DB.Create(&newProj).Error; err != nil {
		return nil, err
	}

	// Implement this if the overall logic is done.
	// err := service.DNS.Insert(*newProj.SubDomain)
	// if err != nil {
	// 	return nil, err
	// }

	return &newProj, nil
}

func (service Service) Update(projectID int, payload Payload) (*models.Project, error) {
	var proj models.Project
	if err := service.DB.First(&proj, projectID).Error; err != nil {
		return nil, err
	}

	service.DB.Model(&proj).Updates(models.Project{
		Name:        payload.Name,
		Description: payload.Description,
		Type:        payload.Type,
	})

	return &proj, nil
}

func (service Service) Show(projectID int) (*models.Project, error) {
	var proj models.Project

	if err := service.DB.
	Preload("Portfolio").
	Preload("Portfolio.WorkExperiences").
	Preload("Portfolio.Education").
	Preload("Portfolio.Showcases").
    Preload("Portfolio.Showcases.ShowcaseTechnologies").
    Preload("Portfolio.Skills").
	First(&proj, projectID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, err
		}
		return nil, err
	}

	return &proj, nil
}

func (service Service) ShowBySlug(slug string, level string) (*models.Project, error) {
	var project models.Project

	query := service.DB

    if err := query.First(&project, "slug = ?", slug).Error; err != nil {
        return nil, err
    }

    if level == "full" && project.Type == "portfolio" {
        if err := service.DB.
            Preload("Portfolio").
            Preload("Portfolio.WorkExperiences").
            Preload("Portfolio.Education").
            Preload("Portfolio.Showcases").
            Preload("Portfolio.Showcases.ShowcaseTechnologies").
            Preload("Portfolio.Skills").
            First(&project, project.ID).Error; err != nil {
            return nil, err
        }
    }

	return &project, nil
}

func (service Service) Delete(projectID int) (*models.Project, error) {
	var proj models.Project
	if err := service.DB.Delete(&models.Project{}, projectID).Error; err != nil {
		return nil, err
	}

	return &proj, nil
}

func (service Service) CheckDomain(subDomain string) (bool, error) {
	var count int64
	if err := service.DB.Model(&models.Project{}).
		Where("sub_domain = ?", subDomain).
		Count(&count).Error; err != nil {
		return false, err
	}

	if count > 0 {
		return false, errors.New("project sub domain already taken")
	}

	return true, nil
}
