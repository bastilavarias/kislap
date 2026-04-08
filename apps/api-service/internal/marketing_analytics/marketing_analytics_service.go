package marketing_analytics

import (
	"encoding/json"
	"flash/models"
	"net/url"
	"strings"
	"time"

	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

type OverviewResponse struct {
	Totals          OverviewTotals     `json:"totals"`
	Trend           TrendSeries        `json:"trend"`
	TopPages        []PageMetric       `json:"top_pages"`
	EventBreakdown  []LabelValueMetric `json:"event_breakdown"`
	SourceBreakdown []LabelValueMetric `json:"source_breakdown"`
}

type OverviewTotals struct {
	TotalSessions          int64   `json:"total_sessions"`
	UniqueVisitors         int64   `json:"unique_visitors"`
	TotalPageViews         int64   `json:"total_page_views"`
	TotalClicks            int64   `json:"total_clicks"`
	AverageDurationSeconds float64 `json:"average_duration_seconds"`
	BounceRate             float64 `json:"bounce_rate"`
}

type TrendSeries struct {
	Labels    []string `json:"labels"`
	Sessions  []int64  `json:"sessions"`
	PageViews []int64  `json:"page_views"`
	Clicks    []int64  `json:"clicks"`
}

type PageMetric struct {
	Label  string `json:"label"`
	Views  int64  `json:"views"`
	Clicks int64  `json:"clicks"`
}

type LabelValueMetric struct {
	Label string `json:"label"`
	Total int64  `json:"total"`
}

type trendRow struct {
	Date  string
	Total int64
}

type labelRow struct {
	Label string
	Total int64
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

func (service Service) StartSession(request StartSessionRequest, ipAddress string) (*models.MarketingSession, error) {
	now := time.Now()

	var session models.MarketingSession
	err := service.DB.Where("session_key = ?", request.SessionKey).First(&session).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	sourceLabel := deriveSourceLabel(request.Referrer, request.UTMSource)

	if err == gorm.ErrRecordNotFound {
		session = models.MarketingSession{
			SessionKey:      request.SessionKey,
			VisitorKey:      request.VisitorKey,
			EntryPage:       request.PagePath,
			ExitPage:        stringPointer(request.PagePath),
			Referrer:        request.Referrer,
			SourceLabel:     sourceLabel,
			UTMSource:       request.UTMSource,
			UTMMedium:       request.UTMMedium,
			UTMCampaign:     request.UTMCampaign,
			DeviceType:      request.DeviceType,
			Browser:         request.Browser,
			IPAddress:       stringPointer(ipAddress),
			IsBounced:       true,
			StartedAt:       &now,
			LastSeenAt:      &now,
			DurationSeconds: 0,
		}

		if err := service.DB.Create(&session).Error; err != nil {
			return nil, err
		}

		return &session, nil
	}

	session.LastSeenAt = &now
	session.ExitPage = stringPointer(request.PagePath)
	session.Referrer = firstNonNil(request.Referrer, session.Referrer)
	session.SourceLabel = sourceLabel
	session.UTMSource = firstNonNil(request.UTMSource, session.UTMSource)
	session.UTMMedium = firstNonNil(request.UTMMedium, session.UTMMedium)
	session.UTMCampaign = firstNonNil(request.UTMCampaign, session.UTMCampaign)
	session.DeviceType = firstNonNil(request.DeviceType, session.DeviceType)
	session.Browser = firstNonNil(request.Browser, session.Browser)
	if session.IPAddress == nil {
		session.IPAddress = stringPointer(ipAddress)
	}

	if err := service.DB.Save(&session).Error; err != nil {
		return nil, err
	}

	return &session, nil
}

func (service Service) TrackEvent(request TrackEventRequest) error {
	session, err := service.findSession(request.SessionKey)
	if err != nil {
		return err
	}

	now := time.Now()
	session.LastSeenAt = &now
	session.ExitPage = stringPointer(request.PagePath)

	meta := request.Meta
	var storedMeta *json.RawMessage
	if len(meta) > 0 {
		storedMeta = &meta
	}

	event := models.MarketingEvent{
		MarketingSessionID: session.ID,
		EventType:          strings.TrimSpace(strings.ToLower(request.EventType)),
		EventName:          strings.TrimSpace(request.EventName),
		PagePath:           request.PagePath,
		TargetURL:          request.TargetURL,
		ElementKey:         request.ElementKey,
		Meta:               storedMeta,
	}

	if event.EventType == "click" {
		session.IsBounced = false
	}

	return service.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(session).Error; err != nil {
			return err
		}

		return tx.Create(&event).Error
	})
}

