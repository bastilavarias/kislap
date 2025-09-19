package llm

import "fmt"

type OpenAI struct {
	ApiKey string
}

func (o *OpenAI) Generate(prompt string) (string, error) {
	return fmt.Sprintf("[OpenAI generated]: %s", prompt), nil
}
