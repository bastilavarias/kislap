package main

import (
	"flash/database"
	"flash/ent"
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
	client := database.InitDatabase()
	fmt.Println("Database connected")
	defer func(client *ent.Client) {
		err := client.Close()
		if err != nil {
			return
		}
	}(client)
	err := router.SetTrustedProxies([]string{"127.0.0.1"})
	if err != nil {
		return
	}
	routes.RegisterRoutes(router, client)
	router.Run(":5000")
}
