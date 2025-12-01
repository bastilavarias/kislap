package main

import (
	"flash/database"
	"flash/middleware"
	"flash/routes"
	dns "flash/sdk"
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

	var llmProvider llm.Provider
	if os.Getenv("LLM_PROVIDER") == "gemini" {
		llmProvider = llm.Default(&llm.GeminiSDK{
			ApiKey: os.Getenv("LLM_API_KEY"),
			Model:  os.Getenv("LLM_MODEL"),
		})
	} else {
		llmProvider = llm.Default(&llm.OpenAISDK{
			ApiKey: os.Getenv("LLM_API_KEY"),
			Model:  os.Getenv("LLM_MODEL"),
		})
	}

	cloudflareService, _ := dns.NewCloudflareService(
		os.Getenv("CF_API_KEY"),
		os.Getenv("CF_EMAIL"),
		os.Getenv("CF_ZONE_ID"),
		"mydomain.com",
	)

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())
	routes.RegisterRoutes(router, databaseClient, llmProvider, cloudflareService)
	router.Run("0.0.0.0:5000")
}
