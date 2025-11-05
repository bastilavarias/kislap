package appointment

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

func (controller Controller) List(context *gin.Context) {
	appointments, err := controller.Service.List()
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}
	utils.APIRespondSuccess(context, http.StatusOK, appointments)
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

	var request CreateUpdateappointmentRequest
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
