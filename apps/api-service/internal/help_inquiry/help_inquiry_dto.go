package help_inquiry

type CreateHelpInquiryRequest struct {
	Title        string  `json:"title" binding:"required,max=255"`
	Name         string  `json:"name" binding:"required,max=255"`
	Email        string  `json:"email" binding:"required,email,max=255"`
	MobileNumber *string `json:"mobile_number,omitempty"`
	Description  string  `json:"description" binding:"required"`
	SourcePage   *string `json:"source_page,omitempty"`
}
