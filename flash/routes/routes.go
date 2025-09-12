package routes

import (
	"flash/internal/auth"
	"flash/internal/portfolio"
	"flash/internal/project"
	"flash/internal/user"
	"flash/middleware"
	"flash/pkg/llm"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB, llm llm.Provider) {
	portfolioController := portfolio.NewController(db, llm)
	router.POST("/portfolios", portfolioController.Create)

	api := router.Group("/api")
	{
		authController := auth.NewController(db)
		userController := user.NewController(db)
		projectController := project.NewController(db)

		api.POST("/auth/login", authController.Login)
		api.GET("/auth/refresh", middleware.AuthMiddleware(db), authController.Refresh)

		api.POST("/user", middleware.AuthMiddleware(db), userController.Register)

		api.GET("/projects", middleware.AuthMiddleware(db), projectController.List)
		api.GET("/projects/check/sub-domain/:sub-domain", middleware.AuthMiddleware(db), projectController.CheckDomain)
		api.GET("/projects/:id", middleware.AuthMiddleware(db), projectController.Show)
		api.POST("/projects", middleware.AuthMiddleware(db), projectController.Create)
		api.PUT("/projects/:id", middleware.AuthMiddleware(db), projectController.Update)
		api.DELETE("/projects/:id", middleware.AuthMiddleware(db), projectController.Delete)

	}
}
