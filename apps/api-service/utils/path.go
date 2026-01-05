package utils

import (
	"os"
	"path/filepath"
)

func GetLocalPath(filename string) string {
	wd, _ := os.Getwd()

	return filepath.Join(wd, filename)
}
