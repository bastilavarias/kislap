package project

const TypeResume = "resume"

type CreateUpdateProjectRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	SubDomain   string `json:"sub_domain" binding:"required"`
	Type        string `json:"type" binding:"required,oneof=portfolio biz links waitlist"`
}

type Payload struct {
	Name        string
	Description string
	SubDomain   string
	Type        string
}

func (request CreateUpdateProjectRequest) ToServicePayload() Payload {
	return Payload(request)
}
