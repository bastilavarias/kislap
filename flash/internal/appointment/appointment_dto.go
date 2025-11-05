package appointment

import "time"

type CreateUpdateAppointmentRequest struct {
	UserID    uint64     `json:"user_id" binding:"required"`
	ProjectID uint64     `json:"project_id" binding:"required"`
	Date      *time.Time `json:"date,omitempty"`
	TimeFrom  *string    `json:"time_from,omitempty"`
	TimeTo    *string    `json:"time_to,omitempty"`
}

type Payload struct {
	UserID    uint64
	ProjectID uint64
	Date      *time.Time
	TimeFrom  *string
	TimeTo    *string
}

func (r CreateUpdateAppointmentRequest) ToServicePayload() Payload {
	return Payload(r)
}
