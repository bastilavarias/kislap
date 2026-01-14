package document

import (
	"flash/sdk/llm"
	objectStorage "flash/sdk/object_storage"
	"flash/utils"
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Service *Service
}

func NewController(db *gorm.DB, llm llm.Provider, objectStorage objectStorage.Provider) *Controller {
	service := &Service{
		DB:            db,
		LLM:           llm,
		ObjectStorage: objectStorage,
	}
	return &Controller{Service: service}
}

func (controller Controller) Parse(context *gin.Context) {
	docType := context.PostForm("type")
	if docType == "" {
		utils.APIRespondError(context, http.StatusBadRequest, "invalid document type.")
		context.Abort()
		return
	}

	request := ParseDocumentRequest{
		Type: docType,
	}

	file, err := context.FormFile("file")
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	theFile, err := file.Open()
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}
	defer func(theFile multipart.File) {
		err := theFile.Close()
		if err != nil {
			utils.APIRespondError(context, http.StatusBadRequest, err.Error())
			context.Abort()
			return
		}
	}(theFile)

	if err := utils.ValidateRequestPDF(theFile, file.Filename, 5<<20); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	data, err := controller.Service.Parse(request.ToServicePayload(theFile))
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, data)
}
