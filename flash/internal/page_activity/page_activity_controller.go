package page_activity

import (
	"flash/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Service *Service
}

func NewController(db *gorm.DB) *Controller {
	service := &Service{DB: db}
	return &Controller{Service: service}
}

func (controller Controller) Create(context *gin.Context) {
	var request TrackActivityRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	payload := request.ToServicePayload()

	payload.IPAddress = context.ClientIP()

	if err := controller.Service.Track(payload); err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{"tracked": true})
}

func (controller Controller) GetStats(context *gin.Context) {
	idStr := context.Param("id")
	projectID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid Project ID")
		return
	}

	page, _ := strconv.Atoi(context.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(context.DefaultQuery("limit", "10"))

	stats, err := controller.Service.GetStats(projectID, page, limit)
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, stats)
}

func (controller Controller) GetTopPages(context *gin.Context) {
	idStr := context.Param("id")
	projectID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid Project ID")
		return
	}

	limit, _ := strconv.Atoi(context.DefaultQuery("limit", "5"))

	topPages, err := controller.Service.GetTopPages(projectID, limit)
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, topPages)
}

func (controller Controller) GetRecentActivities(context *gin.Context) {
	idStr := context.Param("id")
	projectID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, "Invalid Project ID")
		return
	}

	page, _ := strconv.Atoi(context.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(context.DefaultQuery("limit", "10"))

	activities, err := controller.Service.GetRecentActivities(projectID, page, limit)
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, activities)
}
