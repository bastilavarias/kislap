package parsed_file

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"time"

	"flash/internal/document"
	"flash/models"
	"flash/utils"

	"gorm.io/gorm"
)

type Service struct {
	DB              *gorm.DB
	DocumentService *document.Service
}

func NewService(db *gorm.DB, documentService *document.Service) *Service {
	return &Service{DB: db, DocumentService: documentService}
}

func (service *Service) List(payload ListPayload) ([]models.ParsedFile, int64, error) {
	if payload.Page <= 0 {
		payload.Page = 1
	}
	if payload.Limit <= 0 {
		payload.Limit = 10
	}

	query := service.DB.Model(&models.ParsedFile{}).
		Where("user_id = ?", payload.UserID)
	if payload.ProjectType != "" {
		query = query.Where("project_type = ?", payload.ProjectType)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (payload.Page - 1) * payload.Limit
	var records []models.ParsedFile
	if err := query.
		Order("created_at desc").
		Limit(payload.Limit).
		Offset(offset).
		Find(&records).Error; err != nil {
		return nil, 0, err
	}

	return records, total, nil
}

func (service *Service) Create(payload CreatePayload) (*models.ParsedFile, error) {
	if len(payload.Files) == 0 {
		return nil, fmt.Errorf("no files provided")
	}

	filePayloads := make([]document.FilePayload, 0, len(payload.Files))
	for _, file := range payload.Files {
		opened, err := file.Open()
		if err != nil {
			return nil, err
		}
		defer opened.Close()

		buf := bytes.NewBuffer(nil)
		if _, err := io.Copy(buf, opened); err != nil {
			return nil, err
		}

		filePayloads = append(filePayloads, document.FilePayload{
			Name: file.Filename,
			File: bytes.NewReader(buf.Bytes()),
		})
	}

	parsedData, err := service.DocumentService.ParseJSON(document.Payload{
		Type:  payload.SourceType,
		Files: filePayloads,
	})
	if err != nil {
		return nil, err
	}

	sourceName := payload.Files[0].Filename
	if len(payload.Files) > 1 {
		sourceName = fmt.Sprintf("%s + %d more", payload.Files[0].Filename, len(payload.Files)-1)
	}

	record := models.ParsedFile{
		UserID:      payload.UserID,
		ProjectType: payload.ProjectType,
		SourceType:  payload.SourceType,
		SourceName:  sourceName,
		Status:      "completed",
		ParsedData:  parsedData,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := service.DB.Create(&record).Error; err != nil {
		return nil, err
	}

	return &record, nil
}

func (service *Service) ToResponse(record models.ParsedFile) (map[string]any, error) {
	var parsed any
	if record.ParsedData != nil {
		if err := json.Unmarshal(*record.ParsedData, &parsed); err != nil {
			return nil, err
		}
	}

	return map[string]any{
		"id": record.ID,
		"user_id": record.UserID,
		"project_type": record.ProjectType,
		"source_type": record.SourceType,
		"source_name": record.SourceName,
		"status": record.Status,
		"parsed_data": parsed,
		"created_at": record.CreatedAt,
		"updated_at": record.UpdatedAt,
	}, nil
}

func (service *Service) ToResponses(records []models.ParsedFile) ([]map[string]any, error) {
	responses := make([]map[string]any, 0, len(records))
	for _, record := range records {
		mapped, err := service.ToResponse(record)
		if err != nil {
			return nil, err
		}
		responses = append(responses, mapped)
	}

	return responses, nil
}

func ValidateFilesAsPDFs(files []*multipart.FileHeader) error {
	for _, file := range files {
		opened, err := file.Open()
		if err != nil {
			return err
		}

		if err := utils.ValidateRequestPDF(opened, file.Filename, 5<<20); err != nil {
			opened.Close()
			return err
		}
		opened.Close()
	}
	return nil
}
