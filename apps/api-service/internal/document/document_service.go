package document

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"strings"
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
	data, err := service.ParseForType(payload)
	if err != nil {
		return nil, err
	}

	response, ok := data.(*PortfolioResponse)
	if !ok {
		return nil, fmt.Errorf("invalid parser response for resume")
	}

	return response, nil
}

func (service Service) ParseForType(payload Payload) (any, error) {
	if payload.Type == "resume" && len(payload.Files) == 1 {
		return service.parseResume(payload.Files[0])
	}

	content, err := service.extractContent(payload)
	if err != nil {
		return nil, err
	}

	var generatedPrompt string
	switch payload.Type {
	case "menu":
		generatedPrompt = prompt.MenuToJSON(content)
	default:
		return nil, fmt.Errorf("unsupported parser type: %s", payload.Type)
	}

	aiResp, err := service.LLM.Generate(generatedPrompt, nil)
	if err != nil || aiResp == "" || aiResp == "null" {
		return nil, err
	}

	switch payload.Type {
	case "menu":
		return utils.ParseLLMJSON[MenuResponse](aiResp)
	default:
		return nil, fmt.Errorf("unsupported parser type: %s", payload.Type)
	}
}

func (service Service) ParseJSON(payload Payload) (*json.RawMessage, error) {
	data, err := service.ParseForType(payload)
	if err != nil {
		return nil, err
	}

	encoded, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	raw := json.RawMessage(encoded)
	return &raw, nil
}

func (service Service) extractContent(payload Payload) (string, error) {
	if len(payload.Files) == 0 {
		return "", fmt.Errorf("no files provided")
	}

	parts := make([]string, 0, len(payload.Files))
	for _, inputFile := range payload.Files {
		content, err := service.extractPDFText(inputFile)
		if err != nil {
			return "", err
		}
		if strings.TrimSpace(content) != "" {
			parts = append(parts, content)
		}
	}

	if len(parts) == 0 {
		return "", fmt.Errorf("failed to extract parser content")
	}

	return strings.Join(parts, "\n\n---\n\n"), nil
}

func (service Service) parseResume(inputFile FilePayload) (*PortfolioResponse, error) {
	content, media, err := service.extractResumeContent(inputFile)
	if err != nil {
		return nil, err
	}

	generatedPrompt := prompt.ResumeToJSON(content)
	if media != nil {
		generatedPrompt = prompt.ObjectStorageFileToContent(media.URL)
	}

	aiResp, err := service.LLM.Generate(generatedPrompt, media)
	if err != nil || aiResp == "" || aiResp == "null" {
		return nil, err
	}

	return utils.ParseLLMJSON[PortfolioResponse](aiResp)
}

func (service Service) extractResumeContent(inputFile FilePayload) (string, *llm.Media, error) {
	content, err := service.extractPDFText(inputFile)
	if err == nil && strings.TrimSpace(content) != "" {
		return content, nil, nil
	}

	if err := resetReadSeeker(inputFile.File); err != nil {
		return "", nil, err
	}

	if err := pdf.ValidatePageCount(inputFile.File, 1, 3); err != nil {
		return "", nil, err
	}

	if err := resetReadSeeker(inputFile.File); err != nil {
		return "", nil, err
	}

	imgReader, err := pdf.ConvertToImage(inputFile.File, 0)
	if err != nil {
		return "", nil, err
	}

	filename := fmt.Sprintf("resumes/%d_fallback.png", time.Now().UnixNano())
	uploadedURL, err := service.ObjectStorage.Upload(filename, imgReader, "image/png")
	if err != nil {
		return "", nil, err
	}

	return "", &llm.Media{URL: uploadedURL}, nil
}

func (service Service) extractPDFText(inputFile FilePayload) (string, error) {
	if err := resetReadSeeker(inputFile.File); err != nil {
		return "", err
	}

	content, err := pdf.ExtractText(inputFile.File)
	if err != nil {
		return "", err
	}

	if err := resetReadSeeker(inputFile.File); err != nil {
		return "", err
	}

	return content, nil
}

func resetReadSeeker(seeker io.ReadSeeker) error {
	if _, err := seeker.Seek(0, io.SeekStart); err != nil {
		return fmt.Errorf("failed to seek file: %w", err)
	}
	return nil
}

func cloneMultipartFile(file io.Reader) (io.ReadSeeker, error) {
	buffer := bytes.NewBuffer(nil)
	if _, err := io.Copy(buffer, file); err != nil {
		return nil, err
	}
	return bytes.NewReader(buffer.Bytes()), nil
}
