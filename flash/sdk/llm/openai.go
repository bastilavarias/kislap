package llm

import (
	"context"

	"github.com/openai/openai-go/v2"
	"github.com/openai/openai-go/v2/option"
)

type OpenAISDK struct {
	ApiKey string
	Model  string
}

func (sdk *OpenAISDK) Generate(prompt string) (string, error) {
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
