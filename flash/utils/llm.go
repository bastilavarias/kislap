package utils

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
)

func ParseLLMJSON[T any](raw string) (*T, error) {
	var target T

	clean := strings.TrimSpace(raw)
	clean = strings.TrimPrefix(clean, "```json")
	clean = strings.TrimPrefix(clean, "```")
	clean = strings.TrimSuffix(clean, "```")
	clean = strings.TrimSpace(clean)
	clean = strings.ReplaceAll(clean, "`", "")

	re := regexp.MustCompile(`\{.*\}`)
	match := re.FindString(clean)
	if match != "" {
		clean = match
	}

	if err := json.Unmarshal([]byte(clean), &target); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}

	return &target, nil
}
