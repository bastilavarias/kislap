package jwt

import (
	"crypto/sha256"
	"errors"
	"flash/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("mysecret")

func GenerateToken(user models.User, lifeSpanInSeconds *int) (string, error) {
	var dur time.Duration

	if lifeSpanInSeconds == nil {
		dur = 168 * time.Hour // default 1 week
	} else {
		dur = time.Duration(*lifeSpanInSeconds) * time.Second
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(dur).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(jwtSecret)
}

func ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrTokenSignatureInvalid
		}
		return jwtSecret, nil
	})
}

func HashToken(token string) (string, error) {
	digest := sha256.Sum256([]byte(token))

	hashed, err := bcrypt.GenerateFromPassword(digest[:], bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashed), nil
}

func ExtractUser(token *jwt.Token, db *gorm.DB) (*models.User, error) {
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	idFloat, ok := claims["user_id"].(float64)
	if !ok {
		return nil, errors.New("user ID not found")
	}

	userID := uint(idFloat)

	var user models.User
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
