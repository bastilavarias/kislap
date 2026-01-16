package portfolio

import (
	"flash/internal/project"
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
		DB: db,
	}

	projectService := project.NewService(db, objectStorage)

	return &Controller{Service: service, ProjectService: projectService}
}

func (controller Controller) Save(context *gin.Context) {
	var request CreateUpdatePortfolioRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	portfolio, err := controller.Service.Save(request.ToServicePayload())
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	go func(projectID int64) {
		defer func() {
			if r := recover(); r != nil {
				fmt.Printf("Recovered from panic in SaveOGImage: %v\n", r)
			}
		}()

		_, err := controller.ProjectService.SaveOGImage(projectID)

		if err != nil {
			fmt.Printf("Background OG Image generation failed for project %d: %v\n", projectID, err)
		}

	}(int64(request.ProjectID))

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"portfolio": portfolio,
	})
}

func (controller Controller) Get(context *gin.Context) {
	paramID := context.Param("id")

	portfolioID, err := strconv.Atoi(paramID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	portfolio, err := controller.Service.GetByIDWithPreloads(uint64(portfolioID))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": portfolio})
}

func (controller Controller) Delete(context *gin.Context) {
	paramID := context.Param("id")

	portfolioID, err := strconv.Atoi(paramID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = controller.Service.Delete(uint64(portfolioID))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": nil})
}
