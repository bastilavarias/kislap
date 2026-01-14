package appointment

import (
	"flash/models"

	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service *Service) List(page int, limit int, projectID string) ([]models.Appointment, int64, error) {
	var appointments []models.Appointment
	var total int64

	db := service.DB.Model(&models.Appointment{})

	if projectID != "" {
		db = db.Where("project_id = ?", projectID)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := db.Preload("User").Preload("Project").
		Limit(limit).
		Offset(offset).
		Order("id DESC").
		Find(&appointments).Error; err != nil {
		return nil, 0, err
	}

	return appointments, total, nil
}

func (service *Service) Create(payload Payload) (*models.Appointment, error) {
	appointment := models.Appointment{
		UserID:        payload.UserID,
		ProjectID:     payload.ProjectID,
		Name:          payload.Name,
		Email:         payload.Email,
		ContactNumber: payload.ContactNumber,
		Message:       payload.Message,
	}

	if err := service.DB.Create(&appointment).Error; err != nil {
		return nil, err
	}
	return &appointment, nil
}

func (service *Service) Show(id int) (*models.Appointment, error) {
	var appointment models.Appointment
	if err := service.DB.Preload("User").Preload("Project").First(&appointment, id).Error; err != nil {
		return nil, err
	}
	return &appointment, nil
}

func (service *Service) Update(id int, payload Payload) (*models.Appointment, error) {
	var appointment models.Appointment
	if err := service.DB.First(&appointment, id).Error; err != nil {
		return nil, err
	}

	appointment.UserID = payload.UserID
	appointment.ProjectID = payload.ProjectID

	if err := service.DB.Save(&appointment).Error; err != nil {
		return nil, err
	}
	return &appointment, nil
}

func (service *Service) Delete(id int) error {
	return service.DB.Delete(&models.Appointment{}, id).Error
}
