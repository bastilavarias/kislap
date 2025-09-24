package main

import (
	"flash/database"
	"flash/middleware"
	"flash/routes"
	"flash/sdk/dns"
	"flash/sdk/llm"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func logger(env string) {
	if env == "" {
		env = "production"
	}
	if env == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}
	fmt.Println("Running in", env, "mode")
}

func main() {
	_ = godotenv.Load()
	envDev := os.Getenv("APP_ENV")

	logger(envDev)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASS"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	databaseClient := database.Default(dsn)

	llmProvider := llm.Default(&llm.Gemini{
		ApiKey: os.Getenv("LLM_API_KEY"),
		Model:  os.Getenv("LLM_MODEL"),
	})

	rootDomain := os.Getenv("APP_ROOT_DOMAIN")
	dnsProvider := dns.Default(envDev, rootDomain)

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())
	routes.RegisterRoutes(router, databaseClient, llmProvider, dnsProvider)
	router.Run("0.0.0.0:5000")
}
