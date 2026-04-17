package menu

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html"
	"image/color"
	"io"
	"math"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"flash/models"
	"flash/utils"

	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

type posterPalette struct {
	Background  string
	Foreground  string
	Accent      string
	AccentFG    string
	Highlight   string
	HighlightFG string
	Muted       string
	Card        string
	Surface     string
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

const posterGoogleFontsURL = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Noto+Serif+Georgian:wght@100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Gamja+Flower&family=Delius+Swash+Caps&family=Gabriela&display=swap"

func (s *Service) GenerateDisplayPoster(request GenerateDisplayPosterRequest) (*GenerateDisplayPosterResponse, error) {
	settings := normalizeDisplayPosterSettings(request.DisplayPosterSettings)
	size := posterSizes[settings.Size]
	if size.Width == 0 || size.Height == 0 {
		size = posterSizes["a6"]
		settings.Size = "a6"
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
	previousImageURL := strings.TrimSpace(stringValue(menu.DisplayPosterImageURL))
	now := time.Now()

	err := s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.MenuDisplayPoster{}).
			Where("menu_id = ? AND is_deleted = ?", menu.ID, false).
			Updates(map[string]any{
				"is_deleted": true,
				"deleted_at": now,
			}).Error; err != nil {
			return fmt.Errorf("failed to mark previous display posters deleted: %w", err)
		}

		posterRecord := models.MenuDisplayPoster{
			MenuID:    menu.ID,
			ProjectID: uint64(request.ProjectID),
			ImageURL:  imageURL,
			Settings:  posterSettingsBytes(raw),
			IsDeleted: false,
		}
		if err := tx.Create(&posterRecord).Error; err != nil {
			return fmt.Errorf("failed to create display poster record: %w", err)
		}

		menu.DisplayPosterSettings = raw
		menu.DisplayPosterImageURL = &imageURL
		if err := tx.Save(&menu).Error; err != nil {
			return fmt.Errorf("failed to save display poster metadata: %w", err)
		}

		return nil
	})
	if err != nil {
		return err
	}

	if previousPath := storagePathFromURL(previousImageURL); previousPath != "" {
		if _, err := s.ObjectStorage.Delete(previousPath); err != nil {
			fmt.Printf("Failed to delete replaced display poster %q: %v\n", previousPath, err)
		}
	}

	return nil
}

func posterSettingsBytes(raw *json.RawMessage) []byte {
	if raw == nil {
		return nil
	}

	return []byte(*raw)
}

func stringValue(value *string) string {
	if value == nil {
		return ""
	}

	return *value
}

func storagePathFromURL(raw string) string {
	value := strings.TrimSpace(raw)
	if value == "" {
		return ""
	}

	publicBase := strings.TrimRight(strings.TrimSpace(os.Getenv("R2_PUBLIC_URL")), "/")
	if publicBase != "" {
		publicPrefix := publicBase + "/"
		if strings.HasPrefix(value, publicPrefix) {
			return strings.TrimPrefix(value, publicPrefix)
		}
	}

	parsed, err := url.Parse(value)
	if err == nil && parsed.Scheme != "" && parsed.Host != "" {
		return strings.TrimPrefix(parsed.Path, "/")
	}

	if strings.Contains(value, "://") {
		return ""
	}

	return strings.TrimPrefix(value, "/")
}

func normalizeDisplayPosterSettings(settings DisplayPosterSettingsRequest) DisplayPosterSettingsRequest {
	if settings.Template == "" {
		settings.Template = "clean"
	}
	if settings.Size == "" {
		settings.Size = "a6"
	}
	if settings.ColorMode == "" {
		settings.ColorMode = "light"
	}
	if len(settings.PreferredImages) > 2 {
		settings.PreferredImages = settings.PreferredImages[:2]
	}

	return settings
}

