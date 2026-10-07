package project

import (
	"encoding/json"
	"testing"

	"flash/models"
)

func rawJSON(value string) *json.RawMessage {
	raw := json.RawMessage(value)
	return &raw
}

func TestNormalizeLinktreeContentPreservesBlockMetadata(t *testing.T) {
	project := models.Project{
		Linktree: &models.Linktree{
			Links: []models.LinktreeLink{
				{
					ID:             1,
					LinktreeID:     9,
					PlacementOrder: 0,
					Type:           "skills",
					ContentJSON:    rawJSON(`{"heading":"Stack","items":"Go, React"}`),
					LayoutJSON:     rawJSON(`{"width":"third","align":"left"}`),
					StyleJSON:      rawJSON(`{"variant":"highlight","padding":"normal"}`),
				},
				{
					ID:             2,
					LinktreeID:     9,
					PlacementOrder: 1,
					Type:           "link",
					Title:          "GitHub",
					URL:            "https://github.com/",
				},
			},
		},
	}

	normalizeLinktreeContent(&project)

	if len(project.Linktree.Sections) != 1 {
		t.Fatalf("expected 1 section, got %d", len(project.Linktree.Sections))
	}
	if len(project.Linktree.Links) != 1 {
		t.Fatalf("expected 1 link, got %d", len(project.Linktree.Links))
	}

	section := project.Linktree.Sections[0]
	if section.ContentJSON == nil || string(*section.ContentJSON) != `{"heading":"Stack","items":"Go, React"}` {
		t.Fatalf("content_json was not preserved: %v", section.ContentJSON)
	}
	if section.LayoutJSON == nil || string(*section.LayoutJSON) != `{"width":"third","align":"left"}` {
		t.Fatalf("layout_json was not preserved: %v", section.LayoutJSON)
	}
	if section.StyleJSON == nil || string(*section.StyleJSON) != `{"variant":"highlight","padding":"normal"}` {
		t.Fatalf("style_json was not preserved: %v", section.StyleJSON)
	}
}
