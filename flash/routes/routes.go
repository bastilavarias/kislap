package routes

import (
	"flash/ent"
	"flash/internal/auth"
	"flash/internal/portfolio"
	"flash/internal/project"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, c *ent.Client) {
	api := r.Group("/api")
	{
		projectController := project.Controller{Client: c}
		api.GET("/projects", projectController.Index)
		api.GET("/projects/check/sub-domain/:sub-domain", projectController.CheckDomain)
		api.GET("/projects/:id", projectController.Show)
		api.POST("/projects", projectController.Create)
		api.PUT("/projects/:id", projectController.Update)
		api.DELETE("/projects/:id", projectController.Delete)

		resumeController := portfolio.Controller{Client: c}
		api.GET("/portfolios", resumeController.Index)
		api.POST("/portfolios", resumeController.Create)
		api.GET("/portfolios/:id", resumeController.Show)
		api.PUT("/portfolios/:id", resumeController.Update)
		api.DELETE("/portfolios/:id", resumeController.Delete)

		ac := auth.Controller{Client: c}
		api.POST("/auth/login", ac.Login)
		api.POST("/auth/register", ac.Register)
	}
}
