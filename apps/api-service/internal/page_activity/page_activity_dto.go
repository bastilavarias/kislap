package page_activity

type TrackActivityRequest struct {
	ProjectID uint64  `json:"project_id,omitempty"`
	Type      string  `json:"type" binding:"required"`
	PageURL   string  `json:"page_url" binding:"required"`
	ModelID   *uint64 `json:"model_id,omitempty"`
	ModelName *string `json:"model_name,omitempty"`
}

type Payload struct {
	ProjectID uint64
	Type      string
	PageURL   string
	IPAddress string
	ModelID   *uint64
	ModelName *string
}

func (r TrackActivityRequest) ToServicePayload() Payload {
	return Payload{
		ProjectID: r.ProjectID,
		Type:      r.Type,
		PageURL:   r.PageURL,
		ModelID:   r.ModelID,
		ModelName: r.ModelName,
	}
}
