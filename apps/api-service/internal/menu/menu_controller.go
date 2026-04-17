package menu

import (
	"encoding/json"
	"flash/internal/project"
	"flash/utils"
	"fmt"
	"net/http"
	"strconv"

	objectStorage "flash/sdk/object_storage"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Service        *Service
	ProjectService *project.Service
}

func NewController(db *gorm.DB, objectStorage objectStorage.Provider) *Controller {
	return &Controller{
		Service:        NewService(db, objectStorage),
		ProjectService: project.NewService(db, objectStorage),
	}
}

func (c *Controller) Save(context *gin.Context) {
	if err := context.Request.ParseMultipartForm(32 << 20); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "File upload error: "+err.Error())
		context.Abort()
		return
	}

	jsonBody := context.Request.FormValue("json_body")
	if jsonBody == "" {
		utils.APIRespondError(context, http.StatusBadRequest, "Missing 'json_body'")
		context.Abort()
		return
	}

	var req CreateUpdateMenuRequest
	if err := json.Unmarshal([]byte(jsonBody), &req); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid JSON: "+err.Error())
		context.Abort()
		return
	}

	payload := req.ToServicePayload()
	form := context.Request.MultipartForm
	if files, ok := form.File["logo"]; ok && len(files) > 0 {
		payload.Logo = files[0]
	}
	if files, ok := form.File["cover_image"]; ok && len(files) > 0 {
		payload.CoverImage = files[0]
	}
	for i := range payload.Categories {
		if files, ok := form.File[fmt.Sprintf("categories[%d].image", i)]; ok && len(files) > 0 {
			payload.Categories[i].Image = files[0]
		}
	}
	for i := range payload.Items {
		if files, ok := form.File[fmt.Sprintf("items[%d].image", i)]; ok && len(files) > 0 {
			payload.Items[i].Image = files[0]
		}
	}
	for i := range payload.GalleryImages {
		if files, ok := form.File[fmt.Sprintf("gallery_images[%d].image", i)]; ok && len(files) > 0 {
			payload.GalleryImages[i].Image = files[0]
		}
	}

	menu, err := c.Service.Save(payload)
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{"menu": menu})

	go func(projectID int64) {
		defer func() {
			if r := recover(); r != nil {
				fmt.Printf("Recovered from panic in menu SaveOGImage: %v\n", r)
			}
		}()
		if _, err := c.ProjectService.SaveOGImage(projectID); err != nil {
			fmt.Printf("Background OG Image generation failed for menu project %d: %v\n", projectID, err)
		}
	}(payload.ProjectID)
}

func (c *Controller) Get(context *gin.Context) {
	projectID, err := strconv.ParseInt(context.Param("project_id"), 10, 64)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid project ID")
		return
	}

	menu, err := c.Service.Get(projectID)
	if err != nil {
		utils.APIRespondError(context, http.StatusNotFound, "Menu not found")
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{"menu": menu})
}

func (c *Controller) GenerateDisplayPoster(context *gin.Context) {
	var req GenerateDisplayPosterRequest
	if err := context.ShouldBindJSON(&req); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid request: "+err.Error())
		context.Abort()
		return
	}

	result, err := c.Service.GenerateDisplayPoster(req)
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, result)
}
