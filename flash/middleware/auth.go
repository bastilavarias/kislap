package middleware

import (
	"crypto/sha256"
	"flash/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

import sharedjwt "flash/shared/jwt"

func AuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		authHeader := context.GetHeader("Authorization")
		if authHeader == "" && !strings.HasPrefix(authHeader, "Bearer ") {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Access Token"})
			return
		}
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		validatedToken, err := sharedjwt.ValidateToken(tokenString)
		var user models.User
		if err != nil || !validatedToken.Valid {
			refreshUser, ok, err := checkRefreshToken(context, db)
			if !ok && err != nil {
				context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
				return
			}

			user = *refreshUser
		}

		extractedUser, err := sharedjwt.ExtractUser(validatedToken, db)
		if err != nil {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
			return
		}
		user = *extractedUser

		context.Set("user_id", user.ID)
		context.Next()
	}
}

func checkRefreshToken(context *gin.Context, db *gorm.DB) (*models.User, bool, error) {
	refreshToken, err := context.Cookie("refresh_token")
	if err != nil {
		return nil, false, err
	}

	validatedToken, err := sharedjwt.ValidateToken(refreshToken)
	if err != nil || !validatedToken.Valid {
		return nil, false, err
	}

	user, err := sharedjwt.ExtractUser(validatedToken, db)
	if err != nil {
		return nil, false, err
	}

	digest := sha256.Sum256([]byte(refreshToken))
	err = bcrypt.CompareHashAndPassword([]byte(*user.RefreshToken), digest[:])
	if err != nil {
		return nil, false, err
	}

	return user, true, nil
}
