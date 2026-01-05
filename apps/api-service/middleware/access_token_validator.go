package middleware

import (
	"flash/utils"
	"net/http"
	"strings"

	sharedjwt "flash/shared/jwt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AccessTokenValidatorMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			utils.APIRespondError(c, http.StatusUnauthorized, "Unauthorized.")
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		validatedToken, err := sharedjwt.ValidateToken(tokenString)
		if err != nil || !validatedToken.Valid {
			utils.APIRespondError(c, http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}

		user, err := sharedjwt.ExtractUser(validatedToken, db)
		if err != nil {
			utils.APIRespondError(c, http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}

		c.Set("user_id", user.ID)
		c.Next()
	}
}
