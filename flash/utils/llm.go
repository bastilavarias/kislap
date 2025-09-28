package utils

import (
	"encoding/json"
	"fmt"
	"strings"
)

// ParseLLMJSON tries to handle outputs from LLMs that may be wrapped in code blocks.
func ParseLLMJSON[T any](raw string) (*T, error) {
	var target T

	clean := strings.TrimSpace(raw)

	if strings.HasPrefix(clean, "```json") {
		clean = strings.TrimPrefix(clean, "```json")
		clean = strings.TrimSuffix(clean, "```")
	} else if strings.HasPrefix(clean, "```") {
		clean = strings.TrimPrefix(clean, "```")
		clean = strings.TrimSuffix(clean, "```")
	}

	clean = strings.TrimSpace(clean)

	// Attempt to unmarshal directly
	if err := json.Unmarshal([]byte(clean), &target); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}

	return &target, nil
}