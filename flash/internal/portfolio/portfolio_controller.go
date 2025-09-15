package portfolio

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
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

func (controller Controller) Create(context *gin.Context) {
	var request CreateUpdatePortfolioRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	controller.Service.Create(request.ToServicePayload())
}
