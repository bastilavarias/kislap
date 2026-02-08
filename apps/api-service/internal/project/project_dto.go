package project

const TypeResume = "resume"

type CreateUpdateProjectRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	SubDomain   string `json:"sub_domain" binding:"required"`
	Type        string `json:"type" binding:"required,oneof=portfolio biz linktree waitlist"`
	Published   bool   `json:"published"`
}

type PublishProjectRequest struct {
	Published bool `json:"published"`
}

type SaveOGImageRequest struct {
	URL string `json:"url" binding:"required"`
}

type Payload struct {
	Name        string
	Description string
	SubDomain   string
	Type        string
	Published   bool
}

type PublishProjectPayload struct {
	Published bool
}

func (r CreateUpdateProjectRequest) ToServicePayload() Payload {
	return Payload(r)
}

func (r PublishProjectRequest) ToPublishServicePayload() PublishProjectPayload {
	return PublishProjectPayload(r)
}
