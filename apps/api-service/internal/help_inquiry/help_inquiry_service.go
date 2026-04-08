package help_inquiry

import (
	"errors"
	"flash/models"
	"strings"
	"time"

	"gorm.io/gorm"
)

var ErrDailyHelpInquiryLimitReached = errors.New("daily help inquiry limit reached")

type Service struct {
	DB *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

func (service Service) Create(request CreateHelpInquiryRequest, ipAddress string, userAgent *string) (*models.HelpInquiry, error) {
	startOfDay := time.Now().Truncate(24 * time.Hour)

	var inquiryCount int64
	if err := service.DB.Model(&models.HelpInquiry{}).
		Where("ip_address = ?", ipAddress).
		Where("created_at >= ?", startOfDay).
		Count(&inquiryCount).Error; err != nil {
		return nil, err
	}

	if inquiryCount >= 3 {
		return nil, ErrDailyHelpInquiryLimitReached
	}

	inquiry := models.HelpInquiry{
		Title:        strings.TrimSpace(request.Title),
		Name:         strings.TrimSpace(request.Name),
		Email:        strings.TrimSpace(request.Email),
		MobileNumber: normalizeOptionalString(request.MobileNumber),
		Description:  strings.TrimSpace(request.Description),
		SourcePage:   normalizeOptionalString(request.SourcePage),
		Status:       "new",
		IPAddress:    ipAddress,
		UserAgent:    normalizeOptionalString(userAgent),
	}

	if err := service.DB.Create(&inquiry).Error; err != nil {
		return nil, err
	}

	return &inquiry, nil
}

func normalizeOptionalString(value *string) *string {
	if value == nil {
		return nil
	}

	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}

	return &trimmed
}
