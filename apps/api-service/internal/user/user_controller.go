package user

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

func (controller *Controller) Register(context *gin.Context) {
	var input struct {
		FirstName    string `json:"first_name" binding:"required"`
		LastName     string `json:"last_name" binding:"required"`
		MobileNumber string `json:"mobile_number"`
		Email        string `json:"email" binding:"required,email"`
		Password     string `json:"password" binding:"required"`
	}

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := controller.Service.Register(input.FirstName, input.LastName, input.MobileNumber, input.Email, input.Password)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"success": user})
}
