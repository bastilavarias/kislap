package auth

import (
	"errors"
	"flash/models"
	"flash/shared/jwt"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	DB      *gorm.DB
	Context *gin.Context
}

type loginResponse struct {
	AccessToken  string
	RefreshToken string
}

func (service Service) Login(email string, password string) (*loginResponse, error) {
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

	accessTokenLifeSpan := 300
	accessToken, err := jwt.GenerateToken(user, &accessTokenLifeSpan)
	if err != nil {
		return nil, err
	}

	refreshTokenLifeSpan := 604800
	refreshToken, err := jwt.GenerateToken(user, &refreshTokenLifeSpan)
	if err != nil {
		return nil, err
	}

	hashedToken, err := jwt.HashToken(refreshToken)
	if err != nil {
		return nil, err
	}

	user.RefreshToken = &hashedToken
	if err := service.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	return &loginResponse{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (service Service) Refresh(userID uint64) (*loginResponse, error) {
	var user models.User

	dbUser := service.DB.Where("id = ?", userID).
		First(&user)
	if errors.Is(dbUser.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("user not found")
	} else if dbUser.Error != nil {
		return nil, dbUser.Error
	}

	accessTokenLifeSpan := 300
	accessToken, err := jwt.GenerateToken(user, &accessTokenLifeSpan)
	if err != nil {
		return nil, err
	}

	refreshTokenLifeSpan := 604800
	refreshToken, err := jwt.GenerateToken(user, &refreshTokenLifeSpan)
	if err != nil {
		return nil, err
	}

	hashedToken, err := jwt.HashToken(refreshToken)
	if err != nil {
		return nil, err
	}

	user.RefreshToken = &hashedToken
	if err := service.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	return &loginResponse{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}
