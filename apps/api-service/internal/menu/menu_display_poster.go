package menu

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"html"
	"image/color"
	"io"
	"net/http"
	"strings"
	"time"

	"flash/models"
	"flash/utils"

	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

type posterPalette struct {
	Background string
	Foreground string
	Accent     string
	Highlight  string
	Muted      string
	Card       string
	Surface    string
}

type posterSizeSpec struct {
	Label  string
	Width  int
	Height int
}

var posterSizes = map[string]posterSizeSpec{
	"a4": {Label: "A4", Width: 1240, Height: 1754},
	"a5": {Label: "A5", Width: 874, Height: 1240},
	"a6": {Label: "A6", Width: 620, Height: 874},
}

func (s *Service) GenerateDisplayPoster(request GenerateDisplayPosterRequest) (*GenerateDisplayPosterResponse, error) {
	settings := normalizeDisplayPosterSettings(request.DisplayPosterSettings)
	size := posterSizes[settings.Size]
	if size.Width == 0 || size.Height == 0 {
		size = posterSizes["a4"]
		settings.Size = "a4"
	}

	qrPNG, err := generatePosterQRCode(request.MenuURL, request.QRSettings)
	if err != nil {
		return nil, fmt.Errorf("failed to generate QR code: %w", err)
	}

	logoDataURL, _ := fetchRemoteImageAsDataURL(request.LogoURL)
	coverDataURL, _ := fetchRemoteImageAsDataURL(request.CoverImageURL)

	palette := buildPosterPalette(request.Theme, settings.ColorMode)
	htmlDoc := renderPosterHTML(request, settings, size, palette, qrPNG, logoDataURL, coverDataURL)
	pngBytes, err := utils.CaptureHTML(htmlDoc, size.Width, size.Height, "#poster-root")
	if err != nil {
		return nil, fmt.Errorf("failed to render display poster png: %w", err)
	}

	imageURL, err := s.ObjectStorage.Upload(
		fmt.Sprintf("projects/%d/menu/posters/%d_%s_%s.png", request.ProjectID, time.Now().UnixNano(), settings.Template, settings.Size),
		bytes.NewReader(pngBytes),
		"image/png",
	)
	if err != nil {
		return nil, fmt.Errorf("failed to upload display poster: %w", err)
	}

	if err := s.persistDisplayPoster(request, settings, imageURL); err != nil {
		return nil, err
	}

	return &GenerateDisplayPosterResponse{
		ImageURL: imageURL,
		Settings: settings,
	}, nil
}

func (s *Service) persistDisplayPoster(
	request GenerateDisplayPosterRequest,
	settings DisplayPosterSettingsRequest,
	imageURL string,
) error {
	var menu models.Menu

	query := s.DB.Model(&models.Menu{})
	switch {
	case request.MenuID != nil:
		query = query.Where("id = ?", *request.MenuID)
	default:
		query = query.Where("project_id = ?", request.ProjectID)
	}

	if err := query.First(&menu).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil
		}
		return fmt.Errorf("failed to load menu for poster update: %w", err)
	}

	raw := marshalJSON(&settings)
	menu.DisplayPosterSettings = raw
	menu.DisplayPosterImageURL = &imageURL

	if err := s.DB.Save(&menu).Error; err != nil {
		return fmt.Errorf("failed to save display poster metadata: %w", err)
	}

	return nil
}

func normalizeDisplayPosterSettings(settings DisplayPosterSettingsRequest) DisplayPosterSettingsRequest {
	if settings.Template == "" {
		settings.Template = "clean"
	}
	if settings.Size == "" {
		settings.Size = "a4"
	}
	if settings.ColorMode == "" {
		settings.ColorMode = "light"
	}
	if settings.Headline == "" {
		settings.Headline = "Scan to view our menu"
	}
	if settings.Subtext == "" {
		settings.Subtext = "Browse the latest dishes, drinks, and prices on your phone."
	}
	if settings.FooterNote == "" {
		settings.FooterNote = "Updated live for dine-in and takeaway."
	}

	return settings
}

