package main

import (
	"flash/database"
	"flash/pkg/llm"
	"flash/routes"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"os"
)

func main() {
	_ = godotenv.Load()

	env := "development"

	if env == "" {
		env = "production"
	}

	if env == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}
	fmt.Println("Running in", env, "mode")

	router := gin.Default()

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

	err := router.SetTrustedProxies([]string{"127.0.0.1"})
	if err != nil {
		return
	}

	routes.RegisterRoutes(router, databaseClient, llmProvider)
	router.Run(":5000")
}
