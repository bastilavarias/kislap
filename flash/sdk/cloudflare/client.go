package cloudflare

import (
	"context"
	"fmt"

	cf "github.com/cloudflare/cloudflare-go"
)

type Client struct {
	API    *cf.API
	ZoneID string
	Domain string // Your root domain (e.g., "example.com")
}

func NewClient(apiToken, zoneID, domain string) (*Client, error) {
	// Validate inputs
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

// CheckAvailable ensures the subdomain doesn't exist as a CNAME or A record
func (c *Client) CheckAvailable(subdomain string) (bool, error) {
	ctx := context.Background()
	hostname := fmt.Sprintf("%s.%s", subdomain, c.Domain)

	records, _, err := c.API.ListDNSRecords(ctx, cf.ZoneIdentifier(c.ZoneID), cf.ListDNSRecordsParams{
		Name: hostname,
	})
	if err != nil {
		return false, err
	}

	return len(records) == 0, nil
}

// CreateRecord adds a CNAME pointing to your root domain
func (c *Client) CreateRecord(subdomain string) error {
	ctx := context.Background()
	hostname := fmt.Sprintf("%s.%s", subdomain, c.Domain)

	_, err := c.API.CreateDNSRecord(ctx, cf.ZoneIdentifier(c.ZoneID), cf.CreateDNSRecordParams{
		Type:    "CNAME",
		Name:    hostname,
		Content: c.Domain, // Point to root domain
		TTL:     1,        // Auto TTL
		Proxied: cf.BoolPtr(true),
	})

	return err
}

// DeleteRecord removes the DNS record
func (c *Client) DeleteRecord(subdomain string) error {
	ctx := context.Background()
	hostname := fmt.Sprintf("%s.%s", subdomain, c.Domain)

	// 1. Find the record ID
	records, _, err := c.API.ListDNSRecords(ctx, cf.ZoneIdentifier(c.ZoneID), cf.ListDNSRecordsParams{
		Name: hostname,
	})
	if err != nil {
		return err
	}

	if len(records) == 0 {
		return nil // Nothing to delete
	}

	// 2. Delete it
	return c.API.DeleteDNSRecord(ctx, cf.ZoneIdentifier(c.ZoneID), records[0].ID)
}