func (service Service) Heartbeat(request SessionHeartbeatRequest) error {
	session, err := service.findSession(request.SessionKey)
	if err != nil {
		return err
	}

	now := time.Now()
	session.LastSeenAt = &now
	session.DurationSeconds += request.ActiveSeconds
	session.IsBounced = false
	if request.PagePath != nil && *request.PagePath != "" {
		session.ExitPage = request.PagePath
	}

	return service.DB.Save(session).Error
}

func (service Service) EndSession(request EndSessionRequest) error {
	session, err := service.findSession(request.SessionKey)
	if err != nil {
		return err
	}

	now := time.Now()
	session.LastSeenAt = &now
	session.DurationSeconds += request.ActiveSeconds
	if request.ActiveSeconds > 0 {
		session.IsBounced = false
	}
	if request.PagePath != nil && *request.PagePath != "" {
		session.ExitPage = request.PagePath
	}

	return service.DB.Save(session).Error
}

func (service Service) Overview(days int) (*OverviewResponse, error) {
	if days <= 0 {
		days = 14
	}

	start := time.Now().AddDate(0, 0, -(days - 1)).Truncate(24 * time.Hour)

	response := &OverviewResponse{}

	if err := service.DB.Model(&models.MarketingSession{}).Count(&response.Totals.TotalSessions).Error; err != nil {
		return nil, err
	}

	if err := service.DB.Model(&models.MarketingSession{}).
		Distinct("COALESCE(visitor_key, session_key)").
		Count(&response.Totals.UniqueVisitors).Error; err != nil {
		return nil, err
	}

	if err := service.DB.Model(&models.MarketingEvent{}).
		Where("event_type = ?", "page_view").
		Count(&response.Totals.TotalPageViews).Error; err != nil {
		return nil, err
	}

	if err := service.DB.Model(&models.MarketingEvent{}).
		Where("event_type = ?", "click").
		Count(&response.Totals.TotalClicks).Error; err != nil {
		return nil, err
	}

	type averageRow struct {
		Average float64
	}
	var avgRow averageRow
	if err := service.DB.Model(&models.MarketingSession{}).
		Select("COALESCE(AVG(duration_seconds), 0) as average").
		Scan(&avgRow).Error; err != nil {
		return nil, err
	}
	response.Totals.AverageDurationSeconds = avgRow.Average

	var bouncedCount int64
	if err := service.DB.Model(&models.MarketingSession{}).
		Where("is_bounced = ?", true).
		Count(&bouncedCount).Error; err != nil {
		return nil, err
	}
	if response.Totals.TotalSessions > 0 {
		response.Totals.BounceRate = float64(bouncedCount) / float64(response.Totals.TotalSessions) * 100
	}

	var sessionRows []trendRow
	if err := service.DB.Model(&models.MarketingSession{}).
		Select("DATE(created_at) as date, COUNT(*) as total").
		Where("created_at >= ?", start).
		Group("DATE(created_at)").
		Order("DATE(created_at)").
		Scan(&sessionRows).Error; err != nil {
		return nil, err
	}

	var pageViewRows []trendRow
	if err := service.DB.Model(&models.MarketingEvent{}).
		Select("DATE(created_at) as date, COUNT(*) as total").
		Where("created_at >= ?", start).
		Where("event_type = ?", "page_view").
		Group("DATE(created_at)").
		Order("DATE(created_at)").
		Scan(&pageViewRows).Error; err != nil {
		return nil, err
	}

	var clickRows []trendRow
	if err := service.DB.Model(&models.MarketingEvent{}).
		Select("DATE(created_at) as date, COUNT(*) as total").
		Where("created_at >= ?", start).
		Where("event_type = ?", "click").
		Group("DATE(created_at)").
		Order("DATE(created_at)").
		Scan(&clickRows).Error; err != nil {
		return nil, err
	}

	sessionMap := rowsToMap(sessionRows)
	pageViewMap := rowsToMap(pageViewRows)
	clickMap := rowsToMap(clickRows)

	for cursor := start; !cursor.After(time.Now()); cursor = cursor.AddDate(0, 0, 1) {
		key := cursor.Format("2006-01-02")
		response.Trend.Labels = append(response.Trend.Labels, cursor.Format("Jan 2"))
		response.Trend.Sessions = append(response.Trend.Sessions, sessionMap[key])
		response.Trend.PageViews = append(response.Trend.PageViews, pageViewMap[key])
		response.Trend.Clicks = append(response.Trend.Clicks, clickMap[key])
	}

	type topPageRow struct {
		PagePath string
		Views    int64
	}
	var topPages []topPageRow
	if err := service.DB.Model(&models.MarketingEvent{}).
		Select("page_path, COUNT(*) as views").
		Where("event_type = ?", "page_view").
		Group("page_path").
		Order("views DESC").
		Limit(6).
		Scan(&topPages).Error; err != nil {
		return nil, err
	}

	for _, row := range topPages {
		var clickCount int64
		if err := service.DB.Model(&models.MarketingEvent{}).
			Where("event_type = ?", "click").
			Where("page_path = ?", row.PagePath).
			Count(&clickCount).Error; err != nil {
			return nil, err
		}

		response.TopPages = append(response.TopPages, PageMetric{
			Label:  row.PagePath,
			Views:  row.Views,
			Clicks: clickCount,
		})
	}

	var eventRows []labelRow
	if err := service.DB.Model(&models.MarketingEvent{}).
		Select("event_name as label, COUNT(*) as total").
		Group("event_name").
		Order("total DESC").
		Limit(6).
		Scan(&eventRows).Error; err != nil {
		return nil, err
	}
	response.EventBreakdown = labelRows(eventRows)

	var sourceRows []labelRow
	if err := service.DB.Model(&models.MarketingSession{}).
		Select("source_label as label, COUNT(*) as total").
		Group("source_label").
		Order("total DESC").
		Limit(6).
		Scan(&sourceRows).Error; err != nil {
		return nil, err
	}
	response.SourceBreakdown = labelRows(sourceRows)

	return response, nil
}

