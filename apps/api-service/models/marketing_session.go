package models

import "time"

type MarketingSession struct {
	ID              uint64     `gorm:"primaryKey;autoIncrement" json:"id"`
	SessionKey      string     `gorm:"column:session_key;size:255;uniqueIndex" json:"session_key"`
	VisitorKey      *string    `gorm:"column:visitor_key;size:255;index" json:"visitor_key,omitempty"`
	EntryPage       string     `gorm:"column:entry_page;size:255" json:"entry_page"`
	ExitPage        *string    `gorm:"column:exit_page;size:255" json:"exit_page,omitempty"`
	Referrer        *string    `gorm:"column:referrer;size:255" json:"referrer,omitempty"`
	SourceLabel     string     `gorm:"column:source_label;size:255;index" json:"source_label"`
	UTMSource       *string    `gorm:"column:utm_source;size:255;index" json:"utm_source,omitempty"`
	UTMMedium       *string    `gorm:"column:utm_medium;size:255" json:"utm_medium,omitempty"`
	UTMCampaign     *string    `gorm:"column:utm_campaign;size:255" json:"utm_campaign,omitempty"`
	DeviceType      *string    `gorm:"column:device_type;size:100" json:"device_type,omitempty"`
	Browser         *string    `gorm:"column:browser;size:100" json:"browser,omitempty"`
	IPAddress       *string    `gorm:"column:ip_address;size:45" json:"ip_address,omitempty"`
	DurationSeconds uint       `gorm:"column:duration_seconds;default:0" json:"duration_seconds"`
	IsBounced       bool       `gorm:"column:is_bounced;default:true" json:"is_bounced"`
	StartedAt       *time.Time `gorm:"column:started_at" json:"started_at,omitempty"`
	LastSeenAt      *time.Time `gorm:"column:last_seen_at" json:"last_seen_at,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`

	Events []MarketingEvent `gorm:"foreignKey:MarketingSessionID" json:"events,omitempty"`
}

func (MarketingSession) TableName() string {
	return "marketing_sessions"
}
