package auth

import (
	"flash/shared/cookie"
	"flash/utils"
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

func (controller Controller) Login(context *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := context.ShouldBindJSON(&input); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		return
	}

	tokens, err := controller.Service.Login(input.Email, input.Password)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		return
	}

	cookie.SetCookie(context, "refresh_token", tokens.RefreshToken)

	utils.APIRespondSuccess(context, http.StatusOK, "Login successful", gin.H{"access_token": tokens.AccessToken})
}

func (controller Controller) Refresh(context *gin.Context) {
	userID, exists := context.Get("user_id")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	uid := userID.(uint64)

	tokens, err := controller.Service.Refresh(uid)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cookie.SetCookie(context, "refresh_token", tokens.RefreshToken)

	context.JSON(http.StatusOK, gin.H{"access_token": tokens.AccessToken})
}
