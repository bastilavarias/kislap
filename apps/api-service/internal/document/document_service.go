package document

import (
	"fmt"
	"io"
	"time"

	"flash/sdk/llm"
	"flash/sdk/llm/prompt"
	objectStorage "flash/sdk/object_storage"
	pdf "flash/shared/pdf"
	"flash/utils"

	"gorm.io/gorm"
)

type Service struct {
	DB            *gorm.DB
	LLM           llm.Provider
	ObjectStorage objectStorage.Provider
}

func (service Service) Parse(payload Payload) (*PortfolioResponse, error) {
	resetCursor := func() error {
		seeker, ok := payload.File.(io.Seeker)
		if !ok {
			return fmt.Errorf("file payload does not support seeking, cannot reset cursor")
		}
		if _, err := seeker.Seek(0, io.SeekStart); err != nil {
			return fmt.Errorf("failed to seek file: %w", err)
		}
		return nil
	}

	content, err := pdf.ExtractText(payload.File)
	var generatedPrompt string

	if err != nil || content == "" {

		if err := resetCursor(); err != nil {
			return nil, err
		}

		if err := pdf.ValidatePageCount(payload.File, 1, 3); err != nil {
			return nil, err
		}

		if err := resetCursor(); err != nil {
			return nil, err
		}

		imgReader, err := pdf.ConvertToImage(payload.File, 0)
		if err != nil {
			return nil, err
		}

		filename := fmt.Sprintf("resumes/%d_fallback.png", time.Now().Unix())
		uploadedURL, err := service.ObjectStorage.Upload(filename, imgReader, "image/png")
		if err != nil {
			return nil, err
		}

		generatedPrompt = prompt.ObjectStorageFileToContent(uploadedURL)
	} else {
		generatedPrompt = prompt.ResumeToJSON(content)
	}

	aiResp, err := service.LLM.Generate(generatedPrompt, nil)
	if err != nil || aiResp == "" || aiResp == "null" {
		return nil, err
	}

	structData, err := utils.ParseLLMJSON[PortfolioResponse](aiResp)
	if err != nil {
		return nil, err
	}

	return structData, nil
}