func renderPosterHTML(
	request GenerateDisplayPosterRequest,
	settings DisplayPosterSettingsRequest,
	size posterSizeSpec,
	palette posterPalette,
	qrPNG []byte,
	logoDataURL, coverDataURL string,
) string {
	qrDataURL := "data:image/png;base64," + base64.StdEncoding.EncodeToString(qrPNG)

	switch strings.TrimSpace(settings.Template) {
	case "", "clean":
		return renderCleanPosterHTML(request, settings, size, palette, qrDataURL, logoDataURL, coverDataURL)
	default:
		return renderCleanPosterHTML(request, settings, size, palette, qrDataURL, logoDataURL, coverDataURL)
	}
}

func renderCleanPosterHTML(
	request GenerateDisplayPosterRequest,
	settings DisplayPosterSettingsRequest,
	size posterSizeSpec,
	palette posterPalette,
	qrDataURL, logoDataURL, coverDataURL string,
) string {
	_ = request
	_ = settings
	_ = palette
	_ = logoDataURL

	coverMarkup := ""
	if coverDataURL != "" {
		coverMarkup = fmt.Sprintf(`<div class="cover-wrap"><div class="cover-photo"><img src="%s" alt="Cover photo" /></div></div>`, html.EscapeString(coverDataURL))
	}

	template := `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Display Poster</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: {{WIDTH}}px;
      height: {{HEIGHT}}px;
      overflow: hidden;
      font-family: Arial, Helvetica, sans-serif;
      background: #b3142b;
      color: #ffffff;
    }
    #poster-root {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: #b3142b;
    }
    .poster-shell {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .poster {
      position: relative;
      width: 100%;
      height: 100%;
      background: #b3142b;
      overflow: hidden;
    }
    .poster::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 58%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 20%, rgba(255,255,255,0.00) 42%),
        radial-gradient(circle at 50% 58%, rgba(255,177,177,0.10) 0%, rgba(255,177,177,0.00) 52%);
      z-index: 0;
      pointer-events: none;
    }
    .poster::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(rgba(255,255,255,0.05) 0.6px, transparent 0.6px),
        radial-gradient(rgba(0,0,0,0.035) 0.6px, transparent 0.6px);
      background-position: 0 0, 1.5px 1.5px;
      background-size: 3px 3px;
      opacity: 0.18;
      mix-blend-mode: soft-light;
      z-index: 1;
      pointer-events: none;
    }
    .cover-wrap {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: {{COVER_HEIGHT}}px;
      z-index: 0;
      overflow: hidden;
    }
    .cover-photo {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .cover-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: saturate(0.88) contrast(0.9) brightness(0.82);
      transform: scale(1.04);
    }
    .cover-wrap::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(17, 10, 10, 0.42) 0%, rgba(17, 10, 10, 0.18) 24%, rgba(179, 20, 43, 0.18) 44%, rgba(179, 20, 43, 0.84) 82%, #b3142b 100%),
        linear-gradient(180deg, rgba(179, 20, 43, 0.12), rgba(179, 20, 43, 0.45)),
        linear-gradient(90deg, rgba(179, 20, 43, 0.18), rgba(179, 20, 43, 0.02) 18%, rgba(179, 20, 43, 0.02) 82%, rgba(179, 20, 43, 0.18));
      z-index: 1;
    }
    .cover-wrap::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 38%;
      background: linear-gradient(180deg, rgba(179, 20, 43, 0) 0%, rgba(179, 20, 43, 0.7) 58%, #b3142b 100%);
      z-index: 2;
    }
    .cover-vignette {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 8%, rgba(0,0,0,0.10), rgba(0,0,0,0) 38%),
        linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.02) 16%, rgba(0,0,0,0.02) 84%, rgba(0,0,0,0.18) 100%);
      z-index: 2;
      pointer-events: none;
    }
    .title {
      position: absolute;
      left: 50%;
      top: 4.4%;
      transform: translateX(-50%);
      font-size: {{TITLE_SIZE}}px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.045em;
      color: #ffffff;
      text-shadow:
        0 {{TITLE_SHADOW_Y}}px {{TITLE_SHADOW_BLUR}}px rgba(0,0,0,0.42),
        0 0 {{TITLE_GLOW}}px rgba(0,0,0,0.20);
      z-index: 3;
    }
    .pill {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      background: #ffffff;
      color: #c12033;
      border: {{PILL_BORDER}}px solid #ead9d9;
      border-radius: {{PILL_RADIUS}}px;
      box-shadow: 0 {{PILL_SHADOW_Y}}px {{PILL_SHADOW_BLUR}}px rgba(0,0,0,0.16);
      font-weight: 800;
      line-height: 1;
      z-index: 3;
    }
    .pill-top {
      top: 21.2%;
      width: 64%;
      height: 7.9%;
      font-size: {{PILL_TOP_SIZE}}px;
    }
    .pill-bottom {
      top: 30.0%;
      width: 44%;
      height: 7.6%;
      font-size: {{PILL_BOTTOM_SIZE}}px;
    }
    .qr-brackets {
      position: absolute;
      left: 50%;
      top: 39.6%;
      width: 75%;
      height: 45.8%;
      transform: translateX(-50%);
      pointer-events: none;
    }
    .qr-brackets::before,
    .qr-brackets::after,
    .qr-bracket-bottom-left,
    .qr-bracket-bottom-right {
      content: "";
      position: absolute;
      width: 29%;
      height: 22%;
      border-color: #ffffff;
      border-style: solid;
      border-width: {{BRACKET_STROKE}}px;
      border-radius: {{BRACKET_RADIUS}}px;
    }
    .qr-brackets::before {
      right: 0;
      top: 0;
      border-left: 0;
      border-bottom: 0;
    }
    .qr-brackets::after {
      left: 0;
      bottom: 0;
      border-right: 0;
      border-top: 0;
    }
    .qr-arrow {
      position: absolute;
      left: 17.4%;
      top: 33.6%;
      width: 14%;
      height: 11%;
      overflow: visible;
      pointer-events: none;
      z-index: 3;
      filter: drop-shadow(0 3px 8px rgba(0,0,0,0.18));
    }
    .qr-card {
      position: absolute;
      left: 50%;
      top: 43.2%;
      transform: translateX(-50%);
      width: 54.8%;
      aspect-ratio: 1 / 1;
      background: #ffffff;
      border: {{QR_FRAME}}px solid #efefef;
      box-shadow:
        0 {{QR_SHADOW_Y}}px {{QR_SHADOW_BLUR}}px rgba(0,0,0,0.16),
        0 0 {{QR_GLOW}}px rgba(255,255,255,0.18),
        0 0 {{QR_GLOW_WARM}}px rgba(255,176,176,0.12);
      padding: {{QR_PAD}}px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
    }
    .qr-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .footer-accent {
      position: absolute;
      left: 50%;
      bottom: 12.4%;
      transform: translateX(-50%);
      width: 18%;
      height: {{FOOTER_LINE}}px;
      border-radius: 999px;
      background: rgba(255,255,255,0.65);
      box-shadow: 0 0 10px rgba(255,255,255,0.08);
      z-index: 3;
    }
    .brand {
      position: absolute;
      left: 50%;
      bottom: 6.0%;
      transform: translateX(-50%);
      font-size: {{BRAND_SIZE}}px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.03em;
      color: #ffffff;
      z-index: 3;
    }
  </style>
</head>
<body>
  <div id="poster-root">
    <div class="poster-shell">
      <div class="poster">
        {{COVER}}
        <div class="cover-vignette"></div>
        <div class="title">MENÜ</div>
        <div class="pill pill-top">Menüyü görmek için</div>
        <div class="pill pill-bottom">kodu okutun</div>
        <svg class="qr-arrow" viewBox="0 0 100 100" aria-hidden="true">
          <path
            d="M72 10 C46 18, 33 39, 35 62"
            fill="none"
            stroke="#ffffff"
            stroke-width="{{ARROW_STROKE}}"
            stroke-linecap="round"
          />
          <path
            d="M24 52 L35 66 L49 54"
            fill="none"
            stroke="#ffffff"
            stroke-width="{{ARROW_STROKE}}"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="qr-brackets"></div>
        <div class="qr-card">
          <img src="{{QR_URL}}" alt="QR code" />
        </div>
        <div class="footer-accent"></div>
        <div class="brand">OBLOMOV</div>
      </div>
    </div>
  </div>
</body>
</html>`

	replacements := []string{
		"{{WIDTH}}", fmt.Sprintf("%d", size.Width),
		"{{HEIGHT}}", fmt.Sprintf("%d", size.Height),
		"{{COVER_HEIGHT}}", fmt.Sprintf("%d", chooseFontSize(size, 560, 394, 278)),
		"{{TITLE_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 126, 88, 60)),
		"{{TITLE_SHADOW_Y}}", fmt.Sprintf("%d", chooseFontSize(size, 4, 3, 2)),
		"{{TITLE_SHADOW_BLUR}}", fmt.Sprintf("%d", chooseFontSize(size, 10, 7, 5)),
		"{{TITLE_GLOW}}", fmt.Sprintf("%d", chooseFontSize(size, 20, 14, 9)),
		"{{PILL_BORDER}}", fmt.Sprintf("%d", chooseFontSize(size, 3, 2, 2)),
		"{{PILL_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 3, 3, 2)),
		"{{PILL_SHADOW_Y}}", fmt.Sprintf("%d", chooseFontSize(size, 4, 3, 2)),
		"{{PILL_SHADOW_BLUR}}", fmt.Sprintf("%d", chooseFontSize(size, 8, 6, 4)),
		"{{PILL_TOP_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 40, 28, 19)),
		"{{PILL_BOTTOM_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 35, 24, 17)),
		"{{BRACKET_STROKE}}", fmt.Sprintf("%d", chooseFontSize(size, 9, 6, 4)),
		"{{BRACKET_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 4, 3, 2)),
		"{{ARROW_STROKE}}", fmt.Sprintf("%d", chooseFontSize(size, 8, 6, 4)),
		"{{QR_FRAME}}", fmt.Sprintf("%d", chooseFontSize(size, 7, 5, 4)),
		"{{QR_SHADOW_Y}}", fmt.Sprintf("%d", chooseFontSize(size, 8, 5, 4)),
		"{{QR_SHADOW_BLUR}}", fmt.Sprintf("%d", chooseFontSize(size, 18, 12, 8)),
		"{{QR_GLOW}}", fmt.Sprintf("%d", chooseFontSize(size, 32, 22, 14)),
		"{{QR_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 2, 2, 1)),
		"{{QR_GLOW_WARM}}", fmt.Sprintf("%d", chooseFontSize(size, 52, 34, 22)),
		"{{FOOTER_LINE}}", fmt.Sprintf("%d", chooseFontSize(size, 5, 4, 3)),
		"{{BRAND_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 58, 40, 28)),
		"{{COVER}}", coverMarkup,
		"{{QR_URL}}", html.EscapeString(qrDataURL),
	}

	return strings.NewReplacer(replacements...).Replace(template)
}

