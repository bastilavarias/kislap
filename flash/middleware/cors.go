package middleware

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			if origin == "https://builder.kislap.app" || origin == "http://kislap.test" || origin == "http://sebastech.kislap.test" {
				return true
			}

			if origin == "https://sebastech.kislap.app" {
				return true
			}

			if strings.HasSuffix(origin, ".kislap.app") {
				return true
			}

			return false
		},
		AllowMethods: []string{
			"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS",
		},
		AllowHeaders: []string{
			"Authorization",
			"Content-Type",
			"Origin",
			"Accept",
			"X-Requested-With",
		},
		ExposeHeaders: []string{
			"Content-Length",
		},
		AllowCredentials: true,
		MaxAge:           24 * time.Hour,
	})
}
