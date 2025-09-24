package middleware

import (
	"flash/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

import sharedjwt "flash/shared/jwt"

func AccessTokenValidatorMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		authHeader := context.GetHeader("Authorization")
		if authHeader == "" && !strings.HasPrefix(authHeader, "Bearer ") {
			utils.APIRespondError(context, http.StatusUnauthorized, "Unauthorized.")
			context.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		validatedToken, err := sharedjwt.ValidateToken(tokenString)

		if err != nil || !validatedToken.Valid {
			utils.APIRespondError(context, http.StatusUnauthorized, err.Error())
			context.Abort()
			return
		}

		user, err := sharedjwt.ExtractUser(validatedToken, db)
		if err != nil {
			utils.APIRespondError(context, http.StatusUnauthorized, err.Error())
			context.Abort()
			return
		}

		context.Set("user_id", user.ID)
		context.Next()
	}
}
