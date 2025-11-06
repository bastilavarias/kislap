package appointment

import "time"

type CreateUpdateAppointmentRequest struct {
	UserID        uint64     `json:"user_id" binding:"required"`
	ProjectID     uint64     `json:"project_id" binding:"required"`
	Date          *time.Time `json:"date,omitempty"`
	TimeFrom      *time.Time `json:"time_from,omitempty"`
	TimeTo        *time.Time `json:"time_to,omitempty"`
	Name          string     `json:"name" binding:"required"`
	Email         string     `json:"email" binding:"required,email"`
	ContactNumber *string    `json:"contact_number,omitempty"`
	Message       *string    `json:"message,omitempty"`
}

type Payload struct {
	UserID        uint64
	ProjectID     uint64
	Date          *time.Time
	TimeFrom      *time.Time
	TimeTo        *time.Time
	Name          string
	Email         string
	ContactNumber *string
	Message       *string
}

func (r CreateUpdateAppointmentRequest) ToServicePayload() Payload {
	return Payload(r)
}
