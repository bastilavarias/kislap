package utils

import "github.com/gin-gonic/gin"

type APIResponse[T any] struct {
	Success bool   `json:"success"`
	Status  int    `json:"status"`
	Message string `json:"message"`
	Data    T      `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

func APIRespond[T any](ctx *gin.Context, status int, success bool, message string, data T) {
	ctx.JSON(status, APIResponse[T]{
		Success: success,
		Status:  status,
		Message: message,
		Data:    data,
	})
}

func APIRespondSuccess[T any](ctx *gin.Context, status int, message string, data T) {
	APIRespond(ctx, status, true, message, data)
}

func APIRespondError(ctx *gin.Context, status int, message string) {
	APIRespond(ctx, status, false, message, struct{}{})
}
