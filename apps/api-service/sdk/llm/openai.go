package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/openai/openai-go/v2"
	"github.com/openai/openai-go/v2/option"
)

type OpenAISDK struct {
	ApiKey string
	Model  string
}

func (sdk *OpenAISDK) Generate(prompt string, media *Media) (string, error) {
	if media != nil && media.URL != "" {
		return sdk.generateWithMedia(prompt, media)
	}

	return sdk.generateTextOnly(prompt)
}

func (sdk *OpenAISDK) generateTextOnly(prompt string) (string, error) {
	client := openai.NewClient(
		option.WithAPIKey(sdk.ApiKey),
	)

	chatCompletion, err := client.Chat.Completions.New(context.TODO(), openai.ChatCompletionNewParams{
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.UserMessage(prompt),
		},
		Model: openai.ChatModelGPT4o,
	})

	if err != nil {
		panic(err.Error())
	}

	return chatCompletion.Choices[0].Message.Content, nil
}

func (sdk *OpenAISDK) generateWithMedia(prompt string, media *Media) (string, error) {
	type contentItem struct {
		Type     string `json:"type"`
		Text     string `json:"text,omitempty"`
		ImageUrl string `json:"image_url,omitempty"`
	}

	type inputItem struct {
		Role    string        `json:"role"`
		Content []contentItem `json:"content"`
	}

	type requestPayload struct {
		Model string      `json:"model"`
		Input []inputItem `json:"input"`
	}

	payload := requestPayload{
		Model: sdk.Model,
		Input: []inputItem{
			{
				Role: "user",
				Content: []contentItem{
					{Type: "input_text", Text: prompt},
					{Type: "input_image", ImageUrl: media.URL},
				},
			},
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal media payload: %w", err)
	}

	url := "https://api.openai.com/v1/responses"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+sdk.ApiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("OpenAI API Error (%d): %s", resp.StatusCode, string(body))
	}

	type RespContent struct {
		Type string `json:"type"`
		Text string `json:"text"`
	}

	type RespOutputItem struct {
		Type    string        `json:"type"`
		Content []RespContent `json:"content"`
	}

	type OpenAIResponse struct {
		Output []RespOutputItem `json:"output"`
	}

	var result OpenAIResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	for _, item := range result.Output {
		if item.Type == "message" {
			for _, content := range item.Content {
				if content.Type == "output_text" && content.Text != "" {
					return content.Text, nil
				}
			}
		}
	}

	return "", fmt.Errorf("no output text found in response")
}
