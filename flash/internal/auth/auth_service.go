package auth

import (
	"crypto/sha256"
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

type LoginResponse struct {
	AccessToken  string
	RefreshToken string
	User         models.User
}

func (service Service) Login(email string, password string) (*LoginResponse, error) {
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

	return &LoginResponse{AccessToken: accessToken, RefreshToken: refreshToken, User: user}, nil
}

func (service Service) Refresh(userID uint64, oldRefreshToken string) (*LoginResponse, error) {
	var user models.User

	if err := service.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	if user.RefreshToken == nil {
		return nil, errors.New("no refresh token stored")
	}

	digest := sha256.Sum256([]byte(oldRefreshToken))
	if bcrypt.CompareHashAndPassword([]byte(*user.RefreshToken), digest[:]) != nil {
		return nil, errors.New("invalid refresh token")
	}

	accessTokenLifeSpan := 300
	accessToken, err := jwt.GenerateToken(user, &accessTokenLifeSpan)
	if err != nil {
		return nil, err
	}

	refreshTokenLifeSpan := 604800
	newRefreshToken, err := jwt.GenerateToken(user, &refreshTokenLifeSpan)
	if err != nil {
		return nil, err
	}

	hashedToken, err := jwt.HashToken(newRefreshToken)
	if err != nil {
		return nil, err
	}
	user.RefreshToken = &hashedToken

	if err := service.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		User:         user,
	}, nil
}
