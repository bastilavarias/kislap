package routes

import (
	"flash/internal/auth"
	"flash/internal/portfolio"
	"flash/internal/project"
	"flash/internal/user"
	"flash/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	api := r.Group("/api")
	{
		authController := auth.NewController(db)
		api.POST("/auth/login", authController.Login)
		api.GET("/auth/refresh", middleware.AuthMiddleware(db), authController.Refresh)

		userController := user.NewController(db)
		api.POST("/user", middleware.AuthMiddleware(db), userController.Register)

		projectController := project.Controller{DB: db}
		api.GET("/projects", middleware.AuthMiddleware(db), projectController.Index)
		api.GET("/projects/check/sub-domain/:sub-domain", middleware.AuthMiddleware(db), projectController.CheckDomain)
		api.GET("/projects/:id", middleware.AuthMiddleware(db), projectController.Show)
		api.POST("/projects", middleware.AuthMiddleware(db), projectController.Create)
		api.PUT("/projects/:id", middleware.AuthMiddleware(db), projectController.Update)
		api.DELETE("/projects/:id", middleware.AuthMiddleware(db), projectController.Delete)

		resumeController := portfolio.Controller{DB: db}
		api.GET("/portfolios", middleware.AuthMiddleware(db), resumeController.Index)
		api.POST("/portfolios", middleware.AuthMiddleware(db), resumeController.Create)
		api.GET("/portfolios/:id", middleware.AuthMiddleware(db), resumeController.Show)
		api.PUT("/portfolios/:id", middleware.AuthMiddleware(db), resumeController.Update)
		api.DELETE("/portfolios/:id", middleware.AuthMiddleware(db), resumeController.Delete)
	}
}
