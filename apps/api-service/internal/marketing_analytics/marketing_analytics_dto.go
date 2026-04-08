package marketing_analytics

import "encoding/json"

type StartSessionRequest struct {
	SessionKey  string  `json:"session_key" binding:"required"`
	VisitorKey  *string `json:"visitor_key,omitempty"`
	PagePath    string  `json:"page_path" binding:"required"`
	Referrer    *string `json:"referrer,omitempty"`
	UTMSource   *string `json:"utm_source,omitempty"`
	UTMMedium   *string `json:"utm_medium,omitempty"`
	UTMCampaign *string `json:"utm_campaign,omitempty"`
	DeviceType  *string `json:"device_type,omitempty"`
	Browser     *string `json:"browser,omitempty"`
}

type TrackEventRequest struct {
	SessionKey string          `json:"session_key" binding:"required"`
	EventType  string          `json:"event_type" binding:"required"`
	EventName  string          `json:"event_name" binding:"required"`
	PagePath   string          `json:"page_path" binding:"required"`
	TargetURL  *string         `json:"target_url,omitempty"`
	ElementKey *string         `json:"element_key,omitempty"`
	Meta       json.RawMessage `json:"meta,omitempty"`
}

type SessionHeartbeatRequest struct {
	SessionKey    string  `json:"session_key" binding:"required"`
	PagePath      *string `json:"page_path,omitempty"`
	ActiveSeconds uint    `json:"active_seconds"`
}

type EndSessionRequest struct {
	SessionKey    string  `json:"session_key" binding:"required"`
	PagePath      *string `json:"page_path,omitempty"`
	ActiveSeconds uint    `json:"active_seconds"`
}
