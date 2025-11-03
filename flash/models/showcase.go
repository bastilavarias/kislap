package models

import (
	"time"

	"gorm.io/gorm"
)

type Showcase struct {
	ID          uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	PortfolioID uint64         `gorm:"index" json:"portfolio_id"`
	Name        string         `gorm:"size:255" json:"name"`
	URL         *string        `gorm:"type:text" json:"url"`
	Description *string        `gorm:"type:text" json:"description"`
	Role        *string        `gorm:"size:255" json:"role"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	Portfolio            *Portfolio           `gorm:"foreignKey:PortfolioID;constraint:OnDelete:SET NULL;" json:"portfolio,omitempty"`
	ShowcaseTechnologies []ShowcaseTechnology `gorm:"foreignKey:ShowcaseID" json:"technologies,omitempty"`
}
