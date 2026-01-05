package middleware

import (
	"flash/utils"
	"net/http"

	sharedjwt "flash/shared/jwt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RefreshTokenValidatorMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		refreshToken, err := context.Cookie("refresh_token")
		if err != nil || refreshToken == "" {
			utils.APIRespondError(context, http.StatusUnauthorized, "Missing refresh token cookie.")
			context.Abort()
			return
		}

		validatedToken, err := sharedjwt.ValidateToken(refreshToken)
		if err != nil || !validatedToken.Valid {
			utils.APIRespondError(context, http.StatusUnauthorized, "Invalid or expired refresh token.")
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
		context.Set("refresh_token", refreshToken)
		context.Next()
	}
}