func buildPosterPalette(theme *ThemeRequest, colorMode string) posterPalette {
	fallback := posterPalette{
		Background: "#fff9f4",
		Foreground: "#111111",
		Accent:     "#d63a32",
		Highlight:  "#eb8b1c",
		Muted:      "#5f5b57",
		Card:       "#ffffff",
		Surface:    "#f1ece6",
	}
	if theme == nil || len(theme.Styles) == 0 {
		return fallback
	}

	mode := "light"
	if strings.EqualFold(colorMode, "dark") {
		mode = "dark"
	}

	styles, ok := theme.Styles[mode]
	if !ok && mode == "dark" {
		styles, ok = theme.Styles["light"]
	}
	if !ok && mode == "light" {
		styles, ok = theme.Styles["dark"]
	}
	if !ok {
		return fallback
	}

	primary := firstNonEmpty(styles["primary"], styles["accent"], fallback.Accent)
	secondary := firstNonEmpty(styles["secondary"], styles["accent"], fallback.Highlight)

	background := "#f5f0ea"
	foreground := "#1f1b1a"
	muted := "#6c625c"
	card := "#ffffff"
	surface := "#ebe6e0"

	if strings.EqualFold(mode, "dark") {
		background = "#161515"
		foreground = "#f5f2ee"
		muted = "#bdb5ae"
		card = "#ffffff"
		surface = "#2b2929"
	}

	return posterPalette{
		Background: background,
		Foreground: foreground,
		Accent:     primary,
		Highlight:  secondary,
		Muted:      muted,
		Card:       card,
		Surface:    surface,
	}
}

