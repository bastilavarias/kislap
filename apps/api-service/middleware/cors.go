package middleware

import (
	"log" // Added for logging
	"net/url"
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

			parsedOrigin, err := url.Parse(origin)
			if err != nil || parsedOrigin.Hostname() == "" {
				log.Printf("[CORS] BLOCKED invalid origin: %s", origin)
				return false
			}

			host := strings.ToLower(parsedOrigin.Hostname())

			allowed := host == "localhost" ||
				host == "kislap.app" ||
				host == "builder.kislap.app" ||
				host == "api.kislap.app" ||
				strings.HasSuffix(host, ".localhost") ||
				strings.HasSuffix(host, ".kislap.app")

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
