package cloudflare

import (
	"context"
	"fmt"

	cf "github.com/cloudflare/cloudflare-go"
)

type Client struct {
	API    *cf.API
	ZoneID string
	Domain string // The root domain (e.g., "myapp.com")
}

// NewClient initializes the Cloudflare connection using passed credentials
func NewClient(apiToken, zoneID, domain string) (*Client, error) {
	if apiToken == "" || zoneID == "" || domain == "" {
		return nil, fmt.Errorf("missing required Cloudflare credentials")
	}

	api, err := cf.NewWithAPIToken(apiToken)
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
func (c *Client) CheckAvailable(subdomain string) (bool, error) {
	ctx := context.Background()
	// Construct full hostname: sub.myapp.com
	name := fmt.Sprintf("%s.%s", subdomain, c.Domain)

	records, _, err := c.API.ListDNSRecords(ctx, cf.ZoneIdentifier(c.ZoneID), cf.ListDNSRecordsParams{
		Name: name,
	})
	if err != nil {
		return false, err
	}

	// If 0 records found, it is available
	return len(records) == 0, nil
}

// CreateRecord creates a CNAME record pointing to the root domain
func (c *Client) CreateRecord(subdomain string) error {
	ctx := context.Background()
	name := fmt.Sprintf("%s.%s", subdomain, c.Domain)

	_, err := c.API.CreateDNSRecord(ctx, cf.ZoneIdentifier(c.ZoneID), cf.CreateDNSRecordParams{
		Type:    "CNAME",
		Name:    name,
		Content: c.Domain,
		TTL:     1, // Auto
		Proxied: cf.BoolPtr(true),
	})

	return err
}

// DeleteRecord removes the DNS record for a subdomain
func (c *Client) DeleteRecord(subdomain string) error {
	ctx := context.Background()
	name := fmt.Sprintf("%s.%s", subdomain, c.Domain)

	// 1. Find the record ID first
	records, _, err := c.API.ListDNSRecords(ctx, cf.ZoneIdentifier(c.ZoneID), cf.ListDNSRecordsParams{
		Name: name,
	})
	if err != nil {
		return err
	}

	if len(records) == 0 {
		return nil // Already deleted or never existed
	}

	// 2. Delete the record
	return c.API.DeleteDNSRecord(ctx, cf.ZoneIdentifier(c.ZoneID), records[0].ID)
}
