package llm

import (
	"context"
	"fmt"
	"sync"

	"google.golang.org/genai"
)

type GeminiSDK struct {
	ApiKey string
	Model  string

	once   sync.Once
	client *genai.Client
	err    error
}

func (g *GeminiSDK) init() {
	g.once.Do(func() {
		ctx := context.Background()
		client, err := genai.NewClient(ctx, &genai.ClientConfig{
			APIKey:  g.ApiKey,
			Backend: genai.BackendGeminiAPI,
		})
		if err != nil {
			g.err = fmt.Errorf("failed to init Gemini client: %w", err)
			return
		}
		if g.Model == "" {
			g.Model = "gemini-2.5-flash"
		}
		g.client = client
	})
}

func (g *GeminiSDK) Generate(prompt string, media *Media) (string, error) {
	g.init()
	if g.err != nil {
		return "", g.err
	}

	ctx := context.Background()
	resp, err := g.client.Models.GenerateContent(ctx, g.Model, genai.Text(prompt), nil)
	if err != nil {
		return "", fmt.Errorf("gemini GenerateContent error: %w", err)
	}
	return resp.Text(), nil
}
