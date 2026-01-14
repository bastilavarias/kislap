package llm

type Media struct {
	URL      string
	MimeType string
}

type Provider interface {
	Generate(prompt string, media *Media) (string, error)
}
