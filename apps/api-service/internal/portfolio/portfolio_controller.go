package portfolio

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

func (controller Controller) Save(context *gin.Context) {
	var request CreateUpdatePortfolioRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	portfolio, err := controller.Service.Save(request.ToServicePayload())
	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"portfolio": portfolio,
	})
}

func (controller Controller) Get(context *gin.Context) {
	paramID := context.Param("id")

	portfolioID, err := strconv.Atoi(paramID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	portfolio, err := controller.Service.GetByIDWithPreloads(uint64(portfolioID))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": portfolio})
}

func (controller Controller) Delete(context *gin.Context) {
	paramID := context.Param("id")

	portfolioID, err := strconv.Atoi(paramID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = controller.Service.Delete(uint64(portfolioID))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": nil})
}
