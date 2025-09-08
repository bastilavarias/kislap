package routes

import (
	"flash/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		resumeController := controllers.ResumeController{}
		api.GET("/resumes", resumeController.Index)
		api.POST("/resumes", resumeController.Create)
		api.GET("/resumes/:id", resumeController.Show)
		api.PUT("/resumes/:id", resumeController.Update)
		api.DELETE("/resumes/:id", resumeController.Delete)
	}
}
