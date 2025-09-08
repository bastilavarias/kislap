package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type ResumeController struct{}

func (rc ResumeController) Index(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "List all resumes"})
}

func (rc ResumeController) Create(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Resume created"})
}

func (rc ResumeController) Show(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Show resume", "id": id})
}

func (rc ResumeController) Update(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Update resume", "id": id})
}

func (rc ResumeController) Delete(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Delete resume", "id": id})
}
