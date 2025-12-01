package dns

import (
	"context"
	"fmt"

	"github.com/cloudflare/cloudflare-go"
)

type Provider interface {
	CheckAvailable(sub string) (bool, error)
	Insert(sub string) error
	Delete(sub string) error
}

type CloudflareService struct {
	API     *cloudflare.API
	ZoneID  string
	RootDOM string
}

func NewCloudflareService(apiKey, email, zoneID, rootDomain string) (*CloudflareService, error) {
	api, err := cloudflare.New(apiKey, email)
	if err != nil {
		return nil, err
	}

	return &CloudflareService{
		API:     api,
		ZoneID:  zoneID,
		RootDOM: rootDomain,
	}, nil
}

func (cf *CloudflareService) full(sub string) string {
	return fmt.Sprintf("%s.%s", sub, cf.RootDOM)
}

func (cf *CloudflareService) CheckAvailable(sub string) (bool, error) {
	ctx := context.Background()
	domain := cf.full(sub)

	records, err := cf.API.DNSRecords(ctx, cf.ZoneID, cloudflare.DNSRecord{
		Name: domain,
	})
	if err != nil {
		return false, err
	}

	// If record exists -> not available
	return len(records) == 0, nil
}

func (cf *CloudflareService) Insert(sub string) error {
	ctx := context.Background()

	record := cloudflare.DNSRecord{
		Type:    "A",
		Name:    cf.full(sub),
		Content: "YOUR_SERVER_IP", // change this
		TTL:     120,
	}

	_, err := cf.API.CreateDNSRecord(ctx, cf.ZoneID, record)
	return err
}

func (cf *CloudflareService) Delete(sub string) error {
	ctx := context.Background()

	records, err := cf.API.DNSRecords(ctx, cf.ZoneID, cloudflare.DNSRecord{
		Name: cf.full(sub),
	})
	if err != nil {
		return err
	}

	for _, r := range records {
		if err := cf.API.DeleteDNSRecord(ctx, cf.ZoneID, r.ID); err != nil {
			return err
		}
	}

	return nil
}
