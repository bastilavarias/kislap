package routes

import (
	"flash/internal/auth"
	"flash/internal/portfolio"
	"flash/internal/project"
	"flash/internal/user"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	api := r.Group("/api")
	{
		authController := auth.NewController(db)
		api.POST("/auth/login", authController.Login)
		api.GET("/auth/refresh", authController.Refresh)

		userController := user.NewController(db)
		api.POST("/user", userController.Register)

		projectController := project.Controller{DB: db}
		api.GET("/projects", projectController.Index)
		api.GET("/projects/check/sub-domain/:sub-domain", projectController.CheckDomain)
		api.GET("/projects/:id", projectController.Show)
		api.POST("/projects", projectController.Create)
		api.PUT("/projects/:id", projectController.Update)
		api.DELETE("/projects/:id", projectController.Delete)

		resumeController := portfolio.Controller{DB: db}
		api.GET("/portfolios", resumeController.Index)
		api.POST("/portfolios", resumeController.Create)
		api.GET("/portfolios/:id", resumeController.Show)
		api.PUT("/portfolios/:id", resumeController.Update)
		api.DELETE("/portfolios/:id", resumeController.Delete)
	}
}
