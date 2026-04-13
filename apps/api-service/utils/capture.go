package utils

import (
	"context"
	"fmt"
	"net/url"
	"os"
	"time"

	"github.com/chromedp/chromedp"
)

func CaptureBrowser(url string) ([]byte, error) {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.WindowSize(1200, 630),
		chromedp.NoSandbox,
	)

	if chromeBin := os.Getenv("CHROME_BIN"); chromeBin != "" {
		opts = append(opts, chromedp.ExecPath(chromeBin))
	}

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

func CaptureHTML(content string, width, height int, selector string) ([]byte, error) {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.WindowSize(width, height),
		chromedp.NoSandbox,
	)

	if chromeBin := os.Getenv("CHROME_BIN"); chromeBin != "" {
		opts = append(opts, chromedp.ExecPath(chromeBin))
	}

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	taskCtx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	taskCtx, cancel = context.WithTimeout(taskCtx, 20*time.Second)
	defer cancel()

	var buf []byte
	dataURL := "data:text/html;charset=utf-8," + url.PathEscape(content)
	err := chromedp.Run(taskCtx,
		chromedp.EmulateViewport(int64(width), int64(height)),
		chromedp.Navigate(dataURL),
		chromedp.WaitVisible(selector, chromedp.ByQuery),
		chromedp.ActionFunc(func(ctx context.Context) error {
			waitScript := `
				new Promise((resolve) => {
					const done = () => {
						const images = Array.from(document.images || []);
						const imagesReady = images.every((img) => img.complete && img.naturalWidth > 0);
						if (document.fonts && document.fonts.status !== "loaded") {
							document.fonts.ready.then(() => setTimeout(done, 150));
							return;
						}
						if (!imagesReady) {
							setTimeout(done, 150);
							return;
						}
						setTimeout(resolve, 250);
					};
					done();
				});
			`
			var ignored any
			return chromedp.Evaluate(waitScript, &ignored).Do(ctx)
		}),
		chromedp.CaptureScreenshot(&buf),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to capture html screenshot: %w", err)
	}

	return buf, nil
}
