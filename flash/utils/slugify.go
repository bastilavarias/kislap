package utils

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"unicode"

	"golang.org/x/text/unicode/norm"
)

func Slugify(s string, maxLen int) string {
	if s == "" {
		return ""
	}

	t := norm.NFKD.String(s)
	var b bytes.Buffer
	prevHyphen := false

	for _, r := range t {
		if unicode.Is(unicode.Mn, r) {
			continue
		}

		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			b.WriteRune(unicode.ToLower(r))
			prevHyphen = false
			continue
		}

		if r == ' ' || r == '\t' || r == '\n' || r == '\r' || r == '-' || r == '_' || r == '/' || r == '\\' || r == ',' || r == '.' || r == ':' || r == ';' || r == '+' {
			if !prevHyphen && b.Len() > 0 {
				b.WriteRune('-')
				prevHyphen = true
			}
			continue
		}
	}

	slug := b.String()
	slug = strings.Trim(slug, "-")

	for strings.Contains(slug, "--") {
		slug = strings.ReplaceAll(slug, "--", "-")
	}

	if maxLen > 0 && len(slug) > maxLen {
		cut := slug[:maxLen]
		if i := strings.LastIndex(cut, "-"); i > 0 {
			slug = cut[:i]
		} else {
			slug = cut
		}

		slug = strings.Trim(slug, "-")
	}

	return slug
}

func GetLocalPath(filename string) string {
	wd, _ := os.Getwd()

	return filepath.Join(wd, filename)
}
