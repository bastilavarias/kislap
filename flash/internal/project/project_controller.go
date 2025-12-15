package project

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
	service := &Service{
		DB: db,
	}

	return &Controller{Service: service}
}

func (controller Controller) List(context *gin.Context) {
	userID := context.GetUint64("user_id")

	page, _ := strconv.Atoi(context.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(context.DefaultQuery("limit", "10"))

	projects, err := controller.Service.List(userID, page, limit)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, projects)

}

func (controller Controller) Create(context *gin.Context) {
	var request CreateUpdateProjectRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	userID := context.GetUint64("user_id")

	project, err := controller.Service.Create(userID, request.ToServicePayload())
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) ShowByID(context *gin.Context) {
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
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) ShowBySlug(context *gin.Context) {
	slug := context.Param("slug")
	level := context.Query("level")

	project, err := controller.Service.ShowBySlug(slug, level)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) ShowBySubDomain(context *gin.Context) {
	subDomain := context.Param("sub-domain")

	project, err := controller.Service.ShowBySubDomain(subDomain)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) Update(context *gin.Context) {
	idStr := context.Param("id")
	projectID, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	var request CreateUpdateProjectRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	project, err := controller.Service.Update(projectID, request.ToServicePayload())

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) Delete(context *gin.Context) {
	idStr := context.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	project, err := controller.Service.Delete(id)
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}

func (controller Controller) CheckDomain(context *gin.Context) {
	subDomain := context.Param("sub-domain")

	ok, err := controller.Service.CheckDomain(subDomain)
	if !ok {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, subDomain)
}

func (controller Controller) Publish(context *gin.Context) {
	idStr := context.Param("id")
	projectID, err := strconv.Atoi(idStr)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	var request PublishProjectRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	project, err := controller.Service.Publish(projectID, request.ToPublishServicePayload())

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, project)
}
