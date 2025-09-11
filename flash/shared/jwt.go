package shared

import (
	"crypto/sha256"
	"flash/models"
	"golang.org/x/crypto/bcrypt"
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
