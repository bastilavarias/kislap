package help_inquiry

import (
	"errors"
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

func (controller Controller) Create(context *gin.Context) {
	var request CreateHelpInquiryRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	userAgent := context.GetHeader("User-Agent")

	inquiry, err := controller.Service.Create(request, context.ClientIP(), &userAgent)
	if err != nil {
		if errors.Is(err, ErrDailyHelpInquiryLimitReached) {
			utils.APIRespondError(context, http.StatusTooManyRequests, "You have reached the daily inquiry limit for this IP address.")
			context.Abort()
			return
		}

		utils.APIRespondError(context, http.StatusInternalServerError, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusCreated, inquiry)
}
