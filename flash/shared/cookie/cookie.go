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

	domain := ".kislap.test"
	secure := false
	sameSite := http.SameSiteLaxMode

	if appEnv == "production" {
		domain = os.Getenv("APP_DOMAIN")
		secure = true
		sameSite = http.SameSiteNoneMode
	}

	cookie := &http.Cookie{
		Name:     name,
		Value:    data,
		Path:     "/",
		Domain:   domain,
		HttpOnly: true,
		MaxAge:   int((7 * 24 * time.Hour).Seconds()),
		Secure:   secure,
		SameSite: sameSite,
	}

	http.SetCookie(context.Writer, cookie)
}
