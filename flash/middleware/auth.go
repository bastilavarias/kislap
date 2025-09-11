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
)

func AuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		//authHeader := context.GetHeader("Authorization")
		//if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		//	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		//	validatedToken, err := shared.ValidateToken(tokenString)
		//	if err != nil || !validatedToken.Valid {
		//		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: invalid access token"})
		//		return
		//	}
		//	claims, ok := validatedToken.Claims.(jwt.MapClaims)
		//	if !ok {
		//		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: invalid token claims"})
		//		return
		//	}
		//
		//	idFloat, ok := claims["user_id"].(float64)
		//	if !ok {
		//		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: missing user_id"})
		//		return
		//	}
		//
		//	userID := uint(idFloat)
		//
		//	fmt.Println(userID)
		//}

		refreshToken, err := context.Cookie("refresh_token")
		if err != nil {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: refresh token not found"})
			return
		}

		validatedToken, err := shared.ValidateToken(refreshToken)
		if err != nil || !validatedToken.Valid {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: invalid refresh token"})
			return
		}

		claims, ok := validatedToken.Claims.(jwt.MapClaims)
		if !ok {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: invalid token claims"})
			return
		}

		idFloat, ok := claims["user_id"].(float64)
		if !ok {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: missing user_id"})
			return
		}

		userID := uint(idFloat)

		var user models.User
		if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: user not found"})
			return
		}

		digest := sha256.Sum256([]byte(refreshToken))
		err = bcrypt.CompareHashAndPassword([]byte(*user.RefreshToken), digest[:])
		if err != nil {
			context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: invalid refresh token | invalid value"})
			return
		}

		accessTokenLifeSpan := 300
		accessToken, err := shared.GenerateToken(user, &accessTokenLifeSpan)
		if err != nil {
			context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		refreshTokenLifeSpan := 604800
		refreshToken, err = shared.GenerateToken(user, &refreshTokenLifeSpan)
		if err != nil {
			context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		hashedBcrypt, _ := shared.HashToken(refreshToken)
		user.RefreshToken = &hashedBcrypt
		db.Save(user)

		shared.SetCookie(context, "refresh_token", refreshToken)

		context.Set("userID", user.ID)
		context.Set("access_token", accessToken)

		context.Next()
	}
}
