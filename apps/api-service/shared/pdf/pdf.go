package pdf

import (
	"bytes"
	"fmt"
	"image/png"
	"io"

	"github.com/gen2brain/go-fitz"
)

func ExtractText(reader io.Reader) (string, error) {
	doc, err := fitz.NewFromReader(reader)
	if err != nil {
		return "", fmt.Errorf("fitz failed to open pdf for text extraction: %w", err)
	}
	defer doc.Close()

	var textBuf bytes.Buffer
	totalPage := doc.NumPage()

	for i := 0; i < totalPage; i++ {
		content, err := doc.Text(i)
		if err != nil {
			return "", fmt.Errorf("fitz failed to extract text from page %d: %w", i, err)
		}

		textBuf.WriteString(content)
		textBuf.WriteString("\n")
	}

	return textBuf.String(), nil
}

func ConvertToImage(reader io.Reader, pageNum int) (io.Reader, error) {
	doc, err := fitz.NewFromReader(reader)
	if err != nil {
		return nil, fmt.Errorf("fitz failed to read pdf: %w", err)
	}
	defer doc.Close()

	if pageNum < 0 || pageNum >= doc.NumPage() {
		return nil, fmt.Errorf("page number %d out of bounds (total: %d)", pageNum, doc.NumPage())
	}

	img, err := doc.Image(pageNum)
	if err != nil {
		return nil, fmt.Errorf("fitz failed to render image: %w", err)
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, fmt.Errorf("failed to encode png: %w", err)
	}

	return &buf, nil
}

func ValidatePageCount(reader io.Reader, min, max int) error {
	doc, err := fitz.NewFromReader(reader)
	if err != nil {
		return fmt.Errorf("failed to read pdf for validation: %w", err)
	}
	defer doc.Close()

	count := doc.NumPage()
	if count < min || count > max {
		return fmt.Errorf("page count %d is outside allowed range [%d-%d]", count, min, max)
	}
	return nil
}
