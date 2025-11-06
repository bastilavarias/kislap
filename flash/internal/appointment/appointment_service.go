package appointment

import (
	"errors"
	"flash/models"
	"fmt"

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
	var existing models.Appointment
	err := service.DB.
		Where("user_id = ? AND project_id = ? AND date = ?", payload.UserID, payload.ProjectID, payload.Date).
		Where(`
			(time_from < ? AND time_to > ?)
		`, payload.TimeTo, payload.TimeFrom).
		First(&existing).Error

	if err == nil {
		return nil, fmt.Errorf("time conflict: the user already has an appointment from %s to %s",
			existing.TimeFrom.Format("15:04"), existing.TimeTo.Format("15:04"))
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	appointment := models.Appointment{
		UserID:        payload.UserID,
		ProjectID:     payload.ProjectID,
		Date:          payload.Date,
		TimeFrom:      payload.TimeFrom,
		TimeTo:        payload.TimeTo,
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
