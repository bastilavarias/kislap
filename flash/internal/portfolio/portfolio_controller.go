package portfolio

import (
	"flash/pkg/llm"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

func (controller Controller) Create(context *gin.Context) {
	controller.Service.Create()
}
