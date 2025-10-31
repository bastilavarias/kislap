package auth

import (
	"flash/shared/cookie"
	"flash/utils"
	"net/http"

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

func (controller Controller) Login(context *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := context.ShouldBindJSON(&input); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	result, err := controller.Service.Login(input.Email, input.Password)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	cookie.SetCookie(context, "refresh_token", result.RefreshToken)

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"access_token": result.AccessToken,
		"user":         result.User,
	})
}

func (controller Controller) Refresh(context *gin.Context) {
	userID, exists := context.Get("user_id")

	if !exists {
		utils.APIRespondError(context, http.StatusUnauthorized, "User not exists")
		context.Abort()
		return
	}

	refreshToken, exists := context.Get("refresh_token")
	if !exists {
		utils.APIRespondError(context, http.StatusUnauthorized, "Invalid refresh token")
		context.Abort()
		return
	}

	uid := userID.(uint64)
	strRefreshToken := refreshToken.(string)

	result, err := controller.Service.Refresh(uid, strRefreshToken)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()
		return
	}

	cookie.SetCookie(context, "refresh_token", result.RefreshToken)

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"access_token": result.AccessToken,
		"user":         result.User,
	})
}

func (controller *Controller) GithubLogin(context *gin.Context) {
	var input struct {
		Code string `json:"code" binding:"required"`
	}

	if err := context.ShouldBindJSON(&input); err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	result, err := controller.Service.GithubLogin(input.Code)

	if err != nil {
		utils.APIRespondError(context, http.StatusBadRequest, err.Error())
		context.Abort()
		return
	}

	cookie.SetCookie(context, "refresh_token", result.RefreshToken)

	utils.APIRespondSuccess(context, http.StatusOK, gin.H{
		"access_token": result.AccessToken,
		"user":         result.User,
	})
}
