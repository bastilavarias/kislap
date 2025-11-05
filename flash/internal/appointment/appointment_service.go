package appointment

import (
	"flash/models"

	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service *Service) List() ([]models.Appointment, error) {
	var appointments []models.Appointment
	if err := service.DB.Preload("User").Preload("Project").Find(&appointments).Error; err != nil {
		return nil, err
	}
	return appointments, nil
}

func (service *Service) Create(payload Payload) (*models.Appointment, error) {
	appointment := models.Appointment{
		UserID:    payload.UserID,
		ProjectID: payload.ProjectID,
		Date:      payload.Date,
		TimeFrom:  payload.TimeFrom,
		TimeTo:    payload.TimeTo,
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
	appointment.Date = payload.Date
	appointment.TimeFrom = payload.TimeFrom
	appointment.TimeTo = payload.TimeTo

	if err := service.DB.Save(&appointment).Error; err != nil {
		return nil, err
	}
	return &appointment, nil
}

func (service *Service) Delete(id int) error {
	return service.DB.Delete(&models.Appointment{}, id).Error
}
