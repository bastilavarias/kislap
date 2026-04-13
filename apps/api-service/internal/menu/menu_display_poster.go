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

	if settings.Template == "brand" {
		return renderBrandPosterHTML(request, settings, size, palette, qrDataURL, logoDataURL, coverDataURL)
	}
	if settings.Template == "reference-copy" {
		return renderReferenceCopyPosterHTML(request, settings, size, qrDataURL, logoDataURL, coverDataURL)
	}

	return renderCleanPosterHTML(request, settings, size, palette, qrDataURL, logoDataURL)
}

func renderReferenceCopyPosterHTML(
	request GenerateDisplayPosterRequest,
	settings DisplayPosterSettingsRequest,
	size posterSizeSpec,
	qrDataURL, logoDataURL, coverDataURL string,
) string {
	_ = request
	_ = settings

	logoMarkup := `<div class="ref-logo-fallback">e</div>`
	if logoDataURL != "" {
		logoMarkup = fmt.Sprintf(`<img src="%s" alt="Business logo" class="ref-logo-image" />`, html.EscapeString(logoDataURL))
	}

	foodOneURL := coverDataURL
	if foodOneURL == "" {
		fallbackFoodOne := "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=80"
		foodOneURL, _ = fetchRemoteImageAsDataURL(&fallbackFoodOne)
	}
	fallbackFoodTwo := "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
	foodTwoURL, _ := fetchRemoteImageAsDataURL(&fallbackFoodTwo)

	foodOneMarkup := `<div class="ref-food-fallback"></div>`
	if foodOneURL != "" {
		foodOneMarkup = fmt.Sprintf(`<img src="%s" alt="Food image" class="ref-food-image" />`, html.EscapeString(foodOneURL))
	}
	foodTwoMarkup := `<div class="ref-food-fallback"></div>`
	if foodTwoURL != "" {
		foodTwoMarkup = fmt.Sprintf(`<img src="%s" alt="Food image" class="ref-food-image" />`, html.EscapeString(foodTwoURL))
	}

	const basePosterWidth = 800.0
	const basePosterHeight = 1120.0

	canvasPadY := chooseFontSize(size, 4, 4, 4)
	canvasPadX := chooseFontSize(size, 6, 6, 6)
	topGap := chooseFontSize(size, 4, 4, 2)
	topNoteFont := chooseFontSize(size, 15, 13, 9)
	availableWidth := float64(size.Width - (canvasPadX * 2))
	availableHeight := float64(size.Height - (canvasPadY * 2) - topGap - topNoteFont - 12)
	if availableWidth < 100 {
		availableWidth = 100
	}
	if availableHeight < 100 {
		availableHeight = 100
	}
	targetPosterHeight := availableHeight * 0.97
	posterScale := availableWidth / basePosterWidth
	if hScale := targetPosterHeight / basePosterHeight; hScale < posterScale {
		posterScale = hScale
	}
	if posterScale <= 0 {
		posterScale = 1
	}
	posterScaledWidth := int(basePosterWidth * posterScale)
	posterScaledHeight := int(basePosterHeight * posterScale)

	template := `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Display Poster Reference Copy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,600&family=Oswald:wght@500;700&display=swap"
    rel="stylesheet"
  />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: {{WIDTH}}px;
      height: {{HEIGHT}}px;
      overflow: hidden;
      font-family: "Montserrat", sans-serif;
      background:
        radial-gradient(circle at 20% 18%, rgba(255,255,255,0.5), transparent 22%),
        radial-gradient(circle at 80% 16%, rgba(255,255,255,0.3), transparent 18%),
        radial-gradient(circle at 34% 88%, rgba(255,255,255,0.2), transparent 16%),
        linear-gradient(180deg, #efede8, #e5e1db);
    }
    #poster-root {
      width: {{WIDTH}}px;
      height: {{HEIGHT}}px;
      padding: {{CANVAS_PAD_Y}}px {{CANVAS_PAD_X}}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: {{TOP_GAP}}px;
    }
    .ref-top-note {
      width: 100%;
      text-align: center;
      font-size: {{TOP_NOTE_FONT}}px;
      line-height: 1;
      font-weight: 700;
      color: #1f1b1b;
      letter-spacing: 0.01em;
      flex: 0 0 auto;
    }
    .ref-stage {
      width: 100%;
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .ref-poster-shell {
      width: {{POSTER_SCALED_W}}px;
      height: {{POSTER_SCALED_H}}px;
      position: relative;
      flex: 0 0 auto;
    }
    .poster {
      width: 800px;
      height: 1120px;
      background-color: #fdfdfd;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      transform: scale({{POSTER_SCALE}});
      transform-origin: top left;
    }
    .bg-gray {
      position: absolute;
      top: 270px;
      left: 60px;
      width: 740px;
      height: 300px;
      background-color: #ebebeb;
      border-top-left-radius: 40px;
      z-index: 1;
    }
    .bg-red {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 620px;
      background-color: #c3252a;
      border-top-left-radius: 140px;
      z-index: 2;
    }
    .header-group {
      position: absolute;
      top: 85px;
      left: 70px;
      z-index: 3;
    }
    .subtitle {
      font-size: 13px;
      color: #555;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
      text-transform: uppercase;
      font-weight: 500;
    }
    .title {
      font-family: "Oswald", sans-serif;
      font-size: 78px;
      color: #cc2b2b;
      line-height: 1;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .logo-banner {
      position: absolute;
      top: 0;
      right: 70px;
      width: 110px;
      height: 180px;
      background-color: #c3252a;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      z-index: 4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 15px rgba(195, 37, 42, 0.3);
    }
    .ref-logo-shell {
      width: 54px;
      height: 54px;
      border-radius: 12px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0,0,0,0.16);
      margin-bottom: 6px;
    }
    .ref-logo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .ref-logo-fallback {
      font-family: "Oswald", sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #cc3135;
      line-height: 1;
    }
    .logo-text {
      font-weight: 700;
      font-size: 16px;
      margin-top: 5px;
      text-transform: uppercase;
    }
    .logo-subtext {
      font-size: 7px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .qr-container {
      position: absolute;
      top: 320px;
      left: 70px;
      width: 350px;
      height: 350px;
      background: white;
      border-radius: 25px;
      padding: 22px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      z-index: 5;
    }
    .qr-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .scan-group {
      position: absolute;
      top: 340px;
      left: 450px;
      z-index: 3;
    }
    .scan-title {
      font-family: "Oswald", sans-serif;
      font-size: 48px;
      color: #eb8b1c;
      line-height: 1;
      white-space: nowrap;
      text-transform: uppercase;
    }
    .scan-subtitle {
      font-size: 20px;
      color: #222;
      margin-top: 8px;
      line-height: 1.2;
      font-weight: 400;
      text-transform: uppercase;
    }
    .food-images {
      position: absolute;
      top: 560px;
      left: 450px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      z-index: 4;
    }
    .food-box {
      width: 290px;
      height: 165px;
      background: white;
      border-radius: 15px;
      padding: 6px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    .ref-food-image, .ref-food-fallback {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      display: block;
      object-fit: cover;
      background:
        radial-gradient(circle at top left, rgba(204, 49, 53, 0.14), transparent 40%),
        linear-gradient(135deg, rgba(243, 156, 18, 0.12), transparent 70%),
        #f3efe8;
    }
    .bottom-left-content {
      position: absolute;
      bottom: 70px;
      left: 70px;
      z-index: 4;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
    .schedule-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .open-daily {
      color: #eb8b1c;
      font-size: 19px;
      font-weight: 600;
      font-style: italic;
      text-transform: uppercase;
    }
    .time {
      font-family: "Oswald", sans-serif;
      font-size: 50px;
      color: white;
      line-height: 1.1;
      letter-spacing: -0.5px;
      white-space: nowrap;
      text-transform: uppercase;
    }
    .contact-group {
      background-color: #eb8b1c;
      border-radius: 25px;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      white-space: nowrap;
      color: white;
      font-size: 13px;
      font-weight: 600;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .contact-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.82);
      flex: 0 0 auto;
    }
    .website {
      color: white;
      font-size: 14px;
      margin-top: 5px;
    }
    .website strong {
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div id="poster-root">
    <div class="ref-top-note">IMAGE NOT INCLUDED</div>
    <div class="ref-stage">
      <div class="ref-poster-shell">
        <div class="poster">
          <div class="bg-gray"></div>
          <div class="bg-red"></div>

          <div class="header-group">
            <div class="subtitle">Your Restaurant Present</div>
            <div class="title">ONLINE MENU</div>
          </div>

          <div class="logo-banner">
            <div class="ref-logo-shell">{{LOGO}}</div>
            <div class="logo-text">LOGO</div>
            <div class="logo-subtext">Cafe &amp; Resto</div>
          </div>

          <div class="qr-container">
            <img src="{{QR_URL}}" alt="QR code" />
          </div>

          <div class="scan-group">
            <div class="scan-title">SCAN HERE</div>
            <div class="scan-subtitle">TO VIEW OUR<br />MENU ONLINE</div>
          </div>

          <div class="food-images">
            <div class="food-box">{{FOOD_ONE}}</div>
            <div class="food-box">{{FOOD_TWO}}</div>
          </div>

          <div class="bottom-left-content">
            <div class="schedule-group">
              <div class="open-daily">OPEN DAILY</div>
              <div class="time">10.00 AM - 10.00 PM</div>
            </div>

            <div class="contact-group">
              <div class="contact-item"><span class="contact-dot"></span>021 335 668 954</div>
              <div class="contact-item"><span class="contact-dot"></span>@yourbusiness</div>
            </div>

            <div class="website">For More Information <strong>www.yoursite.com</strong></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`

	replacements := []string{
		"{{WIDTH}}", fmt.Sprintf("%d", size.Width),
		"{{HEIGHT}}", fmt.Sprintf("%d", size.Height),
		"{{CANVAS_PAD_Y}}", fmt.Sprintf("%d", canvasPadY),
		"{{CANVAS_PAD_X}}", fmt.Sprintf("%d", canvasPadX),
		"{{TOP_GAP}}", fmt.Sprintf("%d", topGap),
		"{{TOP_NOTE_FONT}}", fmt.Sprintf("%d", topNoteFont),
		"{{POSTER_SCALE}}", fmt.Sprintf("%.4f", posterScale),
		"{{POSTER_SCALED_W}}", fmt.Sprintf("%d", posterScaledWidth),
		"{{POSTER_SCALED_H}}", fmt.Sprintf("%d", posterScaledHeight),
		"{{LOGO}}", logoMarkup,
		"{{QR_URL}}", html.EscapeString(qrDataURL),
		"{{FOOD_ONE}}", foodOneMarkup,
		"{{FOOD_TWO}}", foodTwoMarkup,
	}

	return strings.NewReplacer(replacements...).Replace(template)
}
func renderBrandPosterHTML(
	request GenerateDisplayPosterRequest,
	settings DisplayPosterSettingsRequest,
	size posterSizeSpec,
	palette posterPalette,
	qrDataURL, logoDataURL, coverDataURL string,
) string {
	headline := html.EscapeString(strings.TrimSpace(settings.Headline))
	if headline == "" {
		headline = "Scan to view our menu"
	}

	subtext := html.EscapeString(strings.TrimSpace(settings.Subtext))
	if subtext == "" {
		subtext = "Browse our latest dishes, drinks, and prices on your phone."
	}

	footerNote := html.EscapeString(strings.TrimSpace(settings.FooterNote))
	if footerNote == "" {
		footerNote = "Updated live for dine-in and takeaway."
	}

	businessName := html.EscapeString(strings.TrimSpace(request.Name))
	if businessName == "" {
		businessName = "Your Restaurant"
	}

	addressLine := html.EscapeString(strings.TrimSpace(composePosterAddress(request.Address, request.City)))
	urlLine := html.EscapeString(strings.TrimSpace(request.MenuURL))
	showAddress := settings.ShowAddress && addressLine != ""
	showURL := settings.ShowURL && urlLine != ""

	coverMarkup := `<div class="poster-cover-fallback"></div>`
	if coverDataURL != "" {
		coverMarkup = fmt.Sprintf(`<img src="%s" alt="Menu cover" class="poster-cover-image" />`, html.EscapeString(coverDataURL))
	}

	logoMarkup := `<div class="poster-logo-fallback">M</div>`
	if settings.ShowLogo && logoDataURL != "" {
		logoMarkup = fmt.Sprintf(`<img src="%s" alt="Business logo" class="poster-logo-image" />`, html.EscapeString(logoDataURL))
	}

	addressBlock := ""
	if showAddress {
		addressBlock = fmt.Sprintf(`
        <div class="poster-detail-card">
          <p class="poster-detail-label">Address</p>
          <p class="poster-detail-value">%s</p>
        </div>`, addressLine)
	}

	urlBlock := ""
	if showURL {
		urlBlock = fmt.Sprintf(`
        <div class="poster-detail-card">
          <p class="poster-detail-label">Menu URL</p>
          <p class="poster-detail-value">%s</p>
        </div>`, urlLine)
	}

	kickerFont := chooseFontSize(size, 18, 13, 9)
	headlineFont := chooseFontSize(size, 74, 54, 34)
	subtextFont := chooseFontSize(size, 23, 17, 11)
	brandFont := chooseFontSize(size, 34, 24, 15)
	bodyFont := chooseFontSize(size, 21, 15, 10)
	smallFont := chooseFontSize(size, 15, 11, 8)
	scanFont := chooseFontSize(size, 56, 40, 26)
	qrSize := chooseFontSize(size, 360, 258, 162)

	template := `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Display Poster</title>
  <style>
    :root {
      --page-bg: {{PAGE_BG}};
      --surface: {{SURFACE}};
      --card: {{CARD}};
      --text: {{TEXT}};
      --muted: {{MUTED}};
      --accent: {{ACCENT}};
      --accent-soft: color-mix(in srgb, {{ACCENT}} 20%, white);
      --border: color-mix(in srgb, {{TEXT}} 10%, transparent);
      --stage-bg: linear-gradient(160deg, color-mix(in srgb, var(--text) 88%, #070707), color-mix(in srgb, var(--surface) 18%, #141414));
      --stage-soft: color-mix(in srgb, var(--surface) 18%, transparent);
      --paper: color-mix(in srgb, var(--card) 90%, white);
      --paper-soft: color-mix(in srgb, var(--card) 72%, var(--surface));
      --on-dark: #f7f3ef;
      --shadow: 0 24px 60px rgba(0, 0, 0, 0.20);
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      width: {{WIDTH}}px;
      height: {{HEIGHT}}px;
      overflow: hidden;
      background: var(--page-bg);
      font-family: Inter, Arial, Helvetica, sans-serif;
      color: var(--text);
    }
    #poster-root {
      width: {{WIDTH}}px;
      height: {{HEIGHT}}px;
      padding: {{OUTER_PAD}}px;
      background: var(--page-bg);
    }
    .poster-shell {
      width: 100%;
      height: 100%;
      background: var(--stage-bg);
      border-radius: {{SHELL_RADIUS}}px;
      padding: {{INNER_PAD}}px;
      display: grid;
      grid-template-rows: {{HERO_HEIGHT}}fr {{BODY_HEIGHT}}fr;
      gap: {{SECTION_GAP}}px;
      overflow: hidden;
      position: relative;
    }
    .poster-shell::before {
      content: "";
      position: absolute;
      inset: -10% auto auto -8%;
      width: 44%;
      height: 28%;
      background: radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent), transparent 72%);
      opacity: 0.5;
      filter: blur(36px);
      pointer-events: none;
    }
    .poster-hero {
      display: grid;
      grid-template-columns: 1.14fr 0.86fr;
      gap: {{SECTION_GAP}}px;
      min-height: 0;
      position: relative;
      z-index: 1;
    }
    .poster-cover-card {
      position: relative;
      border-radius: {{CARD_RADIUS}}px;
      overflow: hidden;
      min-height: 0;
      box-shadow: var(--shadow);
      background: linear-gradient(145deg, color-mix(in srgb, var(--accent) 18%, transparent), transparent 62%), var(--paper);
    }
    .poster-cover-image,
    .poster-cover-fallback {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
    .poster-cover-fallback {
      background:
        radial-gradient(circle at top left, color-mix(in srgb, var(--accent) 20%, transparent), transparent 40%),
        linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, transparent), transparent 72%),
        var(--paper);
    }
    .poster-cover-card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 10%, rgba(0, 0, 0, 0.10) 60%, rgba(0, 0, 0, 0.55) 100%);
    }
    .poster-cover-overlay {
      position: absolute;
      inset: auto {{HERO_PAD}}px {{HERO_PAD}}px {{HERO_PAD}}px;
      background: color-mix(in srgb, var(--text) 26%, transparent);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: {{OVERLAY_RADIUS}}px;
      padding: {{OVERLAY_PAD}}px;
      display: flex;
      flex-direction: column;
      gap: {{COPY_GAP}}px;
      z-index: 2;
    }
    .poster-kicker {
      margin: 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: {{KICKER_FONT}}px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .poster-brand-name {
      margin: 0;
      color: var(--on-dark);
      font-size: {{BRAND_FONT}}px;
      line-height: 0.95;
      font-weight: 800;
      text-transform: uppercase;
    }
    .poster-info-card {
      padding: {{HERO_PAD}}px 0 {{HERO_PAD}}px {{HERO_PAD}}px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: {{SECTION_GAP}}px;
      min-height: 0;
      position: relative;
    }
    .poster-info-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: {{SECTION_GAP}}px;
    }
    .poster-title {
      margin: {{TITLE_TOP}}px 0 0;
      font-size: {{TITLE_FONT}}px;
      line-height: 0.9;
      font-weight: 900;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      max-width: 7ch;
      color: var(--on-dark);
    }
    .poster-subtext {
      margin: {{COPY_GAP}}px 0 0;
      color: rgba(255, 255, 255, 0.74);
      font-size: {{SUBTEXT_FONT}}px;
      line-height: 1.25;
      max-width: 86%;
    }
    .poster-logo-card {
      width: {{LOGO_SIZE}}px;
      height: {{LOGO_SIZE}}px;
      border-radius: {{LOGO_RADIUS}}px;
      background: var(--paper);
      border: 1px solid rgba(255, 255, 255, 0.18);
      overflow: hidden;
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
    }
    .poster-logo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .poster-logo-fallback {
      font-size: {{LOGO_TEXT_FONT}}px;
      font-weight: 900;
      color: var(--accent);
      text-transform: uppercase;
    }
    .poster-highlight {
      display: grid;
      gap: {{COPY_GAP}}px;
      padding: {{HIGHLIGHT_PAD}}px;
      border-radius: {{INNER_RADIUS}}px;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent 75%),
        rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      max-width: 92%;
    }
    .poster-highlight-label {
      margin: 0;
      color: var(--accent);
      font-size: {{SMALL_FONT}}px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .poster-highlight-note {
      margin: 0;
      color: var(--on-dark);
      font-size: {{BODY_FONT}}px;
      line-height: 1.2;
      font-weight: 700;
    }
    .poster-body {
      display: grid;
      grid-template-columns: 0.84fr 1.16fr;
      gap: {{SECTION_GAP}}px;
      min-height: 0;
      position: relative;
      z-index: 1;
    }
    .poster-qr-card {
      padding: {{BODY_PAD}}px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: {{SECTION_GAP}}px;
      background:
        radial-gradient(circle at top left, color-mix(in srgb, var(--accent) 18%, transparent), transparent 44%),
        linear-gradient(180deg, var(--paper), color-mix(in srgb, var(--paper-soft) 82%, white));
      border-radius: {{CARD_RADIUS}}px;
      box-shadow: var(--shadow);
      min-height: 0;
      transform: translateY({{QR_LIFT}}px);
      position: relative;
      overflow: hidden;
    }
    .poster-qr-card::before {
      content: "";
      position: absolute;
      left: {{BODY_PAD}}px;
      right: {{BODY_PAD}}px;
      top: 0;
      height: {{ACCENT_STRIP_H}}px;
      border-radius: 0 0 999px 999px;
      background: var(--accent);
      opacity: 0.86;
    }
    .poster-qr-header {
      display: flex;
      flex-direction: column;
      gap: {{COPY_GAP}}px;
      padding-top: {{QR_TOP_PAD}}px;
    }
    .poster-qr-title {
      margin: 0;
      color: var(--accent);
      font-size: {{SCAN_FONT}}px;
      line-height: 0.9;
      font-weight: 900;
      text-transform: uppercase;
    }
    .poster-qr-copy {
      margin: 0;
      color: var(--muted);
      font-size: {{BODY_FONT}}px;
      line-height: 1.22;
    }
    .poster-qr-box {
      align-self: center;
      width: {{QR_SIZE}}px;
      height: {{QR_SIZE}}px;
      border-radius: {{QR_RADIUS}}px;
      background: #fff;
      padding: {{QR_PAD}}px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
    }
    .poster-qr-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .poster-qr-foot {
      display: grid;
      gap: {{COPY_GAP}}px;
    }
    .poster-url-pill {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      min-height: {{PILL_H}}px;
      padding: 0 {{PILL_PAD}}px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--accent) 14%, transparent);
      color: var(--accent);
      font-size: {{SMALL_FONT}}px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .poster-footnote {
      margin: 0;
      color: var(--muted);
      font-size: {{SMALL_FONT}}px;
      line-height: 1.2;
    }
    .poster-meta-card {
      padding: {{BODY_PAD}}px 0 0 0;
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      gap: {{SECTION_GAP}}px;
      background: transparent;
      min-height: 0;
    }
    .poster-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: {{SECTION_GAP}}px;
    }
    .poster-detail-card {
      padding: {{DETAIL_PAD}}px;
      border-radius: {{INNER_RADIUS}}px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      min-height: {{DETAIL_MIN_H}}px;
    }
    .poster-detail-label {
      margin: 0 0 {{DETAIL_LABEL_GAP}}px;
      color: rgba(255, 255, 255, 0.56);
      font-size: {{SMALL_FONT}}px;
      line-height: 1;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .poster-detail-value {
      margin: 0;
      color: var(--on-dark);
      font-size: {{BODY_FONT}}px;
      line-height: 1.24;
      font-weight: 600;
      word-break: break-word;
    }
    .poster-meta-photo {
      width: 100%;
      min-height: {{PHOTO_H}}px;
      border-radius: {{INNER_RADIUS}}px;
      overflow: hidden;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent 72%), rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: var(--shadow);
    }
    .poster-meta-photo img,
    .poster-meta-photo-fallback {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
    .poster-meta-bottom {
      display: grid;
      gap: {{COPY_GAP}}px;
      align-content: end;
      padding: 0 {{BODY_PAD}}px {{BODY_PAD}}px 0;
    }
    .poster-size-note {
      margin: 0;
      color: rgba(255, 255, 255, 0.56);
      font-size: {{SMALL_FONT}}px;
      line-height: 1.2;
    }
  </style>
</head>
<body>
  <div id="poster-root">
    <div class="poster-shell">
      <section class="poster-hero">
        <div class="poster-cover-card">
          {{COVER}}
          <div class="poster-cover-overlay">
            <p class="poster-kicker">{{BUSINESS_NAME}} presents</p>
            <p class="poster-brand-name">{{BUSINESS_NAME}}</p>
          </div>
        </div>
        <div class="poster-info-card">
          <div>
            <div class="poster-info-top">
              <div>
                <p class="poster-kicker">Display poster</p>
                <h1 class="poster-title">{{HEADLINE}}</h1>
              </div>
              <div class="poster-logo-card">{{LOGO}}</div>
            </div>
            <p class="poster-subtext">{{SUBTEXT}}</p>
          </div>
          <div class="poster-highlight">
            <p class="poster-highlight-label">Live menu</p>
            <p class="poster-highlight-note">Built from your menu theme, your photos, and a QR people can actually notice.</p>
          </div>
        </div>
      </section>
      <section class="poster-body">
        <article class="poster-qr-card">
          <div class="poster-qr-header">
            <h2 class="poster-qr-title">Scan here</h2>
            <p class="poster-qr-copy">{{SUBTEXT}}</p>
          </div>
          <div class="poster-qr-box">
            <img src="{{QR_URL}}" alt="QR code" />
          </div>
          <div class="poster-qr-foot">
            {{URL_PILL}}
            <p class="poster-footnote">{{FOOTER_NOTE}}</p>
          </div>
        </article>
        <article class="poster-meta-card">
          <div class="poster-meta-grid">
            <div class="poster-detail-card">
              <p class="poster-detail-label">Restaurant</p>
              <p class="poster-detail-value">{{BUSINESS_NAME}}</p>
            </div>
            <div class="poster-detail-card">
              <p class="poster-detail-label">Format</p>
              <p class="poster-detail-value">Designed for {{SIZE_LABEL}} display stands</p>
            </div>
          </div>
          <div class="poster-meta-photo">{{COVER}}</div>
          <div class="poster-meta-grid">
            {{ADDRESS_BLOCK}}
            {{URL_BLOCK}}
          </div>
          <div class="poster-meta-bottom">
            <p class="poster-size-note">Designed to feel closer to the public menu experience than a generic flyer, while still working as a physical display asset.</p>
          </div>
        </article>
      </section>
    </div>
  </div>
</body>
</html>`

	urlPillMarkup := ""
	if showURL {
		urlPillMarkup = fmt.Sprintf(`<div class="poster-url-pill">%s</div>`, urlLine)
	}

	replacer := strings.NewReplacer(
		"{{PAGE_BG}}", palette.Background,
		"{{SURFACE}}", palette.Surface,
		"{{CARD}}", palette.Card,
		"{{TEXT}}", palette.Foreground,
		"{{MUTED}}", palette.Muted,
		"{{ACCENT}}", palette.Accent,
		"{{WIDTH}}", fmt.Sprintf("%d", size.Width),
		"{{HEIGHT}}", fmt.Sprintf("%d", size.Height),
		"{{OUTER_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 54, 38, 24)),
		"{{SHELL_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 38, 28, 18)),
		"{{INNER_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 34, 24, 16)),
		"{{SECTION_GAP}}", fmt.Sprintf("%d", chooseFontSize(size, 24, 18, 12)),
		"{{CARD_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 32, 22, 14)),
		"{{HERO_HEIGHT}}", "0.94",
		"{{BODY_HEIGHT}}", "1.06",
		"{{HERO_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 28, 20, 12)),
		"{{OVERLAY_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 22, 16, 10)),
		"{{OVERLAY_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 18, 14, 10)),
		"{{COPY_GAP}}", fmt.Sprintf("%d", chooseFontSize(size, 12, 8, 6)),
		"{{KICKER_FONT}}", fmt.Sprintf("%d", kickerFont),
		"{{BRAND_FONT}}", fmt.Sprintf("%d", brandFont),
		"{{TITLE_TOP}}", fmt.Sprintf("%d", chooseFontSize(size, 10, 8, 6)),
		"{{TITLE_FONT}}", fmt.Sprintf("%d", headlineFont),
		"{{SUBTEXT_FONT}}", fmt.Sprintf("%d", subtextFont),
		"{{LOGO_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 118, 86, 54)),
		"{{LOGO_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 24, 18, 12)),
		"{{LOGO_TEXT_FONT}}", fmt.Sprintf("%d", chooseFontSize(size, 22, 16, 10)),
		"{{HIGHLIGHT_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 18, 14, 10)),
		"{{INNER_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 22, 16, 10)),
		"{{SMALL_FONT}}", fmt.Sprintf("%d", smallFont),
		"{{BODY_FONT}}", fmt.Sprintf("%d", bodyFont),
		"{{SCAN_FONT}}", fmt.Sprintf("%d", scanFont),
		"{{BODY_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 28, 20, 12)),
		"{{QR_LIFT}}", fmt.Sprintf("%d", -chooseFontSize(size, 26, 18, 10)),
		"{{ACCENT_STRIP_H}}", fmt.Sprintf("%d", chooseFontSize(size, 18, 12, 8)),
		"{{QR_TOP_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 16, 12, 8)),
		"{{QR_SIZE}}", fmt.Sprintf("%d", qrSize),
		"{{QR_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 26, 18, 12)),
		"{{QR_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 24, 18, 12)),
		"{{PILL_H}}", fmt.Sprintf("%d", chooseFontSize(size, 34, 26, 16)),
		"{{PILL_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 18, 12, 10)),
		"{{DETAIL_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 18, 14, 10)),
		"{{DETAIL_MIN_H}}", fmt.Sprintf("%d", chooseFontSize(size, 108, 84, 58)),
		"{{DETAIL_LABEL_GAP}}", fmt.Sprintf("%d", chooseFontSize(size, 6, 4, 2)),
		"{{PHOTO_H}}", fmt.Sprintf("%d", chooseFontSize(size, 260, 196, 118)),
		"{{BUSINESS_NAME}}", businessName,
		"{{HEADLINE}}", headline,
		"{{SUBTEXT}}", subtext,
		"{{LOGO}}", logoMarkup,
		"{{COVER}}", coverMarkup,
		"{{QR_URL}}", html.EscapeString(qrDataURL),
		"{{URL_PILL}}", urlPillMarkup,
		"{{FOOTER_NOTE}}", footerNote,
		"{{SIZE_LABEL}}", html.EscapeString(strings.ToUpper(size.Label)),
		"{{ADDRESS_BLOCK}}", addressBlock,
		"{{URL_BLOCK}}", urlBlock,
	)

	return replacer.Replace(template)
}
func renderCleanPosterHTML(
	request GenerateDisplayPosterRequest,
	settings DisplayPosterSettingsRequest,
	size posterSizeSpec,
	palette posterPalette,
	qrDataURL, logoDataURL string,
) string {
	headline := html.EscapeString(strings.TrimSpace(settings.Headline))
	subtext := html.EscapeString(strings.TrimSpace(settings.Subtext))
	businessName := html.EscapeString(strings.TrimSpace(request.Name))
	if headline == "" {
		headline = "Scan to view our menu"
	}
	if subtext == "" {
		subtext = "Browse our latest dishes, drinks, and prices on your phone."
	}
	if businessName == "" {
		businessName = "Your Restaurant"
	}

	logoMarkup := ""
	if settings.ShowLogo && logoDataURL != "" {
		logoMarkup = fmt.Sprintf(`<img src="%s" alt="Business logo" style="width:%dpx;height:%dpx;border-radius:24px;object-fit:cover;display:block;" />`, html.EscapeString(logoDataURL), chooseFontSize(size, 128, 92, 58), chooseFontSize(size, 128, 92, 58))
	}

	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      width: %dpx;
      height: %dpx;
      overflow: hidden;
      background: %s;
      font-family: Inter, Arial, Helvetica, sans-serif;
    }
    #poster-root {
      width: %dpx;
      height: %dpx;
      padding: %dpx;
      background: %s;
    }
    .card {
      width: 100%%;
      height: 100%%;
      border-radius: 48px;
      background: %s;
      color: %s;
      padding: %dpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
    .name { font-size: %dpx; font-weight: 800; margin: 0; }
    .headline { font-size: %dpx; line-height: 0.94; font-weight: 900; margin: 0; }
    .subtext { font-size: %dpx; line-height: 1.2; color: %s; max-width: 70%%; }
    .middle { display: flex; align-items: center; justify-content: space-between; gap: 32px; }
    .qr-wrap {
      width: %dpx; height: %dpx; padding: %dpx; border-radius: 34px; background: #fff;
      display:flex; align-items:center; justify-content:center;
    }
    .qr-wrap img { width: 100%%; height: 100%%; object-fit: contain; }
    .footer { font-size: %dpx; color: %s; }
  </style>
</head>
<body>
  <div id="poster-root">
    <div class="card">
      <div class="top">
        <div>
          <p class="name">%s</p>
          <h1 class="headline">%s</h1>
          <p class="subtext">%s</p>
        </div>
        %s
      </div>
      <div class="middle">
        <div class="qr-wrap"><img src="%s" alt="QR code" /></div>
        <div>
          <div style="font-size:%dpx;font-weight:900;line-height:0.95;">SCAN<br/>HERE</div>
          <div style="margin-top:%dpx;font-size:%dpx;color:%s;">Open the digital menu in one quick scan.</div>
        </div>
      </div>
      <div class="footer">%s</div>
    </div>
  </div>
</body>
</html>`,
		size.Width, size.Height, palette.Surface,
		size.Width, size.Height, chooseFontSize(size, 58, 42, 26), palette.Surface,
		palette.Card, palette.Foreground, chooseFontSize(size, 72, 52, 34),
		chooseFontSize(size, 34, 24, 16),
		chooseFontSize(size, 96, 66, 40),
		chooseFontSize(size, 24, 18, 11),
		palette.Muted,
		chooseFontSize(size, 360, 252, 162), chooseFontSize(size, 360, 252, 162), chooseFontSize(size, 38, 28, 18),
		chooseFontSize(size, 18, 12, 8), palette.Muted,
		businessName, headline, subtext, logoMarkup, html.EscapeString(qrDataURL),
		chooseFontSize(size, 64, 46, 28), chooseFontSize(size, 22, 16, 10), chooseFontSize(size, 20, 14, 10), palette.Muted,
		html.EscapeString(strings.TrimSpace(settings.FooterNote)),
	)
}

func buildPosterPalette(theme *ThemeRequest, colorMode string) posterPalette {
	fallback := posterPalette{
		Background: "#fff9f4",
		Foreground: "#111111",
		Accent:     "#d63a32",
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
	if !ok {
		return fallback
	}

	background := firstNonEmpty(styles["background"], fallback.Background)
	foreground := firstNonEmpty(styles["foreground"], fallback.Foreground)
	accent := firstNonEmpty(styles["primary"], styles["accent"], fallback.Accent)
	muted := firstNonEmpty(styles["muted-foreground"], styles["secondary"], fallback.Muted)
	card := firstNonEmpty(styles["card"], fallback.Card)
	surface := firstNonEmpty(styles["muted"], styles["secondary"], fallback.Surface)

	return posterPalette{
		Background: background,
		Foreground: foreground,
		Accent:     accent,
		Muted:      muted,
		Card:       card,
		Surface:    surface,
	}
}

func renderPosterSVG(
	request GenerateDisplayPosterRequest,
	settings DisplayPosterSettingsRequest,
	size posterSizeSpec,
	palette posterPalette,
	qrPNG []byte,
	logoDataURL, coverDataURL string,
) string {
	_ = palette
	qrDataURL := "data:image/png;base64," + base64.StdEncoding.EncodeToString(qrPNG)

	businessName := escapeSVGText(request.Name)
	headlineLines := wrapText(settings.Headline, headlineCharLimit(size, settings.Template))
	subtextLines := wrapText(settings.Subtext, subtextCharLimit(size))
	footerLines := wrapText(settings.FooterNote, footerCharLimit(size))
	addressLine := escapeSVGText(composePosterAddress(request.Address, request.City))
	urlLine := escapeSVGText(strings.TrimSpace(request.MenuURL))

	if settings.Template == "brand" {
		return renderBrandPosterSVG(
			size,
			palette,
			logoDataURL,
			coverDataURL,
			businessName,
			headlineLines,
			subtextLines,
			footerLines,
			addressLine,
			urlLine,
			settings,
			qrDataURL,
		)
	}

	return renderCleanPosterSVG(
		size,
		palette,
		logoDataURL,
		businessName,
		headlineLines,
		subtextLines,
		footerLines,
		addressLine,
		urlLine,
		settings,
		qrDataURL,
	)
}

func renderCleanPosterSVG(
	size posterSizeSpec,
	palette posterPalette,
	logoDataURL, businessName string,
	headlineLines, subtextLines, footerLines []string,
	addressLine, urlLine string,
	settings DisplayPosterSettingsRequest,
	qrDataURL string,
) string {
	_ = palette
	_ = businessName
	width := size.Width
	height := size.Height
	padding := width / 14
	topBandHeight := int(float64(height) * 0.22)
	qrSize := width / 3
	if qrSize > 390 {
		qrSize = 390
	}
	if qrSize < 240 {
		qrSize = 240
	}
	qrCardSize := qrSize + 80
	qrX := (width - qrCardSize) / 2
	qrY := int(float64(height) * 0.42)
	headlineFont := chooseFontSize(size, 72, 58, 44)
	subtextFont := chooseFontSize(size, 28, 24, 20)
	bodyFont := chooseFontSize(size, 24, 20, 16)

	var b strings.Builder
	b.WriteString(svgOpen(width, height))
	b.WriteString(fmt.Sprintf(`<rect width="%d" height="%d" fill="%s"/>`, width, height, palette.Background))
	b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="38" fill="%s"/>`, padding/2, padding/2, width-padding, height-padding, palette.Card))
	b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="38" fill="%s"/>`, padding/2, padding/2, width-padding, topBandHeight, palette.Accent))

	currentX := padding + 10
	if settings.ShowLogo && logoDataURL != "" {
		logoSize := chooseFontSize(size, 104, 88, 72)
		b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="22" fill="%s"/>`, currentX, padding+18, logoSize, logoSize, palette.Card))
		b.WriteString(fmt.Sprintf(`<image href="%s" x="%d" y="%d" width="%d" height="%d" preserveAspectRatio="xMidYMid slice"/>`, logoDataURL, currentX+12, padding+30, logoSize-24, logoSize-24))
		currentX += logoSize + 24
	}

	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="700" font-family="Inter, Arial, sans-serif">%s</text>`,
		currentX, padding+64, contrastColor(palette.Accent), chooseFontSize(size, 34, 30, 24), businessName))
	writeTextBlock(&b, padding, padding+130, width-(padding*2), headlineLines, headlineFont, contrastColor(palette.Accent), 1.05, 800)
	writeTextBlock(&b, padding, padding+130+(len(headlineLines)*headlineFont)+(headlineFont/2), width-(padding*2), subtextLines, subtextFont, contrastColor(palette.Accent), 1.25, 500)

	b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="30" fill="%s" stroke="%s" stroke-width="4"/>`, qrX, qrY, qrCardSize, qrCardSize, "#ffffff", palette.Surface))
	b.WriteString(fmt.Sprintf(`<image href="%s" x="%d" y="%d" width="%d" height="%d"/>`, qrDataURL, qrX+40, qrY+40, qrSize, qrSize))
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" text-anchor="middle" fill="%s" font-size="%d" font-weight="700" font-family="Inter, Arial, sans-serif">Scan Here</text>`,
		width/2, qrY+qrCardSize+56, palette.Foreground, bodyFont+4))
	writeTextBlock(&b, padding, qrY+qrCardSize+108, width-(padding*2), footerLines, bodyFont, palette.Muted, 1.25, 500)

	footerY := height - padding - 90
	if settings.ShowAddress && addressLine != "" {
		b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-family="Inter, Arial, sans-serif">%s</text>`,
			padding, footerY, palette.Foreground, bodyFont-2, addressLine))
		footerY += bodyFont + 8
	}
	if settings.ShowURL && urlLine != "" {
		b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-family="Inter, Arial, sans-serif">%s</text>`,
			padding, footerY, palette.Muted, bodyFont-5, urlLine))
	}
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-family="Inter, Arial, sans-serif">%s display poster</text>`,
		width-padding, height-padding+8, palette.Muted, bodyFont-6, size.Label))

	b.WriteString(`</svg>`)
	return b.String()
}

func renderBrandPosterSVG(
	size posterSizeSpec,
	palette posterPalette,
	logoDataURL, coverDataURL, businessName string,
	headlineLines, subtextLines, footerLines []string,
	addressLine, urlLine string,
	settings DisplayPosterSettingsRequest,
	qrDataURL string,
) string {
	_ = palette
	width := size.Width
	height := size.Height
	padding := chooseFontSize(size, 70, 52, 34)
	canvasX := padding
	canvasY := padding
	canvasW := width - (padding * 2)
	canvasH := height - (padding * 2)

	bgColor := "#ece8e2"
	headerBg := "#f8f4ee"
	charcoal := "#2f2d2d"
	deepRed := "#cf3131"
	warmOrange := "#f39a19"
	ink := "#1f1f1f"
	white := "#ffffff"

	headerH := int(float64(canvasH) * 0.215)
	bodyY := canvasY + headerH
	bodyH := canvasH - headerH
	logoBadgeW := int(float64(canvasW) * 0.18)
	headerPadX := chooseFontSize(size, 38, 28, 18)
	headerPadY := chooseFontSize(size, 28, 20, 14)

	tagFont := chooseFontSize(size, 15, 11, 8)
	heroFont := chooseFontSize(size, 108, 76, 46)
	heroLineGap := chooseFontSize(size, 92, 66, 40)
	labelFont := chooseFontSize(size, 22, 16, 11)
	bodyFont := chooseFontSize(size, 22, 16, 11)
	smallFont := chooseFontSize(size, 16, 12, 8)
	scanFont := chooseFontSize(size, 70, 48, 28)
	scanBodyFont := chooseFontSize(size, 23, 16, 10)
	scriptFont := chooseFontSize(size, 60, 42, 24)
	quoteFont := chooseFontSize(size, 112, 78, 44)
	hoursLabelFont := chooseFontSize(size, 34, 24, 14)
	hoursFont := chooseFontSize(size, 72, 50, 28)

	qrCardSize := chooseFontSize(size, 410, 286, 186)
	qrCardX := canvasX + chooseFontSize(size, 24, 18, 12)
	qrCardY := bodyY + chooseFontSize(size, 56, 38, 24)
	qrSize := qrCardSize - chooseFontSize(size, 54, 38, 24)
	qrImageX := qrCardX + (qrCardSize-qrSize)/2
	qrImageY := qrCardY + (qrCardSize-qrSize)/2

	rightColumnX := qrCardX + qrCardSize + chooseFontSize(size, 42, 28, 16)
	rightColumnW := canvasX + canvasW - rightColumnX - chooseFontSize(size, 28, 20, 12)
	infoCardW := chooseFontSize(size, 286, 196, 118)
	infoCardH := chooseFontSize(size, 172, 118, 72)
	infoCardX := canvasX + canvasW - infoCardW
	infoCardY := qrCardY + chooseFontSize(size, 196, 136, 84)

	lowerY := qrCardY + qrCardSize + chooseFontSize(size, 48, 32, 20)
	leftPanelW := chooseFontSize(size, 548, 380, 228)
	leftPanelH := canvasY + canvasH - chooseFontSize(size, 76, 54, 34) - lowerY
	leftPanelX := canvasX
	rightTileSize := chooseFontSize(size, 194, 132, 80)
	rightTileX := canvasX + canvasW - rightTileSize - chooseFontSize(size, 18, 12, 8)
	rightTileGap := chooseFontSize(size, 28, 18, 10)
	tileStackY := lowerY + chooseFontSize(size, 124, 84, 52)
	contactBarW := chooseFontSize(size, 368, 252, 150)
	contactBarH := chooseFontSize(size, 38, 28, 18)

	titleLines := headlineLines
	if len(titleLines) == 0 {
		titleLines = []string{"ONLINE MENU"}
	}
	if len(titleLines) > 2 {
		titleLines = titleLines[:2]
	}

	subtextCopy := subtextLines
	if len(subtextCopy) == 0 {
		subtextCopy = []string{"Browse our latest dishes, drinks,", "and prices on your phone."}
	}
	if len(subtextCopy) > 3 {
		subtextCopy = subtextCopy[:3]
	}

	infoCopy := footerLines
	if len(infoCopy) == 0 {
		infoCopy = []string{"Updated live for dine-in", "and takeaway."}
	}
	if len(infoCopy) > 3 {
		infoCopy = infoCopy[:3]
	}

	var b strings.Builder
	b.WriteString(svgOpen(width, height))
	b.WriteString(fmt.Sprintf(`<rect width="%d" height="%d" fill="%s"/>`, width, height, bgColor))
	b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" fill="%s"/>`, canvasX, canvasY, canvasW, headerH, headerBg))
	b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" fill="%s"/>`, canvasX, bodyY, canvasW, bodyH, charcoal))

	headerTextX := canvasX + headerPadX
	headerTextY := canvasY + headerPadY + tagFont
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="500" font-family="Inter, Arial, sans-serif" letter-spacing="1.2">%s</text>`,
		headerTextX, headerTextY, ink, tagFont, strings.ToUpper(escapeSVGText(firstNonEmpty(businessName, "Your Restaurant")+" presents"))))

	titleY := headerTextY + chooseFontSize(size, 42, 32, 20)
	for i, line := range titleLines {
		b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="800" font-family="Anton, Impact, Inter, Arial, sans-serif" letter-spacing="1">%s</text>`,
			headerTextX, titleY+(i*heroLineGap), deepRed, heroFont, line))
	}

	logoBadgeX := canvasX + canvasW - logoBadgeW
	b.WriteString(fmt.Sprintf(`<path d="M%d,%d h%d v%d q0,%d -%d,%d h-%d z" fill="%s"/>`,
		logoBadgeX, canvasY, logoBadgeW, headerH, chooseFontSize(size, 36, 28, 18), chooseFontSize(size, 36, 28, 18), chooseFontSize(size, 36, 28, 18), logoBadgeW-chooseFontSize(size, 36, 28, 18), deepRed))
	if settings.ShowLogo && logoDataURL != "" {
		logoSize := chooseFontSize(size, 88, 60, 38)
		logoX := logoBadgeX + (logoBadgeW-logoSize)/2
		logoY := canvasY + chooseFontSize(size, 24, 18, 12)
		b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="18" fill="%s"/>`, logoX, logoY, logoSize, logoSize, white))
		b.WriteString(fmt.Sprintf(`<image href="%s" x="%d" y="%d" width="%d" height="%d" preserveAspectRatio="xMidYMid slice"/>`, logoDataURL, logoX+8, logoY+8, logoSize-16, logoSize-16))
	}
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" text-anchor="middle" fill="%s" font-size="%d" font-weight="700" font-family="Inter, Arial, sans-serif">LOGO</text>`,
		logoBadgeX+(logoBadgeW/2), canvasY+chooseFontSize(size, 154, 108, 70), white, labelFont))

	b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="36" fill="%s"/>`,
		qrCardX, qrCardY, qrCardSize, qrCardSize, white))
	b.WriteString(fmt.Sprintf(`<image href="%s" x="%d" y="%d" width="%d" height="%d"/>`, qrDataURL, qrImageX, qrImageY, qrSize, qrSize))

	scanY := qrCardY + chooseFontSize(size, 78, 54, 30)
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="800" font-family="Inter, Arial, sans-serif">SCAN</text>`,
		rightColumnX, scanY, warmOrange, scanFont))
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="800" font-family="Inter, Arial, sans-serif">HERE</text>`,
		rightColumnX, scanY+scanFont-6, warmOrange, scanFont))
	writeTextBlock(&b, rightColumnX, scanY+(scanFont*2)-8, rightColumnW, subtextCopy, scanBodyFont, white, 1.16, 500)

	b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" fill="%s"/>`,
		infoCardX, infoCardY, infoCardW, infoCardH, deepRed))
	writeTextBlock(&b, infoCardX+chooseFontSize(size, 22, 16, 10), infoCardY+chooseFontSize(size, 38, 28, 18), infoCardW-chooseFontSize(size, 42, 30, 18), infoCopy, bodyFont, white, 1.12, 600)

	curveY := lowerY
	curveRight := leftPanelX + leftPanelW
	curveBottom := curveY + leftPanelH
	swoopDepth := chooseFontSize(size, 34, 24, 16)
	b.WriteString(fmt.Sprintf(`<path d="M%d,%d C%d,%d %d,%d %d,%d L%d,%d L%d,%d L%d,%d Z" fill="%s"/>`,
		leftPanelX, curveY,
		leftPanelX+chooseFontSize(size, 132, 92, 54), curveY+swoopDepth,
		leftPanelX+chooseFontSize(size, 290, 206, 126), curveY+swoopDepth,
		curveRight, curveY+chooseFontSize(size, 4, 3, 2),
		curveRight, curveBottom,
		leftPanelX, curveBottom,
		leftPanelX, curveY,
		deepRed))
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="700" font-family="Georgia, serif" font-style="italic">Eat Good Food</text>`,
		leftPanelX+chooseFontSize(size, 34, 24, 14), curveY+chooseFontSize(size, 102, 74, 40), white, scriptFont))
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="700" font-family="Georgia, serif" font-style="italic">Bring Back Mood</text>`,
		leftPanelX+chooseFontSize(size, 56, 38, 22), curveY+chooseFontSize(size, 152, 108, 62), white, chooseFontSize(size, 52, 36, 22)))
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="700" font-family="Georgia, serif" opacity="0.18">&#8220;</text>`,
		curveRight-chooseFontSize(size, 120, 86, 50), curveY+chooseFontSize(size, 146, 102, 58), white, quoteFont))
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="700" font-family="Anton, Impact, Inter, Arial, sans-serif">OPEN DAILY</text>`,
		leftPanelX+chooseFontSize(size, 36, 24, 14), curveY+chooseFontSize(size, 236, 166, 98), warmOrange, hoursLabelFont))
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-weight="800" font-family="Anton, Impact, Inter, Arial, sans-serif">10.00 AM - 10 PM</text>`,
		leftPanelX+chooseFontSize(size, 32, 22, 12), curveY+chooseFontSize(size, 316, 224, 134), white, hoursFont))

	contactBarY := curveBottom - chooseFontSize(size, 72, 52, 32)
	b.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="%d" fill="%s"/>`,
		leftPanelX+chooseFontSize(size, 42, 30, 18), contactBarY, contactBarW, contactBarH, chooseFontSize(size, 18, 14, 9), warmOrange))
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-family="Inter, Arial, sans-serif">%s</text>`,
		leftPanelX+chooseFontSize(size, 62, 44, 24), contactBarY+chooseFontSize(size, 25, 19, 12), white, bodyFont, firstNonEmpty(urlLine, "www.yoursite.com")))

	renderPosterTile(&b, rightTileX, tileStackY, rightTileSize, coverDataURL, white, warmOrange, bodyFont)
	renderPosterTile(&b, rightTileX, tileStackY+rightTileSize+rightTileGap, rightTileSize, coverDataURL, white, warmOrange, bodyFont)

	footerX := canvasX + chooseFontSize(size, 18, 12, 8)
	footerY := canvasY + canvasH - chooseFontSize(size, 74, 54, 34)
	if settings.ShowAddress && addressLine != "" {
		b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-family="Inter, Arial, sans-serif">%s</text>`,
			footerX, footerY, white, smallFont, addressLine))
		footerY += smallFont + 12
	}
	if settings.ShowURL && urlLine != "" {
		b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-family="Inter, Arial, sans-serif">%s</text>`,
			footerX, footerY, white, smallFont-1, urlLine))
	}
	b.WriteString(fmt.Sprintf(`<text x="%d" y="%d" fill="%s" font-size="%d" font-family="Inter, Arial, sans-serif">Designed for %s display stands</text>`,
		footerX, canvasY+canvasH-chooseFontSize(size, 16, 12, 8), white, smallFont, size.Label))

	b.WriteString(`</svg>`)
	return b.String()
}
func renderPosterTile(builder *strings.Builder, x, y, size int, imageDataURL, borderColor, fallbackColor string, fontSize int) {
	builder.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="20" fill="%s" stroke="%s" stroke-width="6"/>`,
		x, y, size, size, "#ffffff", borderColor))
	if imageDataURL != "" {
		builder.WriteString(fmt.Sprintf(`<image href="%s" x="%d" y="%d" width="%d" height="%d" preserveAspectRatio="xMidYMid slice"/>`,
			imageDataURL, x+8, y+8, size-16, size-16))
		return
	}
	builder.WriteString(fmt.Sprintf(`<rect x="%d" y="%d" width="%d" height="%d" rx="14" fill="%s"/>`,
		x+8, y+8, size-16, size-16, "#f3f4f6"))
	builder.WriteString(fmt.Sprintf(`<text x="%d" y="%d" text-anchor="middle" fill="%s" font-size="%d" font-weight="700" font-family="Inter, Arial, sans-serif">FOOD</text>`,
		x+(size/2), y+(size/2)+6, fallbackColor, fontSize+4))
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
