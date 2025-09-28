package llm

import "fmt"

var defaultProvider Provider

func Default(provider Provider) Provider {
	defaultProvider = provider

	fmt.Println(provider);
	return defaultProvider
}

func Generate(prompt string) (string, error) {
	if defaultProvider == nil {
		return "", fmt.Errorf("no LLM provider initialized")
	}
	return defaultProvider.Generate(prompt)
}