func (service Service) findSession(sessionKey string) (*models.MarketingSession, error) {
	var session models.MarketingSession
	if err := service.DB.Where("session_key = ?", sessionKey).First(&session).Error; err != nil {
		return nil, err
	}

	return &session, nil
}

func deriveSourceLabel(referrer *string, utmSource *string) string {
	if utmSource != nil && strings.TrimSpace(*utmSource) != "" {
		return strings.TrimSpace(*utmSource)
	}

	if referrer == nil || strings.TrimSpace(*referrer) == "" {
		return "Direct"
	}

	parsed, err := url.Parse(*referrer)
	if err != nil || parsed.Host == "" {
		return "Referral"
	}

	return parsed.Host
}

func stringPointer(value string) *string {
	if strings.TrimSpace(value) == "" {
		return nil
	}

	v := value
	return &v
}

func firstNonNil(primary *string, fallback *string) *string {
	if primary != nil && strings.TrimSpace(*primary) != "" {
		return primary
	}

	return fallback
}

func rowsToMap(rows []trendRow) map[string]int64 {
	output := make(map[string]int64, len(rows))
	for _, row := range rows {
		output[row.Date] = row.Total
	}

	return output
}

func labelRows(rows []labelRow) []LabelValueMetric {
	output := make([]LabelValueMetric, 0, len(rows))
	for _, row := range rows {
		output = append(output, LabelValueMetric{
			Label: row.Label,
			Total: row.Total,
		})
	}

	return output
}
