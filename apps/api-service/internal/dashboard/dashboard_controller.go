package dashboard

import (
	"flash/utils"
	"net/http"

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

func (controller Controller) PublicMetrics(context *gin.Context) {
	metrics, err := controller.Service.PublicMetrics()
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, metrics)
}