func posterFontHeadMarkup() string {
	return fmt.Sprintf(`<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="%s" />
  <link href="%s" rel="stylesheet" />`, html.EscapeString(posterGoogleFontsURL), html.EscapeString(posterGoogleFontsURL))
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
	case "brand":
		return renderBrandPosterHTML(request, settings, size, palette, qrDataURL, logoDataURL, coverDataURL)
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
	bodyFont := posterThemeFont(themeFontValue(request.Theme, settings.ColorMode, "font-sans"), "Arial, Helvetica, sans-serif")
	displayFont := posterThemeFont(themeFontValue(request.Theme, settings.ColorMode, "font-serif"), bodyFont)

	coverMarkup := ""
	if coverDataURL != "" {
		coverMarkup = fmt.Sprintf(`<div class="cover-wrap"><div class="cover-photo"><img src="%s" alt="Cover photo" /></div></div>`, html.EscapeString(coverDataURL))
	}

	logoMarkup := `<div class="logo-text">LOGO</div>`
	if logoDataURL != "" {
		logoMarkup = fmt.Sprintf(`<img src="%s" alt="Business logo" class="logo-image" />`, html.EscapeString(logoDataURL))
	}

	headlineMarkup := ""
	if strings.TrimSpace(settings.Headline) != "" {
		headlineMarkup = fmt.Sprintf(`<div class="headline">%s</div>`, html.EscapeString(strings.TrimSpace(settings.Headline)))
	}

	subtextMarkup := ""
	if strings.TrimSpace(settings.Subtext) != "" {
		subtextMarkup = fmt.Sprintf(`<div class="subtext">%s</div>`, html.EscapeString(strings.TrimSpace(settings.Subtext)))
	}

	footerNoteMarkup := ""
	if strings.TrimSpace(settings.FooterNote) != "" {
		footerNoteMarkup = fmt.Sprintf(`<div class="brand">%s</div>`, html.EscapeString(strings.TrimSpace(settings.FooterNote)))
	}

	template := `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Display Poster</title>
  {{FONT_HEAD}}
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --poster-bg: {{POSTER_BG}};
      --poster-fg: {{POSTER_FG}};
      --poster-accent: {{POSTER_ACCENT}};
      --poster-highlight: {{POSTER_HIGHLIGHT}};
      --poster-muted: {{POSTER_MUTED}};
      --poster-card: {{POSTER_CARD}};
      --poster-surface: {{POSTER_SURFACE}};
    }
    html, body {
      width: {{WIDTH}}px;
      height: {{HEIGHT}}px;
      overflow: hidden;
      font-family: {{POSTER_FONT_BODY}};
      background: var(--poster-bg);
      color: var(--poster-fg);
    }
    #poster-root {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: var(--poster-bg);
    }
    .poster {
      position: relative;
      width: 100%;
      height: 100%;
      background: var(--poster-bg);
      overflow: hidden;
    }
    .poster::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 58%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 20%, rgba(255,255,255,0.00) 42%),
        radial-gradient(circle at 50% 58%, color-mix(in srgb, var(--poster-highlight) 12%, transparent) 0%, transparent 52%);
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
        linear-gradient(180deg, rgba(17, 10, 10, 0.42) 0%, rgba(17, 10, 10, 0.18) 24%, color-mix(in srgb, var(--poster-bg) 18%, transparent) 44%, color-mix(in srgb, var(--poster-bg) 84%, transparent) 82%, var(--poster-bg) 100%),
        linear-gradient(180deg, color-mix(in srgb, var(--poster-accent) 12%, transparent), color-mix(in srgb, var(--poster-accent) 45%, transparent)),
        linear-gradient(90deg, color-mix(in srgb, var(--poster-bg) 18%, transparent), color-mix(in srgb, var(--poster-bg) 2%, transparent) 18%, color-mix(in srgb, var(--poster-bg) 2%, transparent) 82%, color-mix(in srgb, var(--poster-bg) 18%, transparent));
      z-index: 1;
    }
    .cover-wrap::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 38%;
      background: linear-gradient(180deg, color-mix(in srgb, var(--poster-bg) 0%, transparent) 0%, color-mix(in srgb, var(--poster-bg) 70%, transparent) 58%, var(--poster-bg) 100%);
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
    .logo-slot {
      position: absolute;
      left: 50%;
      top: 4.8%;
      transform: translateX(-50%);
      width: 52%;
      height: 12%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
    }
    .logo-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 4px 10px rgba(0,0,0,0.28));
    }
    .logo-text {
      font-family: {{POSTER_FONT_DISPLAY}};
      font-size: {{TITLE_SIZE}}px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.045em;
      color: var(--poster-fg);
      text-shadow:
        0 {{TITLE_SHADOW_Y}}px {{TITLE_SHADOW_BLUR}}px rgba(0,0,0,0.42),
        0 0 {{TITLE_GLOW}}px rgba(0,0,0,0.20);
    }
    .qr-card {
      position: absolute;
      left: 50%;
      top: 21.5%;
      transform: translateX(-50%);
      width: 70%;
      aspect-ratio: 1 / 1;
      background: var(--poster-card);
      border: {{QR_FRAME}}px solid color-mix(in srgb, var(--poster-surface) 88%, white);
      box-shadow:
        0 {{QR_SHADOW_Y}}px {{QR_SHADOW_BLUR}}px rgba(0,0,0,0.16),
        0 0 {{QR_GLOW}}px color-mix(in srgb, var(--poster-card) 18%, transparent),
        0 0 {{QR_GLOW_WARM}}px color-mix(in srgb, var(--poster-accent) 12%, transparent);
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
    .brand {
      font-family: {{POSTER_FONT_BODY}};
      position: absolute;
      left: 50%;
      bottom: 5.6%;
      transform: translateX(-50%);
      width: 76%;
      font-size: {{FOOTER_SIZE}}px;
      font-weight: 500;
      line-height: 1.28;
      letter-spacing: -0.015em;
      color: var(--poster-fg);
      z-index: 3;
      text-align: center;
      text-wrap: balance;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .headline {
      font-family: {{POSTER_FONT_DISPLAY}};
      position: absolute;
      left: 50%;
      bottom: 15.8%;
      transform: translateX(-50%);
      width: 82%;
      font-size: {{HEADLINE_SIZE}}px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.025em;
      color: var(--poster-fg);
      z-index: 3;
      text-align: center;
      text-wrap: balance;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .subtext {
      font-family: {{POSTER_FONT_BODY}};
      position: absolute;
      left: 50%;
      bottom: 9.8%;
      transform: translateX(-50%);
      width: 82%;
      font-size: {{SUBTEXT_SIZE}}px;
      font-weight: 500;
      line-height: 1.28;
      letter-spacing: -0.01em;
      color: color-mix(in srgb, var(--poster-fg) 88%, transparent);
      z-index: 3;
      text-align: center;
      text-wrap: balance;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <div id="poster-root">
    <div class="poster">
      {{COVER}}
      <div class="cover-vignette"></div>
      <div class="logo-slot">{{LOGO}}</div>
      <div class="qr-card">
        <img src="{{QR_URL}}" alt="QR code" />
      </div>
      {{HEADLINE}}
      {{SUBTEXT}}
      {{FOOTER_NOTE}}
    </div>
  </div>
</body>
</html>`

	replacements := []string{
		"{{FONT_HEAD}}", posterFontHeadMarkup(),
		"{{WIDTH}}", fmt.Sprintf("%d", size.Width),
		"{{HEIGHT}}", fmt.Sprintf("%d", size.Height),
		"{{POSTER_BG}}", html.EscapeString(palette.Background),
		"{{POSTER_FG}}", html.EscapeString(palette.Foreground),
		"{{POSTER_ACCENT}}", html.EscapeString(palette.Accent),
		"{{POSTER_HIGHLIGHT}}", html.EscapeString(palette.Highlight),
		"{{POSTER_MUTED}}", html.EscapeString(palette.Muted),
		"{{POSTER_CARD}}", html.EscapeString(palette.Card),
		"{{POSTER_SURFACE}}", html.EscapeString(palette.Surface),
		"{{POSTER_FONT_BODY}}", html.EscapeString(bodyFont),
		"{{POSTER_FONT_DISPLAY}}", html.EscapeString(displayFont),
		"{{COVER_HEIGHT}}", fmt.Sprintf("%d", chooseFontSize(size, 560, 394, 278)),
		"{{TITLE_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 126, 88, 60)),
		"{{TITLE_SHADOW_Y}}", fmt.Sprintf("%d", chooseFontSize(size, 4, 3, 2)),
		"{{TITLE_SHADOW_BLUR}}", fmt.Sprintf("%d", chooseFontSize(size, 10, 7, 5)),
		"{{TITLE_GLOW}}", fmt.Sprintf("%d", chooseFontSize(size, 20, 14, 9)),
		"{{QR_FRAME}}", fmt.Sprintf("%d", chooseFontSize(size, 7, 5, 4)),
		"{{QR_SHADOW_Y}}", fmt.Sprintf("%d", chooseFontSize(size, 8, 5, 4)),
		"{{QR_SHADOW_BLUR}}", fmt.Sprintf("%d", chooseFontSize(size, 18, 12, 8)),
		"{{QR_GLOW}}", fmt.Sprintf("%d", chooseFontSize(size, 32, 22, 14)),
		"{{QR_PAD}}", fmt.Sprintf("%d", chooseFontSize(size, 2, 2, 1)),
		"{{QR_GLOW_WARM}}", fmt.Sprintf("%d", chooseFontSize(size, 52, 34, 22)),
		"{{HEADLINE_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 88, 58, 40)),
		"{{SUBTEXT_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 40, 28, 20)),
		"{{FOOTER_SIZE}}", fmt.Sprintf("%d", chooseFontSize(size, 30, 22, 15)),
		"{{COVER}}", coverMarkup,
		"{{LOGO}}", logoMarkup,
		"{{HEADLINE}}", headlineMarkup,
		"{{SUBTEXT}}", subtextMarkup,
		"{{FOOTER_NOTE}}", footerNoteMarkup,
		"{{QR_URL}}", html.EscapeString(qrDataURL),
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
	_ = coverDataURL

	scaleX := float64(size.Width) / 800.0
	scaleY := float64(size.Height) / 800.0
	scaleText := math.Min(scaleX, scaleY)
	bodyFont := posterThemeFont(themeFontValue(request.Theme, settings.ColorMode, "font-sans"), "Montserrat, sans-serif")
	displayFont := posterThemeFont(themeFontValue(request.Theme, settings.ColorMode, "font-serif"), bodyFont)
	monoFont := posterThemeFont(themeFontValue(request.Theme, settings.ColorMode, "font-mono"), bodyFont)
	primaryColor := palette.Accent
	if strings.TrimSpace(primaryColor) == "" {
		primaryColor = "#c3252a"
	}
	primaryForeground := palette.AccentFG
	if strings.TrimSpace(primaryForeground) == "" {
		primaryForeground = "#ffffff"
	}
	backgroundColor := palette.Background
	if strings.TrimSpace(backgroundColor) == "" {
		backgroundColor = "#fdfdfd"
	}
	foregroundColor := palette.Foreground
	if strings.TrimSpace(foregroundColor) == "" {
		foregroundColor = "#222222"
	}
	mutedColor := palette.Muted
	if strings.TrimSpace(mutedColor) == "" {
		mutedColor = "#555555"
	}
	accentColor := primaryColor
	accentForeground := primaryForeground
	qrPanelColor := firstNonEmpty(themeSurfaceValue(request.Theme, settings.ColorMode), "#ebebeb")
	if strings.TrimSpace(qrPanelColor) == "" {
		qrPanelColor = "#ebebeb"
	}
	pillColor := backgroundColor
	pillForeground := foregroundColor

	logoMarkup := ""
	if logoDataURL != "" {
		logoMarkup = fmt.Sprintf(`<div class="logo-wrap"><img src="%s" alt="Business logo" class="logo-image" /></div>`, html.EscapeString(logoDataURL))
	}

	addressMarkup := ""
	if address := strings.TrimSpace(composePosterAddress(request.Address, request.City)); address != "" {
		addressMarkup = fmt.Sprintf(`<div class="store-address">%s</div>`, html.EscapeString(address))
	}

	rightImageURLs := []string{
		"https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=400&q=80",
		"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
	}

	preferredGalleryImages := posterPreferredBrandImages(settings.PreferredImages, request.GalleryImages)
	for index, raw := range preferredGalleryImages {
		dataURL, err := fetchRemoteImageAsDataURL(&raw)
		if err != nil || strings.TrimSpace(dataURL) == "" {
			continue
		}
		rightImageURLs[index] = dataURL
	}

	contactMarkup := buildPosterBrandContactHTML(request.Phone, request.SocialLinks)
	websiteDisplay := posterDisplayURL(request.WebsiteURL, request.MenuURL)
	if websiteDisplay == "" {
		websiteDisplay = "www.yoursite.com"
	}
	hoursLabel, hoursValue := posterBusinessHoursSummary(request.BusinessHours)
	footerNoteMarkup := ""
	if strings.TrimSpace(settings.FooterNote) != "" {
		footerNoteMarkup = fmt.Sprintf(`<div class="footer-note">%s</div>`, html.EscapeString(strings.TrimSpace(settings.FooterNote)))
	}
	headerSubtitle := strings.TrimSpace(settings.Headline)
	if headerSubtitle == "" {
		headerSubtitle = "Your Restaurant Present"
	}
	headerTitle := strings.TrimSpace(request.Name)
	if headerTitle == "" {
		headerTitle = "Online Menu"
	}
	scanTitle := strings.TrimSpace(settings.Subtext)
	if scanTitle == "" {
		scanTitle = "Scan Here"
	}
	scanSubtitle := "To View Our Menu Online"

	template := `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Display Poster</title>
  {{FONT_HEAD}}
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: {{WIDTH}}px;
      height: {{HEIGHT}}px;
      overflow: hidden;
      background-color: #e5e5e5;
    }
    #poster-root {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #e5e5e5;
    }
    .poster {
      width: 100%;
      height: 100%;
      background-color: #fdfdfd;
      position: relative;
      overflow: hidden;
      font-family: {{POSTER_FONT_BODY}};
    }
    .header-white {
      position: absolute;
      top: {{HEADER_WHITE_TOP}}px;
      left: 0;
      right: 0;
      height: {{HEADER_WHITE_HEIGHT}}px;
      background: {{BACKGROUND_COLOR}};
      z-index: 1;
    }
    .base-white {
      position: absolute;
      top: {{BASE_WHITE_TOP}}px;
      left: 0;
      right: 0;
      bottom: 0;
      background: {{BACKGROUND_COLOR}};
      z-index: 1;
    }
    .bg-gray {
      position: absolute;
      top: {{BG_GRAY_TOP}}px;
      left: {{BG_GRAY_LEFT}}px;
      width: {{BG_GRAY_WIDTH}}px;
      height: {{BG_GRAY_HEIGHT}}px;
      background-color: {{QR_PANEL_COLOR}};
      border-top-left-radius: {{GRAY_RADIUS}}px;
      z-index: 2;
    }
    .bg-red {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: {{BG_RED_HEIGHT}}px;
      background-color: {{PRIMARY_COLOR}};
      border-top-left-radius: {{RED_RADIUS}}px;
      z-index: 3;
    }
    .header-group {
      position: absolute;
      top: {{HEADER_TOP}}px;
      left: {{HEADER_LEFT}}px;
      width: {{HEADER_WIDTH}}px;
      z-index: 5;
    }
    .subtitle {
      font-size: {{SUBTITLE_SIZE}}px;
      color: {{MUTED_COLOR}};
      letter-spacing: 0.5px;
      margin-bottom: 2px;
      text-transform: uppercase;
      font-weight: 500;
    }
    .title {
      font-family: {{POSTER_FONT_DISPLAY}};
      font-size: {{TITLE_SIZE}}px;
      color: {{FOREGROUND_COLOR}};
      line-height: 0.96;
      letter-spacing: 0.2px;
    }
    .logo-wrap {
      position: absolute;
      top: {{LOGO_TOP}}px;
      right: {{LOGO_RIGHT}}px;
      width: {{LOGO_WIDTH}}px;
      height: {{LOGO_HEIGHT}}px;
      z-index: 6;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .qr-container {
      position: absolute;
      top: {{QR_TOP}}px;
      left: {{QR_LEFT}}px;
      width: {{QR_SIZE}}px;
      height: {{QR_SIZE}}px;
      background: white;
      border-radius: {{QR_RADIUS}}px;
      padding: {{QR_PAD}}px;
      box-shadow: 0 {{QR_SHADOW_Y}}px {{QR_SHADOW_BLUR}}px rgba(0, 0, 0, 0.1);
      z-index: 6;
    }
    .qr-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .scan-group {
      position: absolute;
      top: {{SCAN_TOP}}px;
      left: {{SCAN_LEFT}}px;
      width: {{SCAN_WIDTH}}px;
      z-index: 5;
    }
    .scan-title {
      font-family: {{POSTER_FONT_DISPLAY}};
      font-size: {{SCAN_TITLE_SIZE}}px;
      color: {{ACCENT_COLOR}};
      line-height: 1;
      text-wrap: balance;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .scan-subtitle {
      font-size: {{SCAN_SUBTITLE_SIZE}}px;
      color: {{FOREGROUND_COLOR}};
      margin-top: 8px;
      line-height: 1.2;
      font-weight: 400;
      text-wrap: balance;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .schedule-group {
      position: absolute;
      top: {{SCHEDULE_TOP}}px;
      left: {{SCHEDULE_LEFT}}px;
      width: {{SCHEDULE_WIDTH}}px;
      z-index: 5;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .open-daily {
      color: {{PRIMARY_FOREGROUND}};
      font-size: {{OPEN_DAILY_SIZE}}px;
      font-weight: 600;
      font-style: italic;
      line-height: 1.15;
      max-width: 100%;
    }
    .time {
      font-family: {{POSTER_FONT_MONO}};
      font-size: {{TIME_SIZE}}px;
      color: {{PRIMARY_FOREGROUND}};
      line-height: 1.1;
      letter-spacing: -0.5px;
      max-width: 100%;
    }
    .store-address {
      margin-top: {{ADDRESS_MARGIN_TOP}}px;
      font-size: {{ADDRESS_SIZE}}px;
      line-height: 1.3;
      font-weight: 500;
      color: {{PRIMARY_FOREGROUND}};
      opacity: 0.92;
      max-width: 100%;
      white-space: normal;
    }
    .schedule-meta {
      margin-top: {{SCHEDULE_META_MARGIN_TOP}}px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: {{SCHEDULE_META_GAP}}px;
      max-width: 100%;
    }
    .contact-group {
      background-color: {{PILL_COLOR}};
      border-radius: {{CONTACT_RADIUS}}px;
      padding: {{CONTACT_PAD_Y}}px {{CONTACT_PAD_X}}px;
      display: flex;
      align-items: center;
      gap: {{CONTACT_GAP}}px;
      flex-wrap: wrap;
      max-width: 100%;
    }
    .contact-item {
      color: {{PILL_FOREGROUND}};
      font-size: {{CONTACT_SIZE}}px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .website {
      color: {{PRIMARY_FOREGROUND}};
      font-size: {{WEBSITE_SIZE}}px;
      margin-top: 5px;
      line-height: 1.25;
      opacity: 0.92;
    }
    .website strong {
      font-weight: 700;
    }
    .footer-note {
      position: absolute;
      left: 50%;
      bottom: {{FOOTER_BOTTOM}}px;
      transform: translateX(-50%);
      width: {{FOOTER_WIDTH}}px;
      font-size: {{FOOTER_NOTE_SIZE}}px;
      line-height: 1.26;
      font-weight: 500;
      color: {{PRIMARY_FOREGROUND}};
      opacity: 0.94;
      text-align: center;
      text-wrap: balance;
      overflow-wrap: anywhere;
      word-break: break-word;
      z-index: 6;
    }
    .food-images {
      position: absolute;
      top: {{FOOD_TOP}}px;
      left: {{FOOD_LEFT}}px;
      width: {{FOOD_WIDTH}}px;
      display: flex;
      flex-direction: column;
      gap: {{FOOD_GAP}}px;
      z-index: 5;
    }
    .food-box {
      width: 100%;
      height: {{FOOD_BOX_HEIGHT}}px;
      background: white;
      border-radius: {{FOOD_RADIUS}}px;
      padding: {{FOOD_PAD}}px;
      box-shadow: 0 {{FOOD_SHADOW_Y}}px {{FOOD_SHADOW_BLUR}}px rgba(0, 0, 0, 0.15);
    }
    .food-box img {
      width: 100%;
      height: 100%;
      border-radius: {{FOOD_IMAGE_RADIUS}}px;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div id="poster-root">
    <div class="poster">
      <div class="base-white"></div>
      <div class="header-white"></div>
      <div class="bg-gray"></div>
      <div class="bg-red"></div>

      <div class="header-group">
        <div class="subtitle">{{HEADER_SUBTITLE}}</div>
        <div class="title">{{HEADER_TITLE}}</div>
      </div>

      {{LOGO}}

      <div class="qr-container">
        <img
          src="{{QR_URL}}"
          alt="QR Code"
        />
      </div>

      <div class="scan-group">
        <div class="scan-title">{{SCAN_TITLE}}</div>
        <div class="scan-subtitle">{{SCAN_SUBTITLE}}</div>
      </div>

      <div class="food-images">
        <div class="food-box">
          <img
            src="{{RIGHT_IMAGE_1}}"
            alt="Plated Sausages"
          />
        </div>
        <div class="food-box">
          <img
            src="{{RIGHT_IMAGE_2}}"
            alt="Fresh Salad Bowl"
          />
        </div>
      </div>

      <div class="schedule-group">
        <div class="open-daily">{{HOURS_LABEL}}</div>
        <div class="time">{{HOURS_VALUE}}</div>
        {{ADDRESS}}
        <div class="schedule-meta">
          {{CONTACT}}
          <div class="website">
            For More Information <strong>{{WEBSITE_DOMAIN}}</strong>
          </div>
        </div>
      </div>

      {{FOOTER_NOTE}}
    </div>
  </div>
</body>
</html>`

	replacements := []string{
		"{{FONT_HEAD}}", posterFontHeadMarkup(),
		"{{WIDTH}}", fmt.Sprintf("%d", size.Width),
		"{{HEIGHT}}", fmt.Sprintf("%d", size.Height),
		"{{POSTER_FONT_BODY}}", html.EscapeString(bodyFont),
		"{{POSTER_FONT_DISPLAY}}", html.EscapeString(displayFont),
		"{{POSTER_FONT_MONO}}", html.EscapeString(monoFont),
		"{{PRIMARY_COLOR}}", html.EscapeString(primaryColor),
		"{{PRIMARY_FOREGROUND}}", html.EscapeString(primaryForeground),
		"{{BACKGROUND_COLOR}}", html.EscapeString(backgroundColor),
		"{{FOREGROUND_COLOR}}", html.EscapeString(foregroundColor),
		"{{MUTED_COLOR}}", html.EscapeString(mutedColor),
		"{{ACCENT_COLOR}}", html.EscapeString(accentColor),
		"{{ACCENT_FOREGROUND}}", html.EscapeString(accentForeground),
		"{{QR_PANEL_COLOR}}", html.EscapeString(qrPanelColor),
		"{{PILL_COLOR}}", html.EscapeString(pillColor),
		"{{PILL_FOREGROUND}}", html.EscapeString(pillForeground),
		"{{HEADER_WHITE_TOP}}", "0",
		"{{HEADER_WHITE_HEIGHT}}", fmt.Sprintf("%d", posterScale(scaleY, 210)),
		"{{BASE_WHITE_TOP}}", "0",
		"{{BG_GRAY_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 228)),
		"{{BG_GRAY_LEFT}}", fmt.Sprintf("%d", posterScale(scaleX, 60)),
		"{{BG_GRAY_WIDTH}}", fmt.Sprintf("%d", posterScale(scaleX, 740)),
		"{{BG_GRAY_HEIGHT}}", fmt.Sprintf("%d", posterScale(scaleY, 246)),
		"{{BG_RED_HEIGHT}}", fmt.Sprintf("%d", posterScale(scaleY, 440)),
		"{{HEADER_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 70)),
		"{{HEADER_LEFT}}", fmt.Sprintf("%d", posterScale(scaleX, 70)),
		"{{HEADER_WIDTH}}", fmt.Sprintf("%d", posterScale(scaleX, 500)),
		"{{LOGO_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 22)),
		"{{LOGO_RIGHT}}", fmt.Sprintf("%d", posterScale(scaleX, 58)),
		"{{LOGO_WIDTH}}", fmt.Sprintf("%d", posterScale(scaleX, 110)),
		"{{LOGO_HEIGHT}}", fmt.Sprintf("%d", posterScale(scaleY, 88)),
		"{{QR_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 236)),
		"{{QR_LEFT}}", fmt.Sprintf("%d", posterScale(scaleX, 70)),
		"{{QR_SIZE}}", fmt.Sprintf("%d", posterScale(scaleX, 350)),
		"{{SCAN_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 250)),
		"{{SCAN_LEFT}}", fmt.Sprintf("%d", posterScale(scaleX, 450)),
		"{{SCAN_WIDTH}}", fmt.Sprintf("%d", posterScale(scaleX, 250)),
		"{{FOOTER_BOTTOM}}", fmt.Sprintf("%d", posterScale(scaleY, 42)),
		"{{FOOTER_WIDTH}}", fmt.Sprintf("%d", posterScale(scaleX, 520)),
		"{{SCHEDULE_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 520)),
		"{{SCHEDULE_LEFT}}", fmt.Sprintf("%d", posterScale(scaleX, 70)),
		"{{SCHEDULE_WIDTH}}", fmt.Sprintf("%d", posterScale(scaleX, 320)),
		"{{FOOD_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 380)),
		"{{FOOD_LEFT}}", fmt.Sprintf("%d", posterScale(scaleX, 450)),
		"{{FOOD_WIDTH}}", fmt.Sprintf("%d", posterScale(scaleX, 290)),
		"{{GRAY_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 40, 28, 20)),
		"{{RED_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 120, 84, 60)),
		"{{SUBTITLE_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 16)),
		"{{TITLE_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 74)),
		"{{QR_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 25, 18, 14)),
		"{{QR_PAD}}", fmt.Sprintf("%d", posterScale(scaleX, 22)),
		"{{QR_SHADOW_Y}}", fmt.Sprintf("%d", posterScale(scaleY, 10)),
		"{{QR_SHADOW_BLUR}}", fmt.Sprintf("%d", posterScale(scaleY, 25)),
		"{{SCAN_TITLE_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 44)),
		"{{SCAN_SUBTITLE_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 18)),
		"{{BOTTOM_GAP}}", fmt.Sprintf("%d", posterScale(scaleY, 15)),
		"{{OPEN_DAILY_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 17)),
		"{{TIME_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 34)),
		"{{ADDRESS_MARGIN_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 8)),
		"{{ADDRESS_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 16)),
		"{{SCHEDULE_META_MARGIN_TOP}}", fmt.Sprintf("%d", posterScale(scaleY, 20)),
		"{{SCHEDULE_META_GAP}}", fmt.Sprintf("%d", posterScale(scaleY, 12)),
		"{{CONTACT_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 25, 18, 12)),
		"{{CONTACT_PAD_Y}}", fmt.Sprintf("%d", posterScale(scaleY, 8)),
		"{{CONTACT_PAD_X}}", fmt.Sprintf("%d", posterScale(scaleX, 20)),
		"{{CONTACT_GAP}}", fmt.Sprintf("%d", posterScale(scaleX, 20)),
		"{{CONTACT_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 13)),
		"{{WEBSITE_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 14)),
		"{{FOOTER_NOTE_SIZE}}", fmt.Sprintf("%d", posterScale(scaleText, 15)),
		"{{FOOD_GAP}}", fmt.Sprintf("%d", posterScale(scaleY, 18)),
		"{{FOOD_BOX_HEIGHT}}", fmt.Sprintf("%d", posterScale(scaleY, 165)),
		"{{FOOD_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 15, 11, 8)),
		"{{FOOD_PAD}}", fmt.Sprintf("%d", posterScale(scaleX, 6)),
		"{{FOOD_SHADOW_Y}}", fmt.Sprintf("%d", posterScale(scaleY, 5)),
		"{{FOOD_SHADOW_BLUR}}", fmt.Sprintf("%d", posterScale(scaleY, 15)),
		"{{FOOD_IMAGE_RADIUS}}", fmt.Sprintf("%d", chooseFontSize(size, 10, 8, 6)),
		"{{LOGO}}", logoMarkup,
		"{{ADDRESS}}", addressMarkup,
		"{{CONTACT}}", contactMarkup,
		"{{FOOTER_NOTE}}", footerNoteMarkup,
		"{{HOURS_LABEL}}", html.EscapeString(hoursLabel),
		"{{HOURS_VALUE}}", html.EscapeString(hoursValue),
		"{{WEBSITE_DOMAIN}}", html.EscapeString(websiteDisplay),
		"{{HEADER_SUBTITLE}}", html.EscapeString(strings.ToUpper(headerSubtitle)),
		"{{HEADER_TITLE}}", html.EscapeString(strings.ToUpper(headerTitle)),
		"{{SCAN_TITLE}}", html.EscapeString(strings.ToUpper(scanTitle)),
		"{{SCAN_SUBTITLE}}", strings.ReplaceAll(html.EscapeString(strings.ToUpper(scanSubtitle)), "\n", "<br />"),
		"{{RIGHT_IMAGE_1}}", html.EscapeString(rightImageURLs[0]),
		"{{RIGHT_IMAGE_2}}", html.EscapeString(rightImageURLs[1]),
		"{{QR_URL}}", html.EscapeString(qrDataURL),
	}

	return strings.NewReplacer(replacements...).Replace(template)
}

func buildPosterPalette(theme *ThemeRequest, colorMode string) posterPalette {
	fallback := posterPalette{
		Background:  "#fff9f4",
		Foreground:  "#111111",
		Accent:      "#d63a32",
		AccentFG:    "#ffffff",
		Highlight:   "#eb8b1c",
		HighlightFG: "#111111",
		Muted:       "#5f5b57",
		Card:        "#ffffff",
		Surface:     "#f1ece6",
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
	primaryFG := firstNonEmpty(styles["primary-foreground"], styles["accent-foreground"], fallback.AccentFG)
	secondary := firstNonEmpty(styles["secondary"], styles["accent"], fallback.Highlight)
	secondaryFG := firstNonEmpty(styles["secondary-foreground"], styles["accent-foreground"], fallback.HighlightFG)

	background := firstNonEmpty(styles["background"], fallback.Background)
	foreground := firstNonEmpty(styles["foreground"], fallback.Foreground)
	muted := firstNonEmpty(styles["muted-foreground"], styles["foreground"], fallback.Muted)
	card := firstNonEmpty(styles["card"], styles["popover"], "#ffffff", fallback.Card)
	surface := firstNonEmpty(styles["secondary"], styles["muted"], styles["card"], fallback.Surface)

	return posterPalette{
		Background:  background,
		Foreground:  foreground,
		Accent:      primary,
		AccentFG:    primaryFG,
		Highlight:   secondary,
		HighlightFG: secondaryFG,
		Muted:       muted,
		Card:        card,
		Surface:     surface,
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

func themeSurfaceValue(theme *ThemeRequest, colorMode string) string {
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

	return firstNonEmpty(styles["muted"], styles["card"], styles["secondary"])
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

func posterScale(scale float64, value int) int {
	return int(math.Round(scale * float64(value)))
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

func posterBusinessHoursSummary(entries []BusinessHoursEntryRequest) (string, string) {
	if len(entries) == 0 {
		return "SCAN TO VIEW", "MENU ONLINE"
	}

	openEntries := make([]BusinessHoursEntryRequest, 0, len(entries))
	sameHours := true
	var baseline string

	for _, entry := range entries {
		if entry.Closed {
			continue
		}
		openEntries = append(openEntries, entry)
		current := strings.TrimSpace(entry.Open) + "-" + strings.TrimSpace(entry.Close)
		if baseline == "" {
			baseline = current
			continue
		}
		if current != baseline {
			sameHours = false
		}
	}

	if len(openEntries) == 0 {
		return "CHECK MENU", "FOR HOURS"
	}

	if len(openEntries) == len(entries) && sameHours {
		return "OPEN DAILY", posterFormatHourRange(openEntries[0].Open, openEntries[0].Close)
	}

	dayLabel := posterOpenDayLabel(openEntries)
	if sameHours {
		return dayLabel, posterFormatHourRange(openEntries[0].Open, openEntries[0].Close)
	}

	return dayLabel, "HOURS VARY BY DAY"
}

func posterPreferredBrandImages(preferredImages, galleryImages []string) []string {
	selected := make([]string, 0, 2)
	seen := make(map[string]bool, 2)

	appendUnique := func(images []string) {
		for _, imageURL := range images {
			trimmed := strings.TrimSpace(imageURL)
			if trimmed == "" || seen[trimmed] {
				continue
			}
			seen[trimmed] = true
			selected = append(selected, trimmed)
			if len(selected) == 2 {
				return
			}
		}
	}

	appendUnique(preferredImages)
	if len(selected) < 2 {
		appendUnique(galleryImages)
	}

	return selected
}

func posterOpenDayLabel(entries []BusinessHoursEntryRequest) string {
	order := posterDayOrder()
	openByDay := make(map[string]bool, len(entries))
	for _, entry := range entries {
		day := posterNormalizeDay(entry.Day)
		if day == "" {
			continue
		}
		openByDay[day] = true
	}

	groups := make([]string, 0, 3)
	var current []string

	flush := func() {
		if len(current) == 0 {
			return
		}
		if len(current) == 1 {
			groups = append(groups, posterShortDay(current[0]))
		} else {
			groups = append(groups, posterShortDay(current[0])+" - "+posterShortDay(current[len(current)-1]))
		}
		current = nil
	}

	for _, day := range order {
		if openByDay[day] {
			current = append(current, day)
			continue
		}
		flush()
	}
	flush()

	if len(groups) == 0 {
		return "CHECK MENU"
	}

	if len(groups) == 1 {
		return groups[0]
	}

	return strings.Join(groups, ", ")
}

func posterDayOrder() []string {
	return []string{"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"}
}

func posterNormalizeDay(value string) string {
	trimmed := strings.ToLower(strings.TrimSpace(value))
	switch trimmed {
	case "mon", "monday":
		return "monday"
	case "tue", "tues", "tuesday":
		return "tuesday"
	case "wed", "wednesday":
		return "wednesday"
	case "thu", "thur", "thurs", "thursday":
		return "thursday"
	case "fri", "friday":
		return "friday"
	case "sat", "saturday":
		return "saturday"
	case "sun", "sunday":
		return "sunday"
	default:
		return ""
	}
}

func posterShortDay(day string) string {
	switch day {
	case "monday":
		return "MON"
	case "tuesday":
		return "TUE"
	case "wednesday":
		return "WED"
	case "thursday":
		return "THU"
	case "friday":
		return "FRI"
	case "saturday":
		return "SAT"
	case "sunday":
		return "SUN"
	default:
		return strings.ToUpper(strings.TrimSpace(day))
	}
}

func posterFormatHourRange(open, close string) string {
	openValue := posterFormatHour(open)
	closeValue := posterFormatHour(close)
	if openValue == "" || closeValue == "" {
		return "SEE MENU FOR HOURS"
	}
	return openValue + " - " + closeValue
}

func posterFormatHour(value string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return ""
	}

	parsed, err := time.Parse("15:04", trimmed)
	if err != nil {
		return strings.ToUpper(trimmed)
	}

	return strings.ToUpper(parsed.Format("3:04PM"))
}

func buildPosterBrandContactHTML(phone *string, socialLinks []SocialLinkRequest) string {
	items := make([]string, 0, 2)

	if phone != nil && strings.TrimSpace(*phone) != "" {
		items = append(items, fmt.Sprintf(
			`<div class="contact-item"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>%s</div>`,
			html.EscapeString(strings.TrimSpace(*phone)),
		))
	}

	for _, link := range socialLinks {
		if !strings.EqualFold(strings.TrimSpace(link.Platform), "instagram") {
			continue
		}
		display := posterSocialDisplay(link)
		if display == "" {
			continue
		}
		items = append(items, fmt.Sprintf(
			`<div class="contact-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>%s</div>`,
			html.EscapeString(display),
		))
		break
	}

	if len(items) == 0 {
		return ""
	}

	return `<div class="contact-group">` + strings.Join(items, "") + `</div>`
}

func posterSocialDisplay(link SocialLinkRequest) string {
	platform := strings.ToLower(strings.TrimSpace(link.Platform))
	raw := strings.TrimSpace(link.URL)
	if raw == "" {
		return ""
	}

	if platform == "website" {
		return ""
	}

	display := raw
	display = strings.TrimPrefix(display, "https://")
	display = strings.TrimPrefix(display, "http://")
	display = strings.TrimPrefix(display, "www.")
	display = strings.TrimSuffix(display, "/")

	if slash := strings.LastIndex(display, "/"); slash >= 0 && slash < len(display)-1 {
		handle := strings.Trim(display[slash+1:], "@ ")
		if handle != "" {
			return "@" + handle
		}
	}

	return display
}

func posterInitials(name string) string {
	parts := strings.Fields(strings.TrimSpace(name))
	if len(parts) == 0 {
		return "QR"
	}

	initials := make([]rune, 0, 2)
	for _, part := range parts {
		runes := []rune(part)
		if len(runes) == 0 {
			continue
		}
		initials = append(initials, []rune(strings.ToUpper(string(runes[0])))...)
		if len(initials) >= 2 {
			break
		}
	}

	if len(initials) == 0 {
		return "QR"
	}

	return string(initials)
}

func posterLogoName(name string) string {
	parts := strings.Fields(strings.TrimSpace(name))
	if len(parts) == 0 {
		return "LOGO"
	}
	if len(parts) == 1 {
		return parts[0]
	}
	return parts[0] + " " + parts[1]
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
