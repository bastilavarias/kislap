# CONTINUITY.md

## Snapshot
- Goal: Advance `menu` from a working Phase 1 into a stronger Phase 2 product without adding ordering yet. [2026-03-20][USER]
- Success criteria: menu builder exposes richer business data, the public menu feels more polished and interactive, QR UX is cleaner, and analytics presentation improves while staying within Kislap's current project-type structure. [2026-03-20][USER]
- Now: Menu Phase 2 slice is implemented: builder supports opening hours and social/review links, the public menu template has stronger business presentation plus an item detail dialog, QR has presets/copy feedback, and the menu dashboard includes lightweight activity charts. [2026-03-20][CODE]
- Next: Visually QA the hardcoded pizzeria-style `menu-default` scaffold in `web-sites`, then map real menu data into that structure in a follow-up pass. [2026-03-20][ASSUMPTION]
- Open questions: Variants/add-ons, advanced QR styling beyond presets, ordering, reviews collection, history restore, multilingual, and additional menu templates remain deferred. [2026-03-20][USER]
- Now: Menu design polish is underway: layout cards now support visual thumbnails, theme preset/light-dark handling was corrected in the stateless customizer path, and the menu editor now includes an in-page live preview with desktop/tablet/mobile toggles inspired by la.menu. [2026-03-20][CODE]

## Done (recent)
- Added Phase 1 `menu` backend: new `menus`, `menu_categories`, and `menu_items` tables/migrations; `menu` API module with multipart save/get; project hydration in `ShowBySlug`/`ShowBySubDomain`; and `menu` enum support in `projects`/`layouts`. [2026-03-20][CODE]
- Added Phase 1 `menu` builder routes under `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]` with provider, editor form, dashboard, design/QR panel, and save payload mapping. [2026-03-20][CODE]
- Added Phase 1 public menu rendering: `packages/templates/src/components/menu/menu-default.tsx`, template exports, `web-sites` menu resolver support, and theme-object selection for menu projects. [2026-03-20][CODE]
- Wired menu analytics into the public template by tracking item clicks as `menu-item:*` and category clicks as `menu-category:*`, then consuming those prefixes in the new menu dashboard cards. [2026-03-20][CODE]
- Verified successful production builds for `apps/web-builder` and `apps/web-sites` after the new `menu` project type integration. [2026-03-20][TOOL]
- Fixed dashboard summary click counts by separating Gorm sessions in `page_activity_service.go` so views/clicks/visitors no longer share mutated filters. [2026-03-20][CODE]
- Stabilized outbound click tracking by making `fetch(..., { keepalive: true })` primary and removing manual navigation overrides from shared tracking helpers. [2026-03-20][CODE]
- Polished Menu Phase 1 editor UX: removed extra input shadows from business fields and converted menu category/item management to compact sortable lists with add/edit dialogs, matching the Linktree editor pattern more closely. [2026-03-20][CODE]
- Implemented Menu Phase 2 slice: added opening-hours and social-link editing, upgraded `menu-default` with contact/location/actions + item dialog + category imagery + better empty states, and improved QR/dashboard presentation. [2026-03-20][CODE]
- Reworked `menu-default` into a hardcoded pizzeria-style scaffold using sample content/image URLs first, and split the template into smaller presentational files so no code file exceeds the 300 LOC cap. [2026-03-20][CODE]
- Added menu gallery support end-to-end: `gallery_images` persists as JSON on `menus`, the builder now has a multi-image gallery uploader, and `menu-default` renders a gallery section with real-data fallback to sample images. [2026-03-22][CODE]
- Removed the menu live-preview experiment from the builder route entirely after stale-render drift between preview and public site; menu editor is back to a simpler stable baseline while a better preview design is deferred. [2026-03-22][USER]

## Decisions
- D001 ACTIVE: Canonical agent instructions live at `.agents/AGENTS.md`; do not duplicate in root. [2026-03-08][USER]
- D002 ACTIVE: New Linktree layouts must be added in three places: builder `LAYOUT_OPTIONS`, templates export index, and `apps/web-sites` template resolver map. [2026-03-08][CODE]
- D007 ACTIVE: Canonical Linktree persistence is `linktree_links` (typed content rows); API compatibility still exposes `links` and `sections` arrays. [2026-03-08][CODE]
- D008 ACTIVE: Unified Linktree content ordering source is drag-and-drop array order; save writes `placement_order` from current list sequence. [2026-03-08][CODE]
- D009 ACTIVE: `accent_color` stores either solid colors (e.g. `#ef4444`) or CSS `linear-gradient(...)` for both quote and banner sections. [2026-03-08][CODE]
- D010 ACTIVE: `menu` is a separate project type, not a pivot/mutation of inactive `biz`; canonical content model is `menu -> categories -> items`. [2026-03-20][USER]
- D011 ACTIVE: Menu Phase 1 supports a single-price item UI only; future size/variant support must use flexible variant rows rather than hardcoded `small/medium/large` columns. [2026-03-20][USER]
- D012 ACTIVE: Menu QR in Phase 1 is basic UI but isolated as its own component/module, with persistence already ready for future customization via `qr_settings`. [2026-03-20][USER]
- D013 ACTIVE: Menu Phase 2 still excludes ordering; it focuses on stronger business presentation, item browsing UX, lightweight analytics polish, and basic-but-better QR ergonomics. [2026-03-20][USER]

