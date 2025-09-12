package portfolio

import (
	"flash/pkg/llm"
	"flash/pkg/llm/prompt"
	pdfExtractor "flash/shared/pdf_extractor"
	"flash/utils"
	"fmt"
	"gorm.io/gorm"
)

type Service struct {
	DB  *gorm.DB
	LLM llm.Provider
}

func (service Service) Create() {
	extractor := pdfExtractor.Default()
	content, err := extractor.Extract(utils.GetLocalPath("./shared/pdf_extractor/sample.pdf"))
	if err != nil {
		fmt.Println("Error extracting PDF:", err)
		return
	}

	response, err := service.LLM.Generate(prompt.ResumeToJSON(content))
	if err != nil {
		fmt.Println("Error generating JSON:", err)
		return
	}

	fmt.Println("Formatted JSON Response:\n", response)
}
