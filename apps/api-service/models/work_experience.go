package models

import (
	"time"

	"gorm.io/gorm"
)

type WorkExperience struct {
	ID          uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	PortfolioID uint64         `gorm:"index" json:"portfolio_id"`
	Company     string         `gorm:"size:255" json:"company"`
	URL         *string        `gorm:"size:255" json:"url"`
	Role        string         `gorm:"size:255" json:"role"`
	Location    *string        `gorm:"size:255" json:"location"`
	StartDate   string         `gorm:"string,omitempty" json:"start_date"`
	EndDate     *string        `gorm:"string,omitempty" json:"end_date"`
	About       *string        `gorm:"type:text" json:"about"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	Portfolio *Portfolio `gorm:"foreignKey:PortfolioID;constraint:OnDelete:SET NULL;" json:"portfolio,omitempty"`
}
