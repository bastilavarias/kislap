package models

import (
	"time"

	"gorm.io/gorm"
)

type Education struct {
	ID          uint64  `gorm:"primaryKey;autoIncrement" json:"id"`
	PortfolioID *uint64 `gorm:"index" json:"portfolio_id"`

	School    *string `gorm:"size:255" json:"school"`
	Level     *string `gorm:"size:255" json:"level"`
	Degree    *string `gorm:"size:255" json:"degree"`
	Location  *string `gorm:"size:255" json:"location"`
	YearStart *int    `json:"year_start,omitempty"`
	YearEnd   *int    `json:"year_end,omitempty"`
	About     *string `gorm:"type:text" json:"about"`

	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`

	Portfolio *Portfolio `gorm:"foreignKey:PortfolioID;constraint:OnDelete:SET NULL;" json:"portfolio,omitempty"`
}
