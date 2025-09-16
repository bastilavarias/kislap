package portfolio

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
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

	portfolio, err := controller.Service.Create(request.ToServicePayload())
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": portfolio})
}

func (controller Controller) Get(context *gin.Context) {
	paramID := context.Param("id")

	portfolioID, err := strconv.Atoi(paramID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	portfolio, err := controller.Service.Get(uint64(portfolioID))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"data": portfolio})
}

func (controller Controller) Update(context *gin.Context) {
	paramID := context.Param("id")
	var request CreateUpdatePortfolioRequest

	portfolioID, err := strconv.Atoi(paramID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	portfolio, err := controller.Service.Update(uint64(portfolioID), request.ToServicePayload())
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
