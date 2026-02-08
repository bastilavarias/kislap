package linktree

import (
	"encoding/json"
	"flash/utils"
	"fmt"
	"net/http"
	"strconv"

	objectStorage "flash/sdk/object_storage"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Service *Service
}

func NewController(db *gorm.DB, objectStorage objectStorage.Provider) *Controller {
	return &Controller{
		Service: NewService(db, objectStorage),
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

	var req LinktreeDTO
	if err := json.Unmarshal([]byte(jsonBody), &req); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid JSON: "+err.Error())
		context.Abort()
		return
	}

	form := context.Request.MultipartForm

	if files, ok := form.File["logo"]; ok && len(files) > 0 {
		req.LogoURL = nil
	}

	projectID := int64(1)
	userID := int64(1)

	payload := req.ToServicePayload(projectID, userID, req.ID)

	if files, ok := form.File["logo"]; ok && len(files) > 0 {
		payload.Logo = files[0]
	}

	for i := range payload.Links {
		key := fmt.Sprintf("social_links[%d].image", i)
		if files, ok := form.File[key]; ok && len(files) > 0 {
			payload.Links[i].Image = files[0]
		}
	}

	linktree, err := c.Service.Save(payload)
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"linktree": linktree,
	})
}

func (c *Controller) Get(context *gin.Context) {
	projectIDStr := context.Param("project_id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid project ID")
		return
	}

	linktree, err := c.Service.Get(projectID)
	if err != nil {
		utils.APIRespondError(context, http.StatusNotFound, "Linktree not found")
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"linktree": linktree,
	})
}
