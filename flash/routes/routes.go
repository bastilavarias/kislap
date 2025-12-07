package routes

import (
	"flash/internal/appointment"
	"flash/internal/auth"
	"flash/internal/document"
	"flash/internal/page_activity"
	"flash/internal/portfolio"
	"flash/internal/project"
	"flash/internal/user"
	"flash/middleware"
	"flash/sdk/cloudflare"
	"flash/sdk/llm"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB, llm llm.Provider, cf *cloudflare.Client) {

	api := router.Group("/api")
	{
		authController := auth.NewController(db)
		userController := user.NewController(db)
		projectController := project.NewController(db, cf)
		documentController := document.NewController(db, llm)
		portfolioController := portfolio.NewController(db)
		appointmentController := appointment.NewController(db)
		pageActivityController := page_activity.NewController(db)

		api.POST("/auth/login", authController.Login)
		api.POST("/auth/github", authController.GithubLogin)
		api.GET("/auth/refresh", middleware.RefreshTokenValidatorMiddleware(db), authController.Refresh)

		api.POST("/user", userController.Register)

		api.GET("/projects/list", middleware.AccessTokenValidatorMiddleware(db), projectController.List)
		api.GET("/projects/show/:id", projectController.ShowByID)
		api.GET("/projects/show/slug/:slug", middleware.AccessTokenValidatorMiddleware(db), projectController.ShowBySlug)
		api.GET("/projects/show/sub-domain/:sub-domain", projectController.ShowBySubDomain)
		api.GET("/projects/check/sub-domain/:sub-domain", middleware.AccessTokenValidatorMiddleware(db), projectController.CheckDomain)
		api.POST("/projects", middleware.AccessTokenValidatorMiddleware(db), projectController.Create)
		api.PUT("/projects/publish/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Publish)
		api.PUT("/projects/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Update)
		api.DELETE("/projects/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Delete)

		api.POST("/documents", middleware.AccessTokenValidatorMiddleware(db), documentController.Parse)

		api.GET("/portfolios/:id", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Get)
		api.POST("/portfolios", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Save)
		api.DELETE("/portfolios/:id", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Delete)

		api.POST("/appointments", appointmentController.Create)
		api.GET("/appointments", middleware.AccessTokenValidatorMiddleware(db), appointmentController.List)
		api.GET("/appointments/show/:id", middleware.AccessTokenValidatorMiddleware(db), appointmentController.Show)
		api.PUT("/appointments/:id", middleware.AccessTokenValidatorMiddleware(db), appointmentController.Update)
		api.DELETE("/appointments/:id", middleware.AccessTokenValidatorMiddleware(db), appointmentController.Delete)

		api.POST("/page-activities", pageActivityController.Create)
		api.GET("/page-activities/:id", middleware.AccessTokenValidatorMiddleware(db), pageActivityController.GetStats)
		api.GET("/page-activities/:id/visits", middleware.AccessTokenValidatorMiddleware(db), pageActivityController.GetVisits)
		api.GET("/page-activities/:id/recent-activities", middleware.AccessTokenValidatorMiddleware(db), pageActivityController.GetRecentActivities)
	}
}
