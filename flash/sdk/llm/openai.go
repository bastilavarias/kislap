package llm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type OpenAI struct {
	ApiKey string
	Model  string
}

type openAIRequest struct {
	Model    string `json:"model"`
	Prompt   string `json:"prompt"`
	MaxTokens int    `json:"max_tokens"`
}

type openAIResponse struct {
	Choices []struct {
		Text string `json:"text"`
	} `json:"choices"`
}

func (openAI *OpenAI) Generate(prompt string) (string, error) {
	reqBody := openAIRequest{
		Model:    openAI.Model,
		Prompt:   prompt,
		MaxTokens: 150,
	}

	data, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	request, err := http.NewRequest("POST", "https://api.openai.com/v1/completions", bytes.NewBuffer(data))
	if err != nil {
		return "", err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", openAI.ApiKey))

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("OpenAI API error: %s", body)
	}

	var res openAIResponse
	if err := json.Unmarshal(body, &res); err != nil {
		return "", err
	}

	if len(res.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	return res.Choices[0].Text, nil
}
