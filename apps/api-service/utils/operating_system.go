package utils

import "runtime"

func GetOperatingSystem() string {
	return runtime.GOOS
}
