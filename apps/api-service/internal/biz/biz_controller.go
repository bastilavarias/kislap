package biz

import (
	"flash/internal/project"
	"flash/models"
	objectStorage "flash/sdk/object_storage"
	"flash/utils"
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
	var request CreateUpdateBizRequest

	if err := context.ShouldBind(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
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
		First(&biz, bizID).Error; err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Biz not found"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": biz})
}
