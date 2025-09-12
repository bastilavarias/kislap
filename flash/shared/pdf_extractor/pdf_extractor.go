package pdfExtractor

import (
	"bytes"
	"fmt"

	"github.com/ledongthuc/pdf"
)

type PDFExtractor struct{}

func Default() *PDFExtractor {
	return &PDFExtractor{}
}

func (pdfExtractor *PDFExtractor) Close() {}

func (pdfExtractor *PDFExtractor) Extract(path string) (string, error) {
	f, r, err := pdf.Open(path)

	if err != nil {
		return "", fmt.Errorf("failed to open pdf: %w", err)
	}
	defer f.Close()

	var buf bytes.Buffer
	totalPage := r.NumPage()

	for pageIndex := 1; pageIndex <= totalPage; pageIndex++ {
		page := r.Page(pageIndex)
		if page.V.IsNull() {
			continue
		}
		content, err := page.GetPlainText(nil)
		if err != nil {
			return "", fmt.Errorf("failed to extract text from page %d: %w", pageIndex, err)
		}
		buf.WriteString(content)
	}

	return buf.String(), nil
}
