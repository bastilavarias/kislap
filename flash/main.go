package main

import (
	"flash/database"
	"flash/middleware"
	"flash/routes"
	"flash/sdk/cloudflare"
	"flash/sdk/llm"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func configureGin(env string) {
	if env == "" {
		env = "production"
	}
	if env == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}
	log.Printf("[INFO] 🚀 Application running in %s mode", env)
}

func main() {
	// 1. Load Environment
	if err := godotenv.Load(); err != nil {
		log.Println("[WARN] No .env file found, relying on system environment variables")
	}

	envDev := os.Getenv("APP_ENV")
	configureGin(envDev)

	// 2. Initialize Database
	log.Println("[INFO] 🔌 Connecting to Database...")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASS"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	// Assuming database.Default handles the connection.
	// Ideally, it should return an error if it fails, but if it panics on fail, the app stops here (which is good for DB).
	databaseClient := database.Default(dsn)
	log.Println("[INFO] ✅ Database connected successfully.")

	// 3. Initialize LLM Provider
	log.Println("[INFO] 🧠 Initializing LLM Provider...")
	var llmProvider llm.Provider
	providerName := os.Getenv("LLM_PROVIDER")

	if providerName == "gemini" {
		llmProvider = llm.Default(&llm.GeminiSDK{
			ApiKey: os.Getenv("LLM_API_KEY"),
			Model:  os.Getenv("LLM_MODEL"),
		})
		log.Printf("[INFO] ✅ LLM initialized using: Google Gemini (%s)", os.Getenv("LLM_MODEL"))
	} else {
		llmProvider = llm.Default(&llm.OpenAISDK{
			ApiKey: os.Getenv("LLM_API_KEY"),
			Model:  os.Getenv("LLM_MODEL"),
		})
		log.Printf("[INFO] ✅ LLM initialized using: OpenAI (%s)", os.Getenv("LLM_MODEL"))
	}

	// 4. Initialize Cloudflare SDK (Robust / Non-Blocking)
	log.Println("[INFO] ☁️  Initializing Cloudflare SDK...")

	cfToken := os.Getenv("CLOUDFLARE_API_TOKEN")
	cfZone := os.Getenv("CLOUDFLARE_ZONE_ID")
	cfHost := os.Getenv("CLOUDFLARE_DOMAIN") // Make sure this matches your .env key

	cfClient, err := cloudflare.NewClient(cfToken, cfZone, cfHost)
	if err != nil {
		// ROBUSTNESS: Log the error but DO NOT crash the app.
		// We set cfClient to nil so the app can still run without DNS features.
		log.Printf("[WARN] ⚠️  Cloudflare initialization failed: %v", err)
		log.Println("[WARN] ⚠️  Running in degraded mode: DNS automation features will be disabled.")
		cfClient = nil
	} else {
		log.Println("[INFO] ✅ Cloudflare Client connected successfully.")
	}

	// 5. Start Server
	log.Println("[INFO] 📡 Starting HTTP Server on :5000...")
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// Pass the client (even if it is nil)
	routes.RegisterRoutes(router, databaseClient, llmProvider, cfClient)

	if err := router.Run("0.0.0.0:5000"); err != nil {
		log.Fatalf("[FATAL] Server failed to start: %v", err)
	}
}
