package project

import (
	"flash/ent"
	"flash/ent/project"
	"flash/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type Controller struct {
	Client *ent.Client
}

func (pc Controller) Index(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "List all resumes"})
}

func (pc Controller) Create(c *gin.Context) {
	var input struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
		Theme       string `json:"theme" binding:"required"`
		Layout      string `json:"layout" binding:"required"`
		Type        string `json:"type" binding:"required,oneof=portfolio biz link waitlist"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	slug := utils.Slugify(input.Name, 0)

	exists, err := pc.Client.Project.Query().
		Where(project.SlugEQ(slug)).
		Exist(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project name already exists!"})
		return
	}

	newProj, err := pc.Client.Project.Create().
		SetSlug(slug).
		SetName(input.Name).
		SetDescription(input.Description).
		SetTheme(input.Theme).
		SetLayout(input.Layout).
		SetType(project.Type(input.Type)).
		Save(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, newProj)
}

func (pc Controller) Show(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can't parse string."})
		return
	}

	foundProj, err := pc.Client.Project.Get(c, id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project sub domain already taken!"})
		return
	}

	c.JSON(http.StatusOK, foundProj)
}

func (pc Controller) Update(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Update resume", "id": id})
}

func (pc Controller) Delete(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Delete resume", "id": id})
}

func (pc Controller) CheckDomain(c *gin.Context) {
	subDomain := c.Param("sub-domain")

	exists, err := pc.Client.Project.Query().
		Where(project.SubDomainEQ(subDomain)).
		Exist(c.Request.Context())

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project sub domain already taken!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project sub domain available!"})
}
