package middleware

import (
	"log" // Added for logging
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			if origin == "" {
				return false
			}

			log.Printf("[CORS] Checking Origin: %s", origin)

			allowed := strings.HasSuffix(origin, ".localhost:3000") ||
				strings.HasSuffix(origin, ".localhost:3001") ||
				strings.HasSuffix(origin, "kislap.test") ||
				strings.HasSuffix(origin, ".kislap.test") ||
				strings.HasSuffix(origin, ".kislap.app")

			if allowed {
				log.Printf("[CORS] Allowed: %s", origin)
			} else {
				log.Printf("[CORS] BLOCKED: %s", origin)
			}

			return allowed
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
