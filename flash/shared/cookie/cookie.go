package cookie

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func SetCookie(context *gin.Context, name string, data string) {
	_ = godotenv.Load()

	appEnv := os.Getenv("APP_ENV")

	domain := ""
	secure := false

	if appEnv == "production" {
		domain = os.Getenv("APP_DOMAIN")
		secure = true
	}

	context.SetCookie(
		name,
		data,
		int((7 * 24 * time.Hour).Seconds()),
		"/",
		domain,
		secure,
		true,
	)

	if appEnv == "local" {
		context.SetSameSite(http.SameSiteLaxMode)
	} else {
		context.SetSameSite(http.SameSiteStrictMode)
	}
}
