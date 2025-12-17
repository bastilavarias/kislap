package cookie

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func SetCookie(context *gin.Context, name string, data string) {
	log.Printf("[Cookie] SetCookie called for: %s", name)

	_ = godotenv.Load()
	appEnv := os.Getenv("APP_ENV")

	domain := ".kislap.test"
	secure := false
	sameSite := http.SameSiteLaxMode

	log.Printf("[Cookie] Environment detected: '%s'", appEnv)

	if appEnv == "production" {
		envDomain := os.Getenv("APP_COOKIE_DOMAIN")

		if envDomain == "" {
			log.Println("[Cookie] CRITICAL WARNING: APP_COOKIE_DOMAIN is empty!")
		}

		domain = envDomain
		secure = true
	}

	cookie := &http.Cookie{
		Name:     name,
		Value:    data,
		Path:     "/",
		Domain:   domain,
		HttpOnly: true,
		MaxAge:   int((7 * 24 * time.Hour).Seconds()), // 1 week
		Secure:   secure,
		SameSite: sameSite,
	}

	log.Printf("[Cookie] Final Config -> Domain: '%s' | Secure: %v | SameSite: %v",
		cookie.Domain, cookie.Secure, cookie.SameSite)

	http.SetCookie(context.Writer, cookie)
}

func ClearCookie(context *gin.Context, name string) {
	log.Printf("[Cookie] ClearCookie called for: %s", name)

	domain := ".kislap.test"
	secure := false
	sameSite := http.SameSiteLaxMode

	appEnv := os.Getenv("APP_ENV")

	if appEnv == "production" {
		domain = os.Getenv("APP_COOKIE_DOMAIN")
		secure = true
	}

	cookie := &http.Cookie{
		Name:     name,
		Value:    "",
		Path:     "/",
		Domain:   domain,
		HttpOnly: true,
		MaxAge:   -1,
		Secure:   secure,
		SameSite: sameSite,
	}

	log.Printf("[Cookie] Clearing -> Domain: '%s' | Secure: %v", cookie.Domain, cookie.Secure)

	http.SetCookie(context.Writer, cookie)
}
