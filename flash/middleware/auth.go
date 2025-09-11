package middleware

import (
	"crypto/sha256"
	"flash/models"
	"flash/shared"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"strings"
)

func AuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		authHeader := context.GetHeader("Authorization")
		if authHeader == "" && !strings.HasPrefix(authHeader, "Bearer ") {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Access Token"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		validatedToken, err := shared.ValidateToken(tokenString)
		if err != nil || !validatedToken.Valid {
			ok, err := checkRefreshToken(context, db)
			if !ok || err != nil {
				context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
				return
			}
		}

		context.Next()
	}
}

func checkRefreshToken(context *gin.Context, db *gorm.DB) (bool, error) {
	refreshToken, err := context.Cookie("refresh_token")
	if err != nil {
		return false, err
	}

	validatedToken, err := shared.ValidateToken(refreshToken)
	if err != nil || !validatedToken.Valid {
		return false, err
	}

	claims, ok := validatedToken.Claims.(jwt.MapClaims)
	if !ok {
		return false, err
	}

	idFloat, ok := claims["user_id"].(float64)
	if !ok {
		return false, err
	}

	userID := uint(idFloat)

	var user models.User
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		return false, err
	}

	digest := sha256.Sum256([]byte(refreshToken))
	err = bcrypt.CompareHashAndPassword([]byte(*user.RefreshToken), digest[:])
	if err != nil {
		return false, err
	}

	return true, nil
}
