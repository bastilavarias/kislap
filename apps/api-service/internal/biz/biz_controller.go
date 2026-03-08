package biz

import (
	"encoding/json"
	"flash/internal/project"
	"flash/models"
	objectStorage "flash/sdk/object_storage"
	"flash/utils"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Service        *Service
	ProjectService *project.Service
}

func NewController(db *gorm.DB, objectStorage objectStorage.Provider) *Controller {
	service := &Service{
		DB:            db,
		ObjectStorage: objectStorage,
	}
	projectService := project.NewService(db, objectStorage)

	return &Controller{Service: service, ProjectService: projectService}
}

func (controller Controller) Save(context *gin.Context) {
	if err := context.Request.ParseMultipartForm(32 << 20); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "File upload error: "+err.Error())
		context.Abort()
		return
	}

	jsonBody := context.Request.FormValue("json_body")
	if jsonBody == "" {
		utils.APIRespondError(context, http.StatusBadRequest, "Missing 'json_body' in form data")
		context.Abort()
		return
	}

	var request CreateUpdateBizRequest

	if err := json.Unmarshal([]byte(jsonBody), &request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid JSON format: "+err.Error())
		context.Abort()
		return
	}

	form := context.Request.MultipartForm

	if files, ok := form.File["logo"]; ok && len(files) > 0 {
		request.Logo = files[0]
	}
	if files, ok := form.File["hero_image"]; ok && len(files) > 0 {
		request.HeroImage = files[0]
	}
	if files, ok := form.File["about_image"]; ok && len(files) > 0 {
		request.AboutImage = files[0]
	}

	for i := range request.Services {
		key := fmt.Sprintf("services[%d].image", i)
		if files, ok := form.File[key]; ok && len(files) > 0 {
			request.Services[i].Image = files[0]
		}
	}

	for i := range request.Products {
		key := fmt.Sprintf("products[%d].image", i)
		if files, ok := form.File[key]; ok && len(files) > 0 {
			request.Products[i].Image = files[0]
		}
	}

	for i := range request.Testimonials {
		key := fmt.Sprintf("testimonials[%d].avatar", i)
		if files, ok := form.File[key]; ok && len(files) > 0 {
			request.Testimonials[i].Avatar = files[0]
		}
	}

	for i := range request.GalleryImages {
		key := fmt.Sprintf("gallery_images[%d].image", i)
		if files, ok := form.File[key]; ok && len(files) > 0 {
			request.GalleryImages[i].Image = files[0]
		}
	}

	biz, err := controller.Service.Save(request.ToServicePayload())
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"biz": biz,
	})
}

func (controller Controller) Get(context *gin.Context) {
	paramID := context.Param("id")

	bizID, err := strconv.Atoi(paramID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var biz models.Biz

	if err := controller.Service.DB.
		Preload("Services").
		Preload("Products").
		Preload("Testimonials").
		Preload("SocialLinks").
		Preload("FAQs").
		Preload("Gallery").
		First(&biz, bizID).Error; err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Biz not found"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": biz})
}
