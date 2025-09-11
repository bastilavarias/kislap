package project

import (
	"errors"
	"flash/models"
	"flash/utils"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service Service) List() (*[]models.Project, error) {
	var projects []models.Project
	if err := service.DB.Find(&projects).Error; err != nil {
		return nil, err
	}

	return &projects, nil
}

func (service Service) Create(payload Payload) (*models.Project, error) {
	slug := utils.Slugify(payload.Name, 0)

	var count int64
	if err := service.DB.Model(&models.Project{}).
		Where("slug = ?", slug).
		Count(&count).Error; err != nil {
		return nil, err
	}

	if count > 0 {
		return nil, errors.New("project name already exists")
	}

	newProj := models.Project{
		Name:        payload.Name,
		Description: payload.Description,
		Slug:        slug,
		Theme:       payload.Theme,
		Layout:      payload.Layout,
		Type:        payload.Type,
	}
	if err := service.DB.Create(&newProj).Error; err != nil {
		return nil, err
	}

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
		Theme:       payload.Theme,
		Layout:      payload.Layout,
		Type:        payload.Type,
	})

	return &proj, nil
}

func (service Service) Show(projectID int) (*models.Project, error) {
	var proj models.Project
	if err := service.DB.First(&proj, projectID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, err
		}
		return nil, err
	}

	return &proj, nil
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
		return false, errors.New("Project sub domain already taken!")
	}

	return true, nil
}