func themeFontValue(theme *ThemeRequest, colorMode, key string) string {
	if theme == nil || len(theme.Styles) == 0 {
		return ""
	}

	mode := "light"
	if strings.EqualFold(colorMode, "dark") {
		mode = "dark"
	}

	styles, ok := theme.Styles[mode]
	if !ok && mode == "dark" {
		styles, ok = theme.Styles["light"]
	}
	if !ok && mode == "light" {
		styles, ok = theme.Styles["dark"]
	}
	if !ok {
		return ""
	}

	return strings.TrimSpace(styles[key])
}

func posterThemeFont(value, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}

	return value
}

func generatePosterQRCode(menuURL string, settings *QRSettingsRequest) ([]byte, error) {
	code, err := qrcode.New(menuURL, qrcode.Medium)
	if err != nil {
		return nil, err
	}

	code.BackgroundColor = parsePosterHexColor(qrBackgroundColor(settings), color.White)
	code.ForegroundColor = parsePosterHexColor(qrForegroundColor(settings), color.Black)
	code.DisableBorder = true

	return code.PNG(400)
}

func qrForegroundColor(settings *QRSettingsRequest) string {
	if settings == nil {
		return ""
	}

	return strings.TrimSpace(settings.ForegroundColor)
}

func qrBackgroundColor(settings *QRSettingsRequest) string {
	if settings == nil {
		return ""
	}

	return strings.TrimSpace(settings.BackgroundColor)
}

