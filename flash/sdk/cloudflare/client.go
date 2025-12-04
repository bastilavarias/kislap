package cloudflare

import (
	"context"
	"fmt"

	"github.com/cloudflare/cloudflare-go"
)

type Client struct {
	API    *cloudflare.API
	ZoneID string
	Domain string // The root domain (e.g., "myapp.com")
}

// NewClient initializes the Cloudflare connection using passed credentials
func NewClient(apiToken, zoneID, domain string) (*Client, error) {
	if apiToken == "" || zoneID == "" || domain == "" {
		return nil, fmt.Errorf("missing required Cloudflare credentials")
	}

	api, err := cloudflare.NewWithAPIToken(apiToken)
	if err != nil {
		return nil, err
	}

	return &Client{
		API:    api,
		ZoneID: zoneID,
		Domain: domain,
	}, nil
}

// CheckAvailable returns true if the subdomain is NOT taken in Cloudflare
func (client *Client) CheckAvailable(subdomain string) (bool, error) {
	context := context.Background()
	// Construct full hostname: sub.myapp.com
	name := fmt.Sprintf("%s.%s", subdomain, client.Domain)

	records, _, err := client.API.ListDNSRecords(context, cloudflare.ZoneIdentifier(client.ZoneID), cloudflare.ListDNSRecordsParams{
		Name: name,
	})
	if err != nil {
		return false, err
	}

	// If 0 records found, it is available
	return len(records) == 0, nil
}

func (client *Client) CreateRecord(subdomain string) error {
	ctx := context.Background()
	name := fmt.Sprintf("%s.%s", subdomain, client.Domain)

	_, err := client.API.CreateDNSRecord(ctx, cloudflare.ZoneIdentifier(client.ZoneID), cloudflare.CreateDNSRecordParams{
		Type:    "CNAME",
		Name:    name,
		Content: client.Domain,
		TTL:     1,
		Proxied: cloudflare.BoolPtr(true),
	})

	return err
}

func (client *Client) DeleteRecord(subdomain string) error {
	ctx := context.Background()
	name := fmt.Sprintf("%s.%s", subdomain, client.Domain)

	records, _, err := client.API.ListDNSRecords(ctx, cloudflare.ZoneIdentifier(client.ZoneID), cloudflare.ListDNSRecordsParams{
		Name: name,
	})
	if err != nil {
		return err
	}

	if len(records) == 0 {
		return nil
	}

	return client.API.DeleteDNSRecord(ctx, cloudflare.ZoneIdentifier(client.ZoneID), records[0].ID)
}
