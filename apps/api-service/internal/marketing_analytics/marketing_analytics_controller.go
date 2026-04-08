package marketing_analytics

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
	return &Controller{
		Service: NewService(db),
	}
}

func (controller Controller) StartSession(context *gin.Context) {
	var request StartSessionRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	session, err := controller.Service.StartSession(request, context.ClientIP())
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, session)
}

func (controller Controller) TrackEvent(context *gin.Context) {
	var request TrackEventRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	if err := controller.Service.TrackEvent(request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{"tracked": true})
}

func (controller Controller) Heartbeat(context *gin.Context) {
	var request SessionHeartbeatRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	if err := controller.Service.Heartbeat(request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{"tracked": true})
}

func (controller Controller) EndSession(context *gin.Context) {
	var request EndSessionRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	if err := controller.Service.EndSession(request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{"tracked": true})
}

func (controller Controller) Overview(context *gin.Context) {
	days, _ := strconv.Atoi(context.DefaultQuery("days", "14"))

	overview, err := controller.Service.Overview(days)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, overview)
}
