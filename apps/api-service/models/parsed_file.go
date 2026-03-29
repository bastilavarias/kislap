package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type ParsedFile struct {
	ID          uint64          `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID      uint64          `gorm:"column:user_id;not null;index" json:"user_id"`
	ProjectType string          `gorm:"column:project_type;size:50;not null;index" json:"project_type"`
	SourceType  string          `gorm:"column:source_type;size:50;not null;index" json:"source_type"`
	SourceName  string          `gorm:"column:source_name;size:255;not null" json:"source_name"`
	Status      string          `gorm:"column:status;size:30;not null;default:completed" json:"status"`
	ParsedData  *json.RawMessage `gorm:"column:parsed_data;type:json" json:"parsed_data"`
	CreatedAt   time.Time       `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time       `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt  `gorm:"index" json:"deleted_at,omitempty"`
}

func (ParsedFile) TableName() string {
	return "parsed_files"
}
