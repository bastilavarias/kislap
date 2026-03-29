package parsed_file

import "mime/multipart"

type CreateParsedFileRequest struct {
	ProjectType string `form:"project_type" binding:"required,oneof=portfolio menu"`
	SourceType  string `form:"source_type" binding:"required,oneof=resume menu"`
}

type CreatePayload struct {
	UserID      uint64
	ProjectType string
	SourceType  string
	Files       []*multipart.FileHeader
}

type ListPayload struct {
	UserID      uint64
	ProjectType string
	Page        int
	Limit       int
}

func (request CreateParsedFileRequest) ToCreatePayload(userID uint64, files []*multipart.FileHeader) CreatePayload {
	return CreatePayload{
		UserID:      userID,
		ProjectType: request.ProjectType,
		SourceType:  request.SourceType,
		Files:       files,
	}
}
