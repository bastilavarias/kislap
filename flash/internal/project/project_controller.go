package project

import (
	"flash/sdk/dns"
	"flash/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Service *Service
}

func NewController(db *gorm.DB, dns dns.Provider) *Controller {
	service := &Service{
		DB:  db,
		DNS: dns,
	}

	return &Controller{Service: service}
}

func (controller Controller) List(context *gin.Context) {
	projects, err := controller.Service.List()

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	utils.APIRespondSuccess(context, http.StatusOK, projects)
}

func (controller Controller) Create(context *gin.Context) {
	var request CreateUpdateProjectRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	project, err := controller.Service.Create(request.ToServicePayload())
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) Show(context *gin.Context) {
	idStr := context.Param("id")
	projectID, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	project, err := controller.Service.Show(projectID)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) Update(context *gin.Context) {
	idStr := context.Param("id")
	projectID, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	var request CreateUpdateProjectRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	project, err := controller.Service.Update(projectID, request.ToServicePayload())

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) Delete(context *gin.Context) {
	idStr := context.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	project, err := controller.Service.Delete(id)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) CheckDomain(context *gin.Context) {
	subDomain := context.Param("sub-domain")

	ok, err := controller.Service.CheckDomain(subDomain)
	if !ok {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
	}

	utils.APIRespondSuccess(context, http.StatusOK, subDomain)
}