func parsePosterHexColor(value string, fallback color.Color) color.Color {
	value = strings.TrimSpace(strings.TrimPrefix(value, "#"))
	if len(value) == 3 {
		value = fmt.Sprintf("%c%c%c%c%c%c", value[0], value[0], value[1], value[1], value[2], value[2])
	}
	if len(value) != 6 {
		return fallback
	}

	var r, g, b uint8
	if _, err := fmt.Sscanf(value, "%02x%02x%02x", &r, &g, &b); err != nil {
		return fallback
	}

	return color.RGBA{R: r, G: g, B: b, A: 255}
}

func resolvePosterGalleryImages(coverDataURL string, gallery []string) []string {
	images := make([]string, 0, 8)

	appendImage := func(value string) {
		value = strings.TrimSpace(value)
		if value == "" {
			return
		}
		for _, existing := range images {
			if existing == value {
				return
			}
		}
		images = append(images, value)
	}

	appendImage(coverDataURL)

	for _, raw := range gallery {
		if len(images) >= 8 {
			break
		}
		dataURL, err := fetchRemoteImageAsDataURL(&raw)
		if err != nil {
			continue
		}
		appendImage(dataURL)
	}

	return images
}

func buildPosterGalleryMarkup(images []string) string {
	if len(images) == 0 {
		return `<div class="food-box"><div class="ref-food-fallback"></div></div>`
	}

	var builder strings.Builder
	for _, image := range images {
		builder.WriteString(`<div class="food-box">`)
		builder.WriteString(fmt.Sprintf(`<img src="%s" alt="Gallery image" class="ref-food-image" />`, html.EscapeString(image)))
		builder.WriteString(`</div>`)
	}

	return builder.String()
}

func posterGalleryColumns(count int) string {
	switch {
	case count <= 1:
		return "1"
	case count <= 2:
		return "1"
	default:
		return "2"
	}
}

func posterGalleryRowHeight(count int) string {
	switch {
	case count <= 1:
		return "188"
	case count <= 2:
		return "136"
	case count <= 4:
		return "118"
	case count <= 6:
		return "92"
	default:
		return "78"
	}
}

func fetchRemoteImageAsDataURL(rawURL *string) (string, error) {
	if rawURL == nil || strings.TrimSpace(*rawURL) == "" {
		return "", nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimSpace(*rawURL), nil)
	if err != nil {
		return "", err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("unexpected image status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, 4<<20))
	if err != nil {
		return "", err
	}

	contentType := resp.Header.Get("Content-Type")
	if strings.TrimSpace(contentType) == "" {
		contentType = "image/png"
	}

	return "data:" + contentType + ";base64," + base64.StdEncoding.EncodeToString(body), nil
}

func composePosterAddress(address, city *string) string {
	parts := make([]string, 0, 2)
	if address != nil && strings.TrimSpace(*address) != "" {
		parts = append(parts, strings.TrimSpace(*address))
	}
	if city != nil && strings.TrimSpace(*city) != "" {
		parts = append(parts, strings.TrimSpace(*city))
	}
	return strings.Join(parts, ", ")
}

func chooseFontSize(size posterSizeSpec, a4, a5, a6 int) int {
	switch size.Label {
	case "A5":
		return a5
	case "A6":
		return a6
	default:
		return a4
	}
}

func formatPosterHTMLLines(value string, limit int, maxLines int, uppercase bool) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return ""
	}

	if uppercase {
		trimmed = strings.ToUpper(trimmed)
	}

	lines := wrapText(trimmed, limit)
	if len(lines) == 0 {
		return ""
	}

	if maxLines > 0 && len(lines) > maxLines {
		lines = lines[:maxLines]
		last := strings.TrimSpace(lines[len(lines)-1])
		last = strings.TrimRight(last, ".,;:!? ")
		lines[len(lines)-1] = last + "..."
	}

	escaped := make([]string, len(lines))
	for i, line := range lines {
		escaped[i] = html.EscapeString(line)
	}

	return strings.Join(escaped, "<br />")
}

