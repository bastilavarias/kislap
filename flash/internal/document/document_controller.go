package document

import (
	"flash/pkg/llm"
	"flash/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"mime/multipart"
	"net/http"
)

type Controller struct {
	Service *Service
}

func NewController(db *gorm.DB, llm llm.Provider) *Controller {
	service := &Service{
		DB:  db,
		LLM: llm,
	}
	return &Controller{Service: service}
}

func (controller Controller) Parse(context *gin.Context) {
	docType := context.PostForm("type")
	if docType == "" {
		context.JSON(http.StatusBadRequest, gin.H{"error": "type is required"})
		return
	}

	request := ParseDocumentRequest{
		Type: docType,
	}

	file, err := context.FormFile("file")
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	theFile, err := file.Open()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open file"})
		return
	}
	defer func(theFile multipart.File) {
		err := theFile.Close()
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to close file"})
			return
		}
	}(theFile)

	if err := utils.ValidateRequestPDF(theFile, file.Filename, 5<<20); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data, err := controller.Service.Parse(request.ToServicePayload(theFile))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, data)
}
