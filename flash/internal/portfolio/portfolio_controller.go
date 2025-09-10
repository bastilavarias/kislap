package portfolio

import (
	"flash/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type Controller struct {
	DB *gorm.DB
}

// GET /portfolios
func (rc Controller) Index(c *gin.Context) {
	var portfolios []models.Portfolio
	if err := rc.DB.Find(&portfolios).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, portfolios)
}

// POST /portfolios
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

	newPortfolio := models.Portfolio{
		Name:     input.Name,
		Intro:    input.Intro,
		Email:    input.Email,
		Password: input.Password, // ⚠️ hash this before saving in real apps
	}

	if err := rc.DB.Create(&newPortfolio).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create portfolio"})
		return
	}

	c.JSON(http.StatusCreated, newPortfolio)
}

// GET /portfolios/:id
func (rc Controller) Show(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var portfolio models.Portfolio
	if err := rc.DB.First(&portfolio, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Portfolio not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, portfolio)
}

// PUT /portfolios/:id
func (rc Controller) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var input struct {
		Name     string `json:"first_name"`
		Intro    string `json:"last_name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var portfolio models.Portfolio
	if err := rc.DB.First(&portfolio, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Portfolio not found"})
		return
	}

	rc.DB.Model(&portfolio).Updates(models.Portfolio{
		Name:     input.Name,
		Intro:    input.Intro,
		Email:    input.Email,
		Password: input.Password,
	})

	c.JSON(http.StatusOK, portfolio)
}

// DELETE /portfolios/:id
func (rc Controller) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := rc.DB.Delete(&models.Portfolio{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Portfolio deleted"})
}
