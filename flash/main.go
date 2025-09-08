package main

import (
	"flash/database"
	"flash/routes"
	"fmt"
	"github.com/gin-gonic/gin"
)

func main() {
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
	dbInstance := database.InitDatabase()
	fmt.Println("Database connected")
	defer dbInstance.Close()
	router.SetTrustedProxies([]string{"127.0.0.1"})
	routes.RegisterRoutes(router)
	router.Run(":5000")
}
