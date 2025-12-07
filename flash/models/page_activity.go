package models

import "time"

type PageActivity struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	ProjectID uint64 `json:"project_id"`
	Type      string `json:"type"`
	PageURL   string `json:"page_url"`
	IPAddress string `json:"ip_address"`

	ModelID   *uint64 `json:"model_id"`
	ModelName *string `json:"model_name"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
