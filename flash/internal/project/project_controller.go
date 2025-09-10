package project

import (
	"flash/models"
	"flash/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type Controller struct {
	DB *gorm.DB
}

func (pc Controller) Index(c *gin.Context) {
	var projects []models.Project
	if err := pc.DB.Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (pc Controller) Create(c *gin.Context) {
	var input struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
		Theme       string `json:"theme" binding:"required"`
		Layout      string `json:"layout" binding:"required"`
		Type        string `json:"type" binding:"required,oneof=portfolio biz links waitlist"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	slug := utils.Slugify(input.Name, 0)

	var count int64
	if err := pc.DB.Model(&models.Project{}).
		Where("slug = ?", slug).
		Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project name already exists!"})
		return
	}

	newProj := models.Project{
		Name:        input.Name,
		Description: input.Description,
		Slug:        slug,
		Theme:       input.Theme,
		Layout:      input.Layout,
		Type:        input.Type,
	}
	if err := pc.DB.Create(&newProj).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create project"})
		return
	}

	c.JSON(http.StatusCreated, newProj)
}

func (pc Controller) Show(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var proj models.Project
	if err := pc.DB.First(&proj, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, proj)
}

// PUT /projects/:id
func (pc Controller) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var input struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Theme       string `json:"theme"`
		Layout      string `json:"layout"`
		Type        string `json:"type"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var proj models.Project
	if err := pc.DB.First(&proj, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	pc.DB.Model(&proj).Updates(models.Project{
		Name:        input.Name,
		Description: input.Description,
		Theme:       input.Theme,
		Layout:      input.Layout,
		Type:        input.Type,
	})

	c.JSON(http.StatusOK, proj)
}

// DELETE /projects/:id
func (pc Controller) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := pc.DB.Delete(&models.Project{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted"})
}

// GET /projects/check-domain/:subdomain
func (pc Controller) CheckDomain(c *gin.Context) {
	subDomain := c.Param("sub-domain")

	var count int64
	if err := pc.DB.Model(&models.Project{}).
		Where("sub_domain = ?", subDomain).
		Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project sub domain already taken!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project sub domain available!"})
}
