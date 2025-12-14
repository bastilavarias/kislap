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
			// LOGGING: Print the origin being checked
			log.Printf("[CORS] Checking Origin: %s", origin)

			// 1. Development: Allow local dev domains
			if origin == "http://kislap.test" || strings.HasSuffix(origin, ".kislap.test") || origin == "http://localhost:3000" {
				log.Printf("[CORS] Allowed (Dev Rule): %s", origin)
				return true
			}

			// 2. Production: Allow exact main domain
			if origin == "https://kislap.app" {
				log.Printf("[CORS] Allowed (Main Domain): %s", origin)
				return true
			}

			// 3. Production: Allow ANY subdomain (*.kislap.app)
			if strings.HasSuffix(origin, ".kislap.app") {
				log.Printf("[CORS] Allowed (Subdomain Rule): %s", origin)
				return true
			}

			// LOGGING: Print when a request is rejected
			log.Printf("[CORS] BLOCKED: %s", origin)
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
