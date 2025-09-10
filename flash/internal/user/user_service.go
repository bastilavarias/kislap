package user

import (
	"errors"
	"flash/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service Service) Register(firstName string, lastName string, mobileNumber string, email string, password string) (*models.User, error) {
	var foundUser models.User
	if err := service.DB.Where("email = ?", email).First(&foundUser).Error; err == nil {
		return nil, errors.New("email already registered")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		FirstName: firstName,
		LastName:  lastName,
		Email:     email,
		Password:  string(hashedPassword),
		Role:      "default",
	}

	if mobileNumber != "" {
		user.MobileNumber = &mobileNumber
	}

	if err := service.DB.Create(user).Error; err != nil {
		return nil, err
	}

	user.Password = ""

	return user, nil
}
