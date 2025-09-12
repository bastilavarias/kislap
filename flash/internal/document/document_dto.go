package document

type ParseDocumentRequest struct {
	Type string `json:"type" binding:"required"`
}

type Payload struct {
	Type string
}

func (request ParseDocumentRequest) ToServicePayload() Payload {
	return Payload(request)
}
