package project

import (
	"bytes"
	"errors"
	"flash/models"
	objectStorage "flash/sdk/object_storage"
	"fmt"
	"strings"

	"flash/utils"

	"gorm.io/gorm"
)

type Service struct {
	DB            *gorm.DB
	ObjectStorage objectStorage.Provider
}

func NewService(db *gorm.DB, objectStorage objectStorage.Provider) *Service {
	return &Service{DB: db, ObjectStorage: objectStorage}
}

func (service Service) List(userID *uint64, page int, limit int) (*[]models.Project, error) {
	var projects []models.Project

	if limit <= 0 {
		limit = 5
	}

	if page <= 0 {
		page = 1
	}

	offset := (page - 1) * limit

	if userID != nil {
		err := service.DB.
			Where("user_id = ?", userID).
			Order("created_at DESC").
			Limit(limit).
			Offset(offset).
			Find(&projects).Error

		if err != nil {
			return nil, err
		}

		return &projects, nil
	}

	err := service.DB.
		Where("published = ?", 1).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&projects).Error

	if err != nil {
		return nil, err
	}

	return &projects, nil

}

func (service Service) Create(userID uint64, payload Payload) (*models.Project, error) {
	if _, err := service.CheckDomain(payload.SubDomain); err != nil {
		return nil, err
	}

	slug := utils.Slugify(payload.Name, 0)
	newProj := models.Project{
		UserID:      userID,
		Name:        payload.Name,
		Description: payload.Description,
		SubDomain:   &payload.SubDomain,
		Slug:        slug,
		Type:        payload.Type,
		Published:   payload.Published,
	}

	if err := service.DB.Create(&newProj).Error; err != nil {
		return nil, err
	}

	return &newProj, nil
}

func (service Service) Update(projectID int, payload Payload) (*models.Project, error) {
	var existingProj models.Project
	if err := service.DB.First(&existingProj, projectID).Error; err != nil {
		return nil, err
	}

	oldSubDomain := *existingProj.SubDomain
	isSubdomainChanging := oldSubDomain != payload.SubDomain

	if isSubdomainChanging {
		if _, err := service.CheckDomain(payload.SubDomain); err != nil {
			return nil, err
		}
	}

	existingProj.Name = payload.Name
	existingProj.Description = payload.Description
	existingProj.SubDomain = &payload.SubDomain
	existingProj.Slug = utils.Slugify(payload.Name, 0)
	existingProj.Type = payload.Type
	existingProj.Published = payload.Published

	if err := service.DB.Save(&existingProj).Error; err != nil {
		return nil, err
	}

	return &existingProj, nil
}

func (service Service) CheckDomain(subDomain string) (bool, error) {
	subDomain = strings.ToLower(subDomain)

	var reserved models.ReservedSubDomain
	err := service.DB.Where("sub_domain = ?", subDomain).First(&reserved).Error

	if err == nil {
		return false, errors.New("this subdomain is reserved by the system")
	}

	var count int64
	if err := service.DB.Model(&models.Project{}).
		Where("sub_domain = ?", subDomain).
		Count(&count).Error; err != nil {
		return false, err
	}

	if count > 0 {
		return false, errors.New("subdomain already taken")
	}

	return true, nil
}

func (service Service) Show(projectID int) (*models.Project, error) {
	var proj models.Project

	if err := service.DB.
		Preload("Portfolio").
		Preload("Portfolio.User").
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

	if level == "full" && project.Type == "biz" {
		if err := service.DB.
			Preload("Biz").
			Preload("Biz.Services").
			Preload("Biz.Products").
			Preload("Biz.Testimonials").
			Preload("Biz.SocialLinks").
			Preload("Biz.FAQs").
			Preload("Biz.Gallery").
			First(&project, project.ID).Error; err != nil {
			return nil, err
		}
	}

	return &project, nil
}

func (service Service) ShowBySubDomain(subDomain string) (*models.Project, error) {
	var project models.Project

	if err := service.DB.Where("sub_domain = ?", subDomain).First(&project).Error; err != nil {
		return nil, err
	}

	query := service.DB.Model(&models.Project{})

	if project.Type == "biz" {
		query = query.
			Preload("Biz").
			Preload("Biz.Services", func(db *gorm.DB) *gorm.DB {
				return db.Order("placement_order ASC")
			}).
			Preload("Biz.Products", func(db *gorm.DB) *gorm.DB {
				return db.Order("placement_order ASC")
			}).
			Preload("Biz.Testimonials", func(db *gorm.DB) *gorm.DB {
				return db.Order("placement_order ASC")
			}).
			Preload("Biz.SocialLinks").
			Preload("Biz.FAQs", func(db *gorm.DB) *gorm.DB {
				return db.Order("placement_order ASC")
			}).
			Preload("Biz.Gallery", func(db *gorm.DB) *gorm.DB {
				return db.Order("placement_order ASC")
			})
	} else {
		query = query.
			Preload("Portfolio").
			Preload("Portfolio.User").
			Preload("Portfolio.WorkExperiences", func(db *gorm.DB) *gorm.DB {
				return db.Order("placement_order ASC")
			}).
			Preload("Portfolio.Education", func(db *gorm.DB) *gorm.DB {
				return db.Order("placement_order ASC")
			}).
			Preload("Portfolio.Showcases", func(db *gorm.DB) *gorm.DB {
				return db.Order("placement_order ASC")
			}).
			Preload("Portfolio.Showcases.ShowcaseTechnologies").
			Preload("Portfolio.Skills")
	}

	if err := query.First(&project, project.ID).Error; err != nil {
		return nil, err
	}

	return &project, nil
}

func (service Service) Delete(projectID int) (*models.Project, error) {
	var proj models.Project
	if err := service.DB.First(&proj, projectID).Error; err != nil {
		return nil, err
	}

	if err := service.DB.Delete(&proj).Error; err != nil {
		return nil, err
	}

	return &proj, nil
}

func (service Service) Publish(projectID int, payload PublishProjectPayload) (*models.Project, error) {
	var proj models.Project
	if err := service.DB.First(&proj, projectID).Error; err != nil {
		return nil, err
	}

	service.DB.Model(&proj).Select("Published").Updates(models.Project{
		Published: payload.Published,
	})

	return &proj, nil
}

func (service Service) SaveOGImage(projectID int64) (*models.Project, error) {
	var project models.Project
	if err := service.DB.First(&project, projectID).Error; err != nil {
		return nil, err
	}

	if project.SubDomain == nil {
		return nil, errors.New("project does not have a subdomain")
	}

	url := fmt.Sprintf("https://%s.%s", *project.SubDomain, "kislap.app")
	imageData, err := utils.CaptureBrowser(url)
	if err != nil {
		return nil, fmt.Errorf("failed to capture screenshot: %w", err)
	}

	imagePath := fmt.Sprintf("og_images/%d.png", projectID)
	imageReader := bytes.NewReader(imageData)

	uploadedURL, err := service.ObjectStorage.Upload(imagePath, imageReader, "image/png")
	if err != nil {
		return nil, fmt.Errorf("failed to upload OG image: %w", err)
	}

	project.OGImageURL = &uploadedURL

	if err := service.DB.Save(&project).Error; err != nil {
		return nil, fmt.Errorf("failed to save project with OG image URL: %w", err)
	}

	return &project, nil
}
