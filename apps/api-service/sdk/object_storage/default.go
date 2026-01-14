package objectStorage

import (
	"fmt"
	"io"
)

var defaultProvider Provider

func Default(provider Provider) Provider {
	defaultProvider = provider

	return defaultProvider
}

func Upload(path string, content io.Reader, contentType string) (string, error) {
	if defaultProvider == nil {
		return "", fmt.Errorf("no Object Storage provider initialized")
	}

	return defaultProvider.Upload(path, content, contentType)
}

func Delete(path string) (string, error) {
	if defaultProvider == nil {
		return "", fmt.Errorf("no Object Storage provider initialized")
	}

	return defaultProvider.Delete(path)
}

func GetURL(path string) (string, error) {
	if defaultProvider == nil {
		return "", fmt.Errorf("no Object Storage provider initialized")
	}

	return defaultProvider.GetURL(path)
}
