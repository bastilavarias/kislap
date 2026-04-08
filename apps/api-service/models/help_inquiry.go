package models

import "time"

type HelpInquiry struct {
	ID           uint64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Title        string     `gorm:"column:title;size:255" json:"title"`
	Name         string     `gorm:"column:name;size:255" json:"name"`
	Email        string     `gorm:"column:email;size:255;index" json:"email"`
	MobileNumber *string    `gorm:"column:mobile_number;size:50" json:"mobile_number,omitempty"`
	Description  string     `gorm:"column:description;type:text" json:"description"`
	SourcePage   *string    `gorm:"column:source_page;size:255" json:"source_page,omitempty"`
	Status       string     `gorm:"column:status;size:50;index" json:"status"`
	AdminNotes   *string    `gorm:"column:admin_notes;type:text" json:"admin_notes,omitempty"`
	ResolvedAt   *time.Time `gorm:"column:resolved_at" json:"resolved_at,omitempty"`
	IPAddress    string     `gorm:"column:ip_address;size:45;index" json:"ip_address"`
	UserAgent    *string    `gorm:"column:user_agent;type:text" json:"user_agent,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

func (HelpInquiry) TableName() string {
	return "help_inquiries"
}
