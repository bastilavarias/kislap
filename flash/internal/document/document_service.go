package document

import (
	"errors"
	"flash/internal/project"
	"flash/pkg/llm/prompt"
	"flash/sdk/llm"
	pdfExtractor "flash/shared/pdf_extractor"
	"flash/utils"
	"gorm.io/gorm"
)

type Service struct {
	DB  *gorm.DB
	LLM llm.Provider
}

func (service Service) Parse(payload Payload) (*PortfolioResponse, error) {
	extractor := pdfExtractor.Default()
	content, err := extractor.ExtractFromReader(payload.File)
	if err != nil {
		return nil, err
	}

	var generatedPrompt string
	givenType := payload.Type

	if givenType == project.TYPE_RESUME {
		generatedPrompt = prompt.ResumeToJSON(content)
	} else {
		return nil, errors.New("invalid type")
	}

	aiResp, err := service.LLM.Generate(generatedPrompt)
	if err != nil {
		return nil, err
	}

	structData, err := utils.ParseLLMJSON[PortfolioResponse](aiResp)
	if err != nil {
		return nil, err
	}

	return structData, nil
}
