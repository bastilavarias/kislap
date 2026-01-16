package objectStorage

import (
	"context"
	"fmt"
	"io"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type CloudflareR2SDK struct {
	AccountID       string
	AccessKeyID     string
	SecretAccessKey string
	BucketName      string

	BaseURL string

	once          sync.Once
	client        *s3.Client
	presignClient *s3.PresignClient
	err           error
}

func (cloudflare *CloudflareR2SDK) init() {
	cloudflare.once.Do(func() {
		if cloudflare.AccountID == "" || cloudflare.AccessKeyID == "" || cloudflare.SecretAccessKey == "" || cloudflare.BucketName == "" {
			cloudflare.err = fmt.Errorf("missing required R2 configuration (AccountID, Keys, or BucketName)")
			return
		}

		ctx := context.Background()
		r2Endpoint := fmt.Sprintf("https://%s.r2.cloudflarestorage.com", cloudflare.AccountID)

		cfg, err := config.LoadDefaultConfig(ctx,
			config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(cloudflare.AccessKeyID, cloudflare.SecretAccessKey, "")),
			config.WithRegion("auto"),
		)
		if err != nil {
			cloudflare.err = fmt.Errorf("failed to load R2 config: %w", err)
			return
		}

		cloudflare.client = s3.NewFromConfig(cfg, func(o *s3.Options) {
			o.BaseEndpoint = aws.String(r2Endpoint)
		})

		cloudflare.presignClient = s3.NewPresignClient(cloudflare.client)
	})
}

func (cloudflare *CloudflareR2SDK) Upload(path string, content io.Reader, contentType string) (string, error) {
	cloudflare.init()
	if cloudflare.err != nil {
		return "", cloudflare.err
	}

	ctx := context.Background()
	_, err := cloudflare.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(cloudflare.BucketName),
		Key:         aws.String(path),
		Body:        content,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", fmt.Errorf("R2 Upload error: %w", err)
	}

	return cloudflare.resolveURL(path), nil
}

func (cloudflare *CloudflareR2SDK) Delete(path string) (string, error) {
	cloudflare.init()
	if cloudflare.err != nil {
		return "", cloudflare.err
	}

	ctx := context.Background()
	_, err := cloudflare.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(cloudflare.BucketName),
		Key:    aws.String(path),
	})
	if err != nil {
		return "", fmt.Errorf("R2 Delete error: %w", err)
	}

	return path, nil
}

func (cloudflare *CloudflareR2SDK) GetURL(path string) (string, error) {
	// Use the private resolver
	return cloudflare.resolveURL(path), nil
}

func (cloudflare *CloudflareR2SDK) GetSignedURL(path string, expiry time.Duration) (string, error) {
	cloudflare.init()
	if cloudflare.err != nil {
		return "", cloudflare.err
	}

	ctx := context.Background()
	req, err := cloudflare.presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(cloudflare.BucketName),
		Key:    aws.String(path),
	}, func(o *s3.PresignOptions) {
		o.Expires = expiry
	})
	if err != nil {
		return "", fmt.Errorf("R2 GetSignedURL error: %w", err)
	}

	return req.URL, nil
}

func (cloudflare *CloudflareR2SDK) resolveURL(path string) string {
	if cloudflare.BaseURL != "" {
		return fmt.Sprintf("%s/%s", cloudflare.trimSlash(cloudflare.BaseURL), path)
	}

	return path
}

func (cloudflare *CloudflareR2SDK) trimSlash(s string) string {
	if len(s) > 0 && s[len(s)-1] == '/' {
		return s[:len(s)-1]
	}
	return s
}
