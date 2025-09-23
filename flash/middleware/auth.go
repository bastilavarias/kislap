package middleware

import (
	"crypto/sha256"
	"flash/models"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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
		var uid = uint64(0)
		if err != nil || !validatedToken.Valid {
			userID, ok, err := checkRefreshToken(context, db)
			if !ok || err != nil {
				context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err})
				return
			}
			fmt.Println(userID)
			fmt.Println("---")
			uid = *userID
		}

		// Fix this:
		context.Set("user_id", uid)

		context.Next()
	}
}

func checkRefreshToken(context *gin.Context, db *gorm.DB) (*uint64, bool, error) {
	refreshToken, err := context.Cookie("refresh_token")
	if err != nil {
		return nil, false, err
	}

	validatedToken, err := sharedjwt.ValidateToken(refreshToken)
	if err != nil || !validatedToken.Valid {
		return nil, false, err
	}

	claims, ok := validatedToken.Claims.(jwt.MapClaims)
	if !ok {
		return nil, false, err
	}

	idFloat, ok := claims["user_id"].(float64)
	if !ok {
		return nil, false, err
	}

	userID := uint(idFloat)

	var user models.User
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, false, err
	}

	digest := sha256.Sum256([]byte(refreshToken))
	err = bcrypt.CompareHashAndPassword([]byte(*user.RefreshToken), digest[:])
	if err != nil {
		return nil, false, err
	}

	return &user.ID, true, nil
}
