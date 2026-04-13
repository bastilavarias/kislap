package menu

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"html"
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

	qrPNG, err := qrcode.Encode(request.MenuURL, qrcode.Medium, 400)
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

	return renderCleanPosterHTML(request, settings, size, palette, qrDataURL, logoDataURL, coverDataURL)
}

func renderCleanPosterHTML(
	request GenerateDisplayPosterRequest,
	settings DisplayPosterSettingsRequest,
	size posterSizeSpec,
	palette posterPalette,
	qrDataURL, logoDataURL, coverDataURL string,
) string {
	fontSans := posterThemeFont(themeFontValue(request.Theme, settings.ColorMode, "font-sans"), `"Montserrat", Arial, Helvetica, sans-serif`)
	fontDisplay := posterThemeFont(themeFontValue(request.Theme, settings.ColorMode, "font-serif"), fontSans)

	businessName := strings.TrimSpace(request.Name)
	if businessName == "" {
		businessName = "Your Restaurant"
	}

	headline := formatPosterHTMLLines(firstNonEmpty(strings.TrimSpace(settings.Headline), "Scan QR code for menu"), 18, 3, true)
	footerNote := formatPosterHTMLLines(firstNonEmpty(strings.TrimSpace(settings.FooterNote), "Updated live for dine-in and takeaway."), 34, 2, false)
	displayURL := posterDisplayURL(request.WebsiteURL, request.MenuURL)
	addressLine := strings.TrimSpace(composePosterAddress(request.Address, request.City))
	contactGroupMarkup := buildPosterContactGroupHTML(request.Phone, request.WebsiteURL, request.MenuURL)
	tableLabel := html.EscapeString(strings.ToUpper(firstNonEmpty(strings.TrimSpace(settings.FooterNote), "Table 1")))

	logoMarkup := fmt.Sprintf(`<div class="brand-wordmark">%s</div>`, html.EscapeString(businessName))
	if settings.ShowLogo && logoDataURL != "" {
		logoMarkup = fmt.Sprintf(`<img src="%s" alt="Business logo" class="poster-logo-image" />`, html.EscapeString(logoDataURL))
	}

	addressMarkup := ""
	if settings.ShowAddress && addressLine != "" {
		addressMarkup = fmt.Sprintf(`<div class="detail-box"><div class="detail-label">Address</div><div class="detail-value">%s</div></div>`, html.EscapeString(addressLine))
	}

	urlMarkup := ""
	if settings.ShowURL && displayURL != "" {
		urlMarkup = fmt.Sprintf(`<div class="detail-box"><div class="detail-label">Menu URL</div><div class="detail-value">%s</div></div>`, html.EscapeString(displayURL))
	}

	backgroundLayer := ""
	if coverDataURL != "" {
		backgroundLayer = fmt.Sprintf(`<div class="bg-photo"><img src="%s" alt="Poster background" /></div>`, html.EscapeString(coverDataURL))
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
      font-family: {{FONT_SANS}};
      background: {{PAGE_BG}};
      color: {{TEXT_COLOR}};
    }
    #poster-root {
      width: 100%;
      height: 100%;
      padding: 20px;
      display: block;
    }
    .poster {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background: linear-gradient(180deg, color-mix(in srgb, {{ACCENT_COLOR}} 92%, #ffffff 8%), color-mix(in srgb, {{ACCENT_COLOR}} 84%, #000000 16%));
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
      overflow: hidden;
      isolation: isolate;
    }
    .bg-photo {
      position: absolute;
      inset: 0;
      opacity: 0.18;
      filter: blur(12px) saturate(0.8);
      transform: scale(1.12);
      z-index: 0;
    }
    .bg-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, color-mix(in srgb, {{ACCENT_COLOR}} 92%, transparent), color-mix(in srgb, {{ACCENT_COLOR}} 88%, #000 12%)),
        radial-gradient(circle at 50% 28%, rgba(255,255,255,0.08), transparent 34%);
      z-index: 1;
    }
    .content {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      padding: 34px 30px 24px;
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      justify-items: center;
      text-align: center;
    }
    .logo-wrap {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
    }
    .logo-card {
      min-width: 168px;
      min-height: 86px;
      border-radius: 24px;
      background: rgba(255,255,255,0.12);
      border: 2px solid rgba(255,255,255,0.2);
      box-shadow: 0 12px 28px rgba(0,0,0,0.16);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      backdrop-filter: blur(6px);
    }
    .poster-logo-image {
      width: 100%;
      max-width: 150px;
      height: 68px;
      object-fit: contain;
      display: block;
    }
    .brand-wordmark {
      font-family: {{FONT_DISPLAY}};
      font-size: 58px;
      line-height: 1;
      color: {{ON_PRIMARY}};
      font-weight: 700;
      letter-spacing: -0.04em;
      text-transform: none;
    }
    .title-block {
      width: 100%;
      display: grid;
      gap: 10px;
      justify-items: center;
      color: {{ON_PRIMARY}};
      margin-bottom: 20px;
    }
    .headline {
      font-family: {{FONT_DISPLAY}};
      font-size: 34px;
      line-height: 1.04;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.03em;
      max-width: 90%;
    }
    .divider {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 16px;
      font-size: 16px;
      line-height: 1;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: {{ON_PRIMARY}};
    }
    .divider::before,
    .divider::after {
      content: "";
      height: 2px;
      background: color-mix(in srgb, {{SECONDARY_COLOR}} 72%, #fff 28%);
      border-radius: 999px;
    }
    .table-label {
      color: {{ON_PRIMARY}};
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .qr-section {
      width: 100%;
      display: grid;
      justify-items: center;
      align-content: center;
      gap: 18px;
      min-height: 0;
    }
    .qr-card {
      width: min(74vw, 520px);
      height: min(74vw, 520px);
      max-width: 58%;
      max-height: 58%;
      min-width: 320px;
      min-height: 320px;
      background: #fff;
      border: 4px solid rgba(255,255,255,0.84);
      box-shadow: 0 18px 38px rgba(0,0,0,0.18);
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .info-strip {
      width: min(74vw, 520px);
      max-width: 58%;
      display: grid;
      gap: 10px;
      justify-items: stretch;
    }
    .detail-box {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      color: {{ON_PRIMARY}};
      border-radius: 16px;
      padding: 12px 16px;
      text-align: left;
      backdrop-filter: blur(6px);
    }
    .detail-label {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: color-mix(in srgb, {{SECONDARY_COLOR}} 82%, #fff 18%);
      margin-bottom: 4px;
    }
    .detail-value {
      font-size: 16px;
      line-height: 1.3;
      font-weight: 600;
      word-break: break-word;
    }
    .contact-group {
      justify-self: center;
      background: color-mix(in srgb, {{SECONDARY_COLOR}} 90%, transparent);
      border-radius: 999px;
      padding: 10px 18px;
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 10px 18px;
      color: {{ON_SECONDARY}};
      font-size: 14px;
      font-weight: 700;
      max-width: 100%;
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .contact-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.9;
      flex: 0 0 auto;
    }
    .footer {
      width: 100%;
      display: grid;
      gap: 10px;
      justify-items: center;
      margin-top: 16px;
      color: {{ON_PRIMARY}};
    }
    .footer-note {
      font-size: 18px;
      line-height: 1.25;
      font-weight: 600;
      max-width: 80%;
    }
    .powered {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: color-mix(in srgb, {{ON_PRIMARY}} 88%, transparent);
    }
    .powered-brand {
      font-family: {{FONT_DISPLAY}};
      font-size: 34px;
      line-height: 1;
      color: {{ON_PRIMARY}};
      letter-spacing: -0.04em;
    }
  </style>
</head>
<body>
  <div id="poster-root">
    <div class="poster">
      {{BACKGROUND_LAYER}}
      <div class="overlay"></div>
      <div class="content">
        <div class="logo-wrap">
          <div class="logo-card">{{LOGO}}</div>
        </div>
        <div class="title-block">
          <div class="headline">{{HEADLINE}}</div>
          <div class="divider">MENU</div>
          <div class="table-label">@{{TABLE_LABEL}}</div>
        </div>
        <div class="qr-section">
          <div class="qr-card">
            <img src="{{QR_URL}}" alt="QR code" />
          </div>
          <div class="info-strip">
            {{CONTACT_GROUP}}
            {{ADDRESS}}
            {{URL}}
          </div>
        </div>
        <div class="footer">
          <div class="footer-note">{{FOOTER_NOTE}}</div>
          <div class="powered">Powered by <span class="powered-brand">{{BRAND}}</span></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`

	replacements := []string{
		"{{WIDTH}}", fmt.Sprintf("%d", size.Width),
		"{{HEIGHT}}", fmt.Sprintf("%d", size.Height),
		"{{FONT_SANS}}", fontSans,
		"{{FONT_DISPLAY}}", fontDisplay,
		"{{PAGE_BG}}", palette.Background,
		"{{TEXT_COLOR}}", palette.Foreground,
		"{{ACCENT_COLOR}}", palette.Accent,
		"{{SECONDARY_COLOR}}", palette.Highlight,
		"{{ON_PRIMARY}}", contrastColor(palette.Accent),
		"{{ON_SECONDARY}}", contrastColor(palette.Highlight),
		"{{BRAND}}", html.EscapeString(businessName),
		"{{HEADLINE}}", headline,
		"{{FOOTER_NOTE}}", footerNote,
		"{{LOGO}}", logoMarkup,
		"{{QR_URL}}", html.EscapeString(qrDataURL),
		"{{CONTACT_GROUP}}", contactGroupMarkup,
		"{{ADDRESS}}", addressMarkup,
		"{{URL}}", urlMarkup,
		"{{BACKGROUND_LAYER}}", backgroundLayer,
		"{{TABLE_LABEL}}", tableLabel,
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
