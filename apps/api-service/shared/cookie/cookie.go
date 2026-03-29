package cookie

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func resolveCookieConfig(appEnv string) (string, bool, http.SameSite) {
	domain := os.Getenv("APP_COOKIE_DOMAIN")
	secure := false
	sameSite := http.SameSiteLaxMode
	crossSite := strings.EqualFold(strings.TrimSpace(os.Getenv("APP_COOKIE_CROSS_SITE")), "true")

	if appEnv == "production" {
		return domain, true, http.SameSiteNoneMode
	}

	if crossSite {
		return strings.TrimSpace(domain), true, http.SameSiteNoneMode
	}

	normalizedDomain := strings.TrimSpace(domain)
	if strings.Contains(normalizedDomain, "://") || strings.Contains(normalizedDomain, ":") {
		normalizedDomain = ""
	}

	if strings.EqualFold(normalizedDomain, "localhost") || strings.Contains(normalizedDomain, "localhost") {
		normalizedDomain = ""
	}

	return normalizedDomain, secure, sameSite
}

func SetCookie(context *gin.Context, name string, data string) {
	log.Printf("[Cookie] SetCookie called for: %s", name)

	_ = godotenv.Load()
	appEnv := os.Getenv("APP_ENV")
	domain, secure, sameSite := resolveCookieConfig(appEnv)

	log.Printf("[Cookie] Environment detected: '%s'", appEnv)

	if appEnv == "production" {
		envDomain := domain

		if envDomain == "" {
			log.Println("[Cookie] CRITICAL WARNING: APP_COOKIE_DOMAIN is empty!")
		}

		domain = envDomain
		sameSite = http.SameSiteNoneMode
		secure = true

		// Kill the old "HOST ONLY" cookie
		oldCookieKiller := &http.Cookie{
			Name:     name,
			Value:    "",
			Path:     "/",
			Domain:   "",
			MaxAge:   -1,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		}
		http.SetCookie(context.Writer, oldCookieKiller)
		log.Println("[Cookie] Sent 'Killer' cookie for old Host-Only domain")
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

	log.Printf("[Cookie] Final Config -> Domain: '%s' | Secure: %v | SameSite: %v",
		cookie.Domain, cookie.Secure, cookie.SameSite)

	http.SetCookie(context.Writer, cookie)
}

func ClearCookie(context *gin.Context, name string) {
	log.Printf("[Cookie] ClearCookie called for: %s", name)

	appEnv := os.Getenv("APP_ENV")
	domain, secure, sameSite := resolveCookieConfig(appEnv)

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
