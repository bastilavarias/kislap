package routes

import (
	"flash/internal/auth"
	"flash/internal/document"
	"flash/internal/portfolio"
	"flash/internal/project"
	"flash/internal/user"
	"flash/middleware"
	"flash/sdk/dns"
	"flash/sdk/llm"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB, llm llm.Provider, dns dns.Provider) {

	api := router.Group("/api")
	{
		authController := auth.NewController(db)
		userController := user.NewController(db)
		projectController := project.NewController(db, dns)
		documentController := document.NewController(db, llm)
		portfolioController := portfolio.NewController(db)

		api.POST("/auth/login", authController.Login)
		api.GET("/auth/refresh", middleware.RefreshTokenValidatorMiddleware(db), authController.Refresh)

		api.POST("/user", userController.Register)
		//api.POST("/user", middleware.AccessTokenValidatorMiddleware(db), userController.Register)

		api.GET("/projects", middleware.AccessTokenValidatorMiddleware(db), projectController.List)
		//api.GET("/projects/show/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Show)
		api.GET("/projects/show/:id", projectController.ShowByID)
		api.GET("/projects/show/slug/:slug", projectController.ShowBySlug)
		api.GET("/projects/check/sub-domain/:sub-domain", middleware.AccessTokenValidatorMiddleware(db), projectController.CheckDomain)
		api.POST("/projects", middleware.AccessTokenValidatorMiddleware(db), projectController.Create)
		api.PUT("/projects/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Update)
		api.DELETE("/projects/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Delete)

		api.POST("/documents", middleware.AccessTokenValidatorMiddleware(db), documentController.Parse)

		api.GET("/portfolios/:id", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Get)
		api.POST("/portfolios", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Create)
		api.PUT("/portfolios/:id", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Update)
		api.DELETE("/portfolios/:id", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Delete)
	}
}
