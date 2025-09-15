package project

const TYPE_RESUME = "resume"

type CreateUpdateProjectRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Theme       string `json:"theme" binding:"required"`
	Layout      string `json:"layout" binding:"required"`
	Type        string `json:"type" binding:"required,oneof=portfolio biz links waitlist"`
}

type Payload struct {
	Name        string
	Description string
	Theme       string
	Layout      string
	Type        string
}

func (r CreateUpdateProjectRequest) ToServicePayload() Payload {
	return Payload(r)
}
