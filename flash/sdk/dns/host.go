package dns

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

type HostProvider struct {
	operatingSystem string
	rootDomain      string
}

func SetHostAsDNS(operatingSystem, rootDomain string) *HostProvider {
	return &HostProvider{
		operatingSystem: operatingSystem,
		rootDomain:      rootDomain,
	}
}

func (hostProvider *HostProvider) Insert(subdomain string) error {
	if strings.TrimSpace(subdomain) == "" {
		return errors.New("subdomain cannot be empty")
	}

	target := "127.0.0.1"
	hostname := fmt.Sprintf("%s.%s", subdomain, hostProvider.rootDomain)

	var hostsFile string
	switch runtime.GOOS {
	case "windows":
		hostsFile = filepath.Join(os.Getenv("SystemRoot"), "System32", "drivers", "etc", "hosts")
	default:
		hostsFile = "/etc/hosts"
	}

	absPath, _ := filepath.Abs(hostsFile)
	fmt.Println("using hosts file:", absPath)

	data, err := os.ReadFile(hostsFile)
	if err != nil {
		if os.IsPermission(err) {
			return fmt.Errorf("permission denied reading hosts file %s: run as administrator / sudo", hostsFile)
		}
		if os.IsNotExist(err) {
			if f, err2 := os.OpenFile(hostsFile, os.O_CREATE, 0644); err2 != nil {
				return fmt.Errorf("cannot create hosts file %s: %w", hostsFile, err2)
			} else {
				f.Close()
				data = []byte{}
			}
		} else {
			return fmt.Errorf("error reading hosts file %s: %w", hostsFile, err)
		}
	}

	content := string(data)
	content = strings.ReplaceAll(content, "\r\n", "\n")
	lines := strings.Split(content, "\n")

	for _, l := range lines {
		trim := strings.TrimSpace(l)
		if trim == "" || strings.HasPrefix(trim, "#") {
			continue
		}
		parts := strings.Fields(trim)
		if len(parts) >= 2 && parts[1] == hostname {
			fmt.Println("entry already exists for", hostname, "->", parts[0])
			return nil // already present; do nothing
		}
	}

	f, err := os.OpenFile(hostsFile, os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		if os.IsPermission(err) {
			return fmt.Errorf("permission denied opening hosts file %s for writing: run as administrator / sudo", hostsFile)
		}
		return fmt.Errorf("unable to open hosts file %s for append: %w", hostsFile, err)
	}
	defer f.Close()

	newLine := fmt.Sprintf("%s %s\n", target, hostname)
	if _, err := f.WriteString(newLine); err != nil {
		return fmt.Errorf("failed to append to hosts file %s: %w", hostsFile, err)
	}
	if err := f.Sync(); err != nil {
		fmt.Println("warning: fsync failed:", err)
	}

	fmt.Println("Inserted:", strings.TrimSpace(newLine))
	return nil
}
