package appointment

import (
	"flash/utils"
	"math"
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

func (controller Controller) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	projectID := c.Query("project_id")

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	appointments, total, err := controller.Service.List(page, limit, projectID)
	if err != nil {
		utils.APIRespondError(c, http.StatusBadRequest, err.Error())
		return
	}

	response := gin.H{
		"data": appointments,
		"meta": gin.H{
			"page":      page,
			"limit":     limit,
			"total":     total,
			"last_page": int(math.Ceil(float64(total) / float64(limit))),
		},
	}

	utils.APIRespondSuccess(c, http.StatusOK, response)
}

func (controller Controller) Create(context *gin.Context) {
	var request CreateUpdateAppointmentRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	appointment, err := controller.Service.Create(request.ToServicePayload())
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, appointment)
}

func (controller Controller) Show(context *gin.Context) {
	idStr := context.Param("id")
	appointmentID, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	appointment, err := controller.Service.Show(appointmentID)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, appointment)
}

func (controller Controller) Update(context *gin.Context) {
	idStr := context.Param("id")
	appointmentID, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	var request CreateUpdateAppointmentRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	appointment, err := controller.Service.Update(appointmentID, request.ToServicePayload())
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, appointment)
}

func (controller Controller) Delete(context *gin.Context) {
	idStr := context.Param("id")
	appointmentID, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	if err := controller.Service.Delete(appointmentID); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{"deleted": true})
}
