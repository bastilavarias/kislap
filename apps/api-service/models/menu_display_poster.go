package models

import "time"

type MenuDisplayPoster struct {
	ID          uint64     `gorm:"primaryKey;autoIncrement" json:"id"`
	MenuID      uint64     `gorm:"index" json:"menu_id"`
	ProjectID   uint64     `gorm:"index" json:"project_id"`
	ImageURL    string     `gorm:"column:image_url;type:text" json:"image_url"`
	Settings    []byte     `gorm:"column:settings;type:json" json:"settings"`
	IsDeleted   bool       `gorm:"column:is_deleted;default:false" json:"is_deleted"`
	DeletedAt   *time.Time `gorm:"column:deleted_at" json:"deleted_at,omitempty"`
	CreatedAt   time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}

func (MenuDisplayPoster) TableName() string {
	return "menu_display_posters"
}
