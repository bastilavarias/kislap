package portfolio

import (
	"encoding/json"
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
		utils.APIRespondError(context, http.StatusBadRequest, "Missing 'json_body'")
		context.Abort()
		return
	}

	var request CreateUpdatePortfolioRequest
	if err := json.Unmarshal([]byte(jsonBody), &request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid JSON: "+err.Error())
		context.Abort()
		return
	}

	if form := context.Request.MultipartForm; form != nil {
		if files, ok := form.File["avatar"]; ok && len(files) > 0 {
			request.AvatarURL = nil
		}
		if files, ok := form.File["resume"]; ok && len(files) > 0 {
			request.ResumeURL = nil
		}
	}

	payload := request.ToServicePayload()
	if form := context.Request.MultipartForm; form != nil {
		if files, ok := form.File["avatar"]; ok && len(files) > 0 {
			payload.Avatar = files[0]
		}
		if files, ok := form.File["resume"]; ok && len(files) > 0 {
			payload.Resume = files[0]
		}
	}

	portfolio, err := controller.Service.Save(payload)
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

	}(int64(payload.ProjectID))

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
