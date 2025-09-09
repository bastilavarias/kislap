package portfolio

import (
	"flash/ent"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Controller struct {
	Client *ent.Client
}

func (rc Controller) Index(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "List all resumes"})
}

func (rc Controller) Create(c *gin.Context) {
	var input struct {
		Name     string `json:"first_name" binding:"required"`
		Intro    string `json:"last_name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
}

func (rc Controller) Show(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Show resume", "id": id})
}

func (rc Controller) Update(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Update resume", "id": id})
}

func (rc Controller) Delete(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Delete resume", "id": id})
}
