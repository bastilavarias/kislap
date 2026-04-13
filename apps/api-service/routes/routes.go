package routes

import (
	"flash/internal/appointment"
	"flash/internal/auth"
	"flash/internal/biz"
	"flash/internal/dashboard"
	"flash/internal/document"
	"flash/internal/help_inquiry"
	"flash/internal/linktree"
	"flash/internal/marketing_analytics"
	"flash/internal/menu"
	"flash/internal/page_activity"
	"flash/internal/parsed_file"
	"flash/internal/portfolio"
	"flash/internal/project"
	"flash/internal/user"
	"flash/middleware"
	"flash/sdk/llm"
	objectStorage "flash/sdk/object_storage"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB, llm llm.Provider, objectStorage objectStorage.Provider) {
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "up",
		})
	})

	api := router.Group("/api")
	{
		authController := auth.NewController(db)
		userController := user.NewController(db)
		projectController := project.NewController(db, objectStorage)
		dashboardController := dashboard.NewController(db)
		helpInquiryController := help_inquiry.NewController(db)
		marketingAnalyticsController := marketing_analytics.NewController(db)
		documentController := document.NewController(db, llm, objectStorage)
		parsedFileService := parsed_file.NewService(db, documentController.Service)
		parsedFileController := parsed_file.NewController(parsedFileService)
		portfolioController := portfolio.NewController(db, objectStorage)
		appointmentController := appointment.NewController(db)
		pageActivityController := page_activity.NewController(db)

		bizController := biz.NewController(db, objectStorage)

		linktreeController := linktree.NewController(db, objectStorage)
		menuController := menu.NewController(db, objectStorage)

		api.POST("/auth/login", authController.Login)
		api.POST("/auth/github", authController.GithubLogin)
		api.POST("/auth/google", authController.GoogleLogin)
		api.GET("/auth/refresh", middleware.RefreshTokenValidatorMiddleware(db), authController.Refresh)
		api.GET("/auth/logout", middleware.AccessTokenValidatorMiddleware(db), authController.Logout)

		api.POST("/user", userController.Register)

		api.GET("/projects/list", middleware.AccessTokenValidatorMiddleware(db), projectController.List)
		api.GET("/projects/list/public", projectController.PublicList)
		api.GET("/projects/stats/public", projectController.PublicStats)
		api.GET("/dashboard/public", dashboardController.PublicMetrics)
		api.POST("/help-inquiries", helpInquiryController.Create)
		api.GET("/marketing-analytics/overview", marketingAnalyticsController.Overview)
		api.GET("/projects/show/:id", projectController.ShowByID)
		api.GET("/projects/show/slug/:slug", middleware.AccessTokenValidatorMiddleware(db), projectController.ShowBySlug)
		api.GET("/projects/show/sub-domain/:sub-domain", projectController.ShowBySubDomain)
		api.GET("/projects/check/sub-domain/:sub-domain", middleware.AccessTokenValidatorMiddleware(db), projectController.CheckDomain)
		api.POST("/projects/og-image/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.SaveOGImage)
		api.POST("/projects", middleware.AccessTokenValidatorMiddleware(db), projectController.Create)
		api.PUT("/projects/publish/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Publish)
		api.PUT("/projects/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Update)
		api.DELETE("/projects/:id", middleware.AccessTokenValidatorMiddleware(db), projectController.Delete)

		api.POST("/documents", middleware.AccessTokenValidatorMiddleware(db), documentController.Parse)
		api.GET("/parsed-files", middleware.AccessTokenValidatorMiddleware(db), parsedFileController.List)
		api.POST("/parsed-files", middleware.AccessTokenValidatorMiddleware(db), parsedFileController.Create)

		// Portfolio
		api.GET("/portfolios/:id", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Get)
		api.POST("/portfolios", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Save)
		api.DELETE("/portfolios/:id", middleware.AccessTokenValidatorMiddleware(db), portfolioController.Delete)
		api.POST("/appointments", appointmentController.Create)
		api.GET("/appointments", middleware.AccessTokenValidatorMiddleware(db), appointmentController.List)
		api.GET("/appointments/show/:id", middleware.AccessTokenValidatorMiddleware(db), appointmentController.Show)
		api.PUT("/appointments/:id", middleware.AccessTokenValidatorMiddleware(db), appointmentController.Update)
		api.DELETE("/appointments/:id", middleware.AccessTokenValidatorMiddleware(db), appointmentController.Delete)
		api.POST("/page-activities", pageActivityController.Create)
		api.POST("/marketing-analytics/session/start", marketingAnalyticsController.StartSession)
		api.POST("/marketing-analytics/event", marketingAnalyticsController.TrackEvent)
		api.POST("/marketing-analytics/session/heartbeat", marketingAnalyticsController.Heartbeat)
		api.POST("/marketing-analytics/session/end", marketingAnalyticsController.EndSession)
		api.GET("/page-activities/:id", middleware.AccessTokenValidatorMiddleware(db), pageActivityController.GetStats)
		api.GET("/page-activities/:id/top-links", middleware.AccessTokenValidatorMiddleware(db), pageActivityController.GetTopLinks)
		api.GET("/page-activities/:id/visits", middleware.AccessTokenValidatorMiddleware(db), pageActivityController.GetVisits)
		api.GET("/page-activities/:id/recent-activities", middleware.AccessTokenValidatorMiddleware(db), pageActivityController.GetRecentActivities)

		// Biz
		api.GET("/biz/:id", middleware.AccessTokenValidatorMiddleware(db), bizController.Get)
		api.POST("/biz", middleware.AccessTokenValidatorMiddleware(db), bizController.Save)

		// Linktree
		api.GET("/linktree/:id", middleware.AccessTokenValidatorMiddleware(db), linktreeController.Get)
		api.POST("/linktree", middleware.AccessTokenValidatorMiddleware(db), linktreeController.Save)

		// Menu
		api.GET("/menu/:id", middleware.AccessTokenValidatorMiddleware(db), menuController.Get)
		api.POST("/menu", middleware.AccessTokenValidatorMiddleware(db), menuController.Save)
		api.POST("/menu/display-poster", middleware.AccessTokenValidatorMiddleware(db), menuController.GenerateDisplayPoster)
	}
}
