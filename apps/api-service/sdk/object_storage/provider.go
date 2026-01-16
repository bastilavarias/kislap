package objectStorage

import (
	"io"
	"time"
)

type Provider interface {
	Upload(path string, content io.Reader, contentType string) (string, error)

	Delete(path string) (string, error)

	GetURL(path string) (string, error)

	GetSignedURL(path string, expiry time.Duration) (string, error)
}
