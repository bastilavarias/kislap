package parsed_file

import (
	"math"
	"mime/multipart"
	"net/http"
	"strconv"

	"flash/utils"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	Service *Service
}

func NewController(service *Service) *Controller {
	return &Controller{Service: service}
}

func (controller Controller) List(context *gin.Context) {
	userID := context.GetUint64("user_id")
	projectType := context.DefaultQuery("project_type", "")
	page, _ := strconv.Atoi(context.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(context.DefaultQuery("limit", "10"))

	records, total, err := controller.Service.List(ListPayload{
		UserID:      userID,
		ProjectType: projectType,
		Page:        page,
		Limit:       limit,
	})
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		context.Abort()
		return
	}

	responses, err := controller.Service.ToResponses(records)
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		context.Abort()
		return
	}

	lastPage := int(math.Ceil(float64(total) / float64(limit)))
	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"data": responses,
		"meta": gin.H{
			"page":      page,
			"limit":     limit,
			"total":     total,
			"last_page": lastPage,
		},
	})
}

func (controller Controller) Create(context *gin.Context) {
	userID := context.GetUint64("user_id")

	var request CreateParsedFileRequest
	if err := context.ShouldBind(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	files := make([]*multipart.FileHeader, 0)
	if file, err := context.FormFile("file"); err == nil && file != nil {
		files = append(files, file)
	}

	if form, err := context.MultipartForm(); err == nil && form != nil {
		if formFiles, ok := form.File["files"]; ok {
			files = append(files, formFiles...)
		}
	}

	if len(files) == 0 {
		utils.APIRespondError(context, http.StatusBadRequest, "No files provided")
		context.Abort()
		return
	}

	if err := ValidateFilesAsPDFs(files); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	record, err := controller.Service.Create(request.ToCreatePayload(userID, files))
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	response, err := controller.Service.ToResponse(*record)
	if err != nil {
		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, response)
}
