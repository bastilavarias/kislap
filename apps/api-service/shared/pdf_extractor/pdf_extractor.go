package pdfExtractor

import (
	"bytes"
	"fmt"
	"io"

	"github.com/ledongthuc/pdf"
)

type PDFExtractor struct{}

func Default() *PDFExtractor {
	return &PDFExtractor{}
}

func (pdfExtractor *PDFExtractor) Close() {}

func (pdfExtractor *PDFExtractor) ExtractFromPath(path string) (string, error) {
	f, r, err := pdf.Open(path)

	if err != nil {
		return "", fmt.Errorf("failed to open pdf: %w", err)
	}
	defer f.Close()

	return pdfExtractor.extractFromReader(r)
}

func (pdfExtractor *PDFExtractor) ExtractFromReader(reader io.Reader) (string, error) {
	buf, err := io.ReadAll(reader)
	if err != nil {
		return "", fmt.Errorf("failed to read pdf: %w", err)
	}

	readerAt := bytes.NewReader(buf)

	r, err := pdf.NewReader(readerAt, int64(len(buf)))
	if err != nil {
		return "", fmt.Errorf("failed to create pdf reader: %w", err)
	}

	return pdfExtractor.extractFromReader(r)
}

func (pdfExtractor *PDFExtractor) extractFromReader(r *pdf.Reader) (string, error) {
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
