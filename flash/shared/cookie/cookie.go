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
	sameSite := http.SameSiteStrictMode

	if appEnv == "production" {
		domain = os.Getenv("APP_DOMAIN")
		secure = true
		sameSite = http.SameSiteStrictMode
	} else if appEnv == "local" {
		sameSite = http.SameSiteLaxMode
	}

	cookie := &http.Cookie{
		Name:     name,
		Value:    data,
		Path:     "/",
		Domain:   domain,
		MaxAge:   int((7 * 24 * time.Hour).Seconds()),
		Secure:   secure,
		HttpOnly: true,
		SameSite: sameSite,
	}

	http.SetCookie(context.Writer, cookie)
}
