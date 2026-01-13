package objectStorage

import (
	"io"
	"time"
)

type Provider interface {
	// Upload streams a file to the storage provider.
	// path: The destination key (R2) or public ID (Cloudinary).
	// content: The data stream to upload.
	// contentType: The MIME type of the file (e.g., "image/png").
	// Returns the public/accessible URL of the uploaded file or an error.
	Upload(path string, content io.Reader, contentType string) (string, error)

	// Delete removes a file from the storage provider.
	// path: The key or public ID of the file to delete.
	Delete(path string) (string, error)

	// GetURL generates a public URL for the given path.
	// For R2, this might be a custom domain URL.
	// For Cloudinary, this is the standard asset URL.
	GetURL(path string) (string, error)

	// GetSignedURL generates a temporary, time-limited URL for private access.
	// This is critical for R2 if your bucket is private.
	// For Cloudinary, this generates a signed delivery URL.
	GetSignedURL(path string, expiry time.Duration) (string, error)
}
