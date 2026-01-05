package utils

import (
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
)

func ValidateRequestPDF(file multipart.File, filename string, maxSize int64) error {
	if sizer, ok := file.(interface{ Size() int64 }); ok && sizer.Size() > maxSize {
		return errors.New("file too large, must be under 5MB")
	}

	if !strings.HasSuffix(strings.ToLower(filename), ".pdf") {
		return errors.New("only PDF files are allowed")
	}

	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return errors.New("failed to read file for validation")
	}
	mimeType := http.DetectContentType(buffer[:n])
	if mimeType != "application/pdf" {
		return errors.New("invalid file type, must be PDF")
	}

	if seeker, ok := file.(io.Seeker); ok {
		_, _ = seeker.Seek(0, io.SeekStart)
	}

	return nil
}
