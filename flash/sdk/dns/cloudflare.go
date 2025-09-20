package dns

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type Cloudflare struct {
	APIToken string
	ZoneID   string
}

func SetCloudflareAsDNS(token string) *Cloudflare {
	return &Cloudflare{
		APIToken: token,
		ZoneID:   "",
	}
}

func (cloudflare *Cloudflare) Insert(subdomain, target string) error {
	url := fmt.Sprintf("https://api.cloudflare.com/client/v4/zones/%s/dns_records", cloudflare.ZoneID)
	body := fmt.Sprintf(`{"type":"A","name":"%s","content":"%s","ttl":120,"proxied":false}`, subdomain, target)

	req, err := http.NewRequest("POST", url, strings.NewReader(body))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+cloudflare.APIToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	data, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode != 200 && resp.StatusCode != 201 {
		return fmt.Errorf("cloudflare error: %s", data)
	}

	return nil
}