func posterDisplayURL(websiteURL *string, menuURL string) string {
	candidates := []string{strings.TrimSpace(menuURL)}
	if websiteURL != nil {
		candidates = append([]string{strings.TrimSpace(*websiteURL)}, candidates...)
	}

	for _, raw := range candidates {
		if raw == "" {
			continue
		}

		display := strings.TrimSpace(raw)
		display = strings.TrimPrefix(display, "https://")
		display = strings.TrimPrefix(display, "http://")
		display = strings.TrimSuffix(display, "/")
		if display != "" {
			return display
		}
	}

	return ""
}

func buildPosterContactGroupHTML(phone, websiteURL *string, menuURL string) string {
	items := make([]string, 0, 3)

	if phone != nil && strings.TrimSpace(*phone) != "" {
		items = append(items, fmt.Sprintf(
			`<div class="contact-item"><span class="contact-dot"></span>%s</div>`,
			html.EscapeString(strings.TrimSpace(*phone)),
		))
	}

	displayURL := posterDisplayURL(websiteURL, menuURL)
	if displayURL != "" {
		items = append(items, fmt.Sprintf(
			`<div class="contact-item"><span class="contact-dot"></span>%s</div>`,
			html.EscapeString(displayURL),
		))
	}

	if len(items) == 0 {
		return ""
	}

	return `<div class="contact-group">` + strings.Join(items, "") + `</div>`
}

func headlineCharLimit(size posterSizeSpec, template string) int {
	if template == "brand" {
		switch size.Label {
		case "A5":
			return 15
		case "A6":
			return 12
		default:
			return 17
		}
	}
	switch size.Label {
	case "A5":
		return 20
	case "A6":
		return 16
	default:
		return 24
	}
}

func subtextCharLimit(size posterSizeSpec) int {
	switch size.Label {
	case "A5":
		return 28
	case "A6":
		return 22
	default:
		return 34
	}
}

func footerCharLimit(size posterSizeSpec) int {
	switch size.Label {
	case "A5":
		return 24
	case "A6":
		return 18
	default:
		return 30
	}
}

func wrapText(value string, limit int) []string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}

	words := strings.Fields(trimmed)
	if len(words) == 0 {
		return nil
	}

	lines := make([]string, 0)
	current := words[0]

	for _, word := range words[1:] {
		test := current + " " + word
		if len([]rune(test)) <= limit {
			current = test
			continue
		}

		lines = append(lines, escapeSVGText(current))
		current = word
	}

	lines = append(lines, escapeSVGText(current))
	return lines
}

func writeTextBlock(
	builder *strings.Builder,
	x, y, width int,
	lines []string,
	fontSize int,
	color string,
	lineHeight float64,
	fontWeight int,
) {
	if len(lines) == 0 {
		return
	}

	builder.WriteString(fmt.Sprintf(
		`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="%d" font-family="Inter, Arial, sans-serif">`,
		x, y, color, fontSize, fontWeight,
	))
	for index, line := range lines {
		dy := 0
		if index > 0 {
			dy = int(float64(fontSize) * lineHeight)
		}
		builder.WriteString(fmt.Sprintf(`<tspan x="%d" dy="%d">%s</tspan>`, x, dy, line))
	}
	builder.WriteString(`</text>`)
	_ = width
}

func contrastColor(background string) string {
	bg := strings.ToLower(strings.TrimSpace(background))
	if bg == "#ffffff" || bg == "#fff9f4" || bg == "#f8fafc" || bg == "#f1ece6" {
		return "#111111"
	}
	return "#ffffff"
}

func svgOpen(width, height int) string {
	return fmt.Sprintf(`<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">`, width, height, width, height)
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}

func escapeSVGText(value string) string {
	return html.EscapeString(strings.TrimSpace(value))
}
