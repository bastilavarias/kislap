package appointment

import (
	"flash/models"

	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service *Service) List(page int, limit int) ([]models.Appointment, int64, error) {
	if page <= 0 {
		page = 1
	}

	if limit <= 0 {
		limit = 10
	}

	offset := (page - 1) * limit

	var appointments []models.Appointment
	var total int64

	query := service.DB.Model(&models.Appointment{})

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.
		Preload("User").
		Preload("Project").
		Order("id DESC").
		Offset(offset).
		Limit(limit).
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