## Working set
- `.agents/AGENTS.md`
- `CONTINUITY.md`
- `apps/api-service/internal/menu/menu_controller.go`
- `apps/api-service/internal/menu/menu_service.go`
- `apps/api-service/internal/menu/menu_sync.go`
- `apps/api-service/models/menu.go`
- `apps/api-service/models/menu_category.go`
- `apps/api-service/models/menu_item.go`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/menu-provider.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/form.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/categories-editor.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/items-editor.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/business-hours-editor.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/social-links-editor.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/gallery-uploader.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/qr-panel.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/dashboard.tsx`
- `apps/web-builder/lib/schemas/menu.ts`
- `apps/web-builder/lib/menu-defaults.ts`
- `packages/templates/src/components/menu/menu-default.tsx`
- `packages/templates/src/components/menu/menu-default-hero.tsx`
- `packages/templates/src/components/menu/menu-default-featured-section.tsx`
- `packages/templates/src/components/menu/menu-default-category-sections.tsx`
- `packages/templates/src/components/menu/menu-default-gallery-section.tsx`
- `packages/templates/src/components/menu/menu-default-item-dialog.tsx`
- `packages/templates/src/components/menu/menu-default-business-panels.tsx`
- `packages/templates/src/components/menu/menu-default-sample-data.ts`

## Receipts
- 2026-03-20 [CODE] Added `menu` API routes (`GET /api/menu/:id`, `POST /api/menu`) and mirrored Linktree-style multipart `json_body` save flow plus async OG regeneration.
- 2026-03-20 [CODE] Added Laravel migrations for `menus`, `menu_categories`, `menu_items`, and enum updates to include `menu` in `projects` and `layouts`.
- 2026-03-20 [TOOL] `go test ./internal/menu ./internal/project ./routes` passed in `apps/api-service`.
- 2026-03-20 [CODE] Activated `menu` in builder project creation and dashboard project cards.
- 2026-03-20 [CODE] Added builder menu editor sections: Business, Categories, Items, Theme, and basic QR.
- 2026-03-20 [CODE] Added `menu-default` public template under `packages/templates/src/components/menu` with search, category tabs, responsive item cards, and item/category click tracking.
- 2026-03-20 [TOOL] `npm run build` passed in `apps/web-builder` after adding the `menu` route tree.
- 2026-03-20 [TOOL] `npm run build` passed in `apps/web-sites` after adding menu template resolver support.
- 2026-03-20 [CODE] Menu dashboard reuses page-activity infrastructure and interprets `menu-item:*` / `menu-category:*` click keys for top-item and top-category cards.
- 2026-03-20 [CODE] Menu editor now uses dialog-based category/item editing and `shadow-none` business inputs for consistency with Linktree/portfolio. 
- 2026-03-20 [TOOL] `next build --turbopack` passed in `apps/web-builder` after the menu editor polish pass (run via Laragon Node path because `node`/`npm` were not on PATH).
- 2026-03-20 [CODE] Menu builder now exposes `business_hours` and `social_links` via dedicated editor sections backed by the existing backend fields.
- 2026-03-20 [CODE] `menu-default` public template now renders business actions, hours/social panels, featured items, category imagery, and an item detail dialog while staying under the 300 LOC cap via supporting files.
- 2026-03-20 [CODE] QR panel gained quick presets and copy feedback; menu dashboard gained lightweight bar-chart summaries from existing activity data.
- 2026-03-20 [TOOL] `next build --turbopack` passed in both `apps/web-builder` and `apps/web-sites` after the Menu Phase 2 slice.
- 2026-03-20 [CODE] `menu-default` now temporarily uses hardcoded pizzeria-style sample data/images to refine structure before reconnecting real menu data.
- 2026-03-20 [TOOL] `next build --turbopack` passed in `apps/web-sites` after splitting `menu-default` into `menu-default-hero`, `menu-default-featured-section`, and `menu-default-category-sections`.
- 2026-03-20 [CODE] Menu design panel now renders two-column visual layout cards, the menu theme tab preserves active light/dark styles when applying presets or editing colors, and the editor renders an ala.menu-style live preview with desktop/tablet/mobile toggles from unsaved form state.
- 2026-03-20 [TOOL] 
ext build --turbopack in pps/web-builder is currently blocked by pre-existing unrelated portfolio template imports of @/lib/schemas/appointment, so the latest menu editor changes were verified by targeted inspection but not by a clean full build.
- 2026-03-22 [CODE] Menu gallery images now use a lightweight JSON-backed persistence model on `menus.gallery_images`, mirroring existing menu JSON fields instead of introducing a new relation/table in Phase 2.
- 2026-03-22 [TOOL] `go test ./internal/menu ./internal/project`, `npm run build` in `apps/web-builder`, and `npm run build` in `apps/web-sites` all passed after the menu gallery addition.
- 2026-03-22 [CODE] Deleted `menu-live-preview.tsx` and `menu-preview-mapper.ts`, removed preview dialog/button wiring from menu `form-header.tsx`, and removed preview-related context/layout props from the menu builder.
- 2026-03-22 [TOOL] `npm run build` passed in `apps/web-builder` after removing the menu live preview feature.

