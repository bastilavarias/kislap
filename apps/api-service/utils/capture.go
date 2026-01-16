package utils

import (
	"context"
	"fmt"
	"time"

	"github.com/chromedp/chromedp"
)

func CaptureBrowser(url string) ([]byte, error) {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.WindowSize(1200, 630),
		chromedp.NoSandbox,
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	taskCtx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	var buf []byte
	err := chromedp.Run(taskCtx,
		chromedp.EmulateViewport(1200, 630), // OG Image ratio
		chromedp.Navigate(url),
		chromedp.Sleep(2*time.Second),
		chromedp.CaptureScreenshot(&buf),
	)

	if err != nil {
		return nil, fmt.Errorf("failed to capture screenshot: %w", err)
	}

	return buf, nil
}
