package llm

type Provider interface {
	Generate(prompt string) (string, error)
}
