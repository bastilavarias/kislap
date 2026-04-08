package models

import (
	"encoding/json"
	"time"
)

type MarketingEvent struct {
	ID                 uint64           `gorm:"primaryKey;autoIncrement" json:"id"`
	MarketingSessionID uint64           `gorm:"column:marketing_session_id;index" json:"marketing_session_id"`
	EventType          string           `gorm:"column:event_type;size:100;index" json:"event_type"`
	EventName          string           `gorm:"column:event_name;size:150;index" json:"event_name"`
	PagePath           string           `gorm:"column:page_path;size:255;index" json:"page_path"`
	TargetURL          *string          `gorm:"column:target_url;size:255" json:"target_url,omitempty"`
	ElementKey         *string          `gorm:"column:element_key;size:150" json:"element_key,omitempty"`
	Meta               *json.RawMessage `gorm:"column:meta;type:json" json:"meta,omitempty"`
	CreatedAt          time.Time        `json:"created_at"`
	UpdatedAt          time.Time        `json:"updated_at"`

	Session *MarketingSession `gorm:"foreignKey:MarketingSessionID" json:"session,omitempty"`
}

func (MarketingEvent) TableName() string {
	return "marketing_events"
}
