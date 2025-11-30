package appointment

type CreateUpdateAppointmentRequest struct {
	UserID        uint64  `json:"user_id" binding:"required"`
	ProjectID     uint64  `json:"project_id" binding:"required"`
	Name          string  `json:"name" binding:"required"`
	Email         string  `json:"email" binding:"required,email"`
	ContactNumber *string `json:"contact_number,omitempty"`
	Message       *string `json:"message,omitempty"`
}

type Payload struct {
	UserID        uint64
	ProjectID     uint64
	Name          string
	Email         string
	ContactNumber *string
	Message       *string
}

func (r CreateUpdateAppointmentRequest) ToServicePayload() Payload {
	return Payload(r)
}
