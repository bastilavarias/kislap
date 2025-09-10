package auth

import (
	"errors"
	"flash/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func (service Service) Login(email string, password string) (*models.User, error) {
	var user models.User

	dbUser := service.DB.Where("email = ?", email).
		First(&user)
	if errors.Is(dbUser.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("user not found")
	} else if dbUser.Error != nil {
		return nil, dbUser.Error
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid password")
	}

	return &user, nil
}
