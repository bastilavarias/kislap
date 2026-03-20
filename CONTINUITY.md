# CONTINUITY.md

## Snapshot
- Goal: Make the dashboard summary cards reflect real click counts now that tracking is working. [2026-03-20][USER]
- Success criteria: The top `Clicks` card matches persisted click rows and aligns with Top Clicked Links / Recent Activity for the same project. [2026-03-20][USER]
- Now: `GetStats` in `page_activity_service.go` no longer reuses a mutated Gorm query; views, clicks, and unique visitors are counted from clean scoped queries, fixing zero-click summaries caused by stacked `type='view'` + `type='click'` filters. [2026-03-20][CODE]
- Next: Refresh the Linktree dashboard and confirm the `Clicks` total is now non-zero and CTR updates accordingly. [2026-03-20][ASSUMPTION]
- Open questions: None. [2026-03-08][ASSUMPTION]

## Done (recent)
- Fixed `GetStats` backend aggregation bug: separate Gorm sessions are now used for views, clicks, and unique-visitor counts, so the dashboard summary no longer zeroes clicks by stacking incompatible `type` filters. [2026-03-20][CODE]
- Switched click tracking transport to `fetch(..., { keepalive: true })` first, with `sendBeacon` only as a fallback, and made non-2xx click responses observable in both `web-sites` and `web-builder`. [2026-03-20][CODE]
- Removed manual navigation from shared Linktree/portfolio tracking helpers so tracked clicks no longer open both a new tab and redirect the current page. [2026-03-20][CODE]
- Fixed builder customizer mode toggle so stateless/editor theme changes no longer pull stale styles from persisted `settings`/local storage when switching between light and dark. [2026-03-20][CODE]
- Fixed project-metadata save path to preserve publish state on edit by normalizing `project.published` and overriding update payload in `ProjectFormDialog`. [2026-03-20][CODE]
- Applied tracked-navigation helper to all active portfolio showcase templates that use `trackPageProjectClick`, so portfolio clicks no longer race against navigation. [2026-03-20][CODE]
- Synced portfolio click tracking with Linktree by moving `trackPageProjectClick` onto the same beacon/keepalive transport in `web-sites`. [2026-03-20][CODE]
- Switched Linktree link/promo/contact navigation to tracked navigation flow: prevent default, record click, then navigate. [2026-03-20][CODE]
- Switched page-activity click transport to `navigator.sendBeacon` with `keepalive` fallback in both `web-sites` and `web-builder` hooks to survive outbound navigation. [2026-03-20][CODE]
- Added backend `GET /api/page-activities/:id/top-links` aggregate endpoint and wired the Linktree dashboard to use it. [2026-03-20][CODE]
- Fixed Linktree dashboard build error caused by unavailable `lucide-react` export `MousePointerSquare`. [2026-03-20][CODE]
- Wired click tracking into active Linktree templates (`linktree-default`, `linktree-neo-brutalist`) and promo sections. [2026-03-20][CODE]
- Added OG-preview fallback behavior: if `og_image_url` is absent/broken, `ShowcaseCard` renders `LivePreviewFrame`. [2026-03-08][CODE]
- Switched Showcase card preview from live iframe to `project.og_image_url` image rendering with fallback image. [2026-03-08][CODE]

## Decisions
- D001 ACTIVE: Canonical agent instructions live at `.agents/AGENTS.md`; do not duplicate in root. [2026-03-08][USER]
- D002 ACTIVE: New Linktree layouts must be added in three places: builder `LAYOUT_OPTIONS`, templates export index, and `apps/web-sites` template resolver map. [2026-03-08][CODE]
- D003 SUPERSEDED: Static section stopgap replaced with persisted `sections` model. [2026-03-08][CODE]
- D004 ACTIVE: Custom non-link cards are modeled as ordered `sections` separate from `links`. [2026-03-08][CODE]
- D005 ACTIVE: Builder now models links as `sections[type=link]` in one unified content list; payload is split to `links` + `sections` only at save boundary for API compatibility. [2026-03-08][CODE]
- D006 SUPERSEDED: Manual `position` field ordering removed from editor/forms. [2026-03-08][CODE]
- D008 ACTIVE: Unified content ordering source is drag-and-drop array order; save writes `placement_order` from current list sequence. [2026-03-08][CODE]
- D007 ACTIVE: Canonical persistence is now `linktree_links` (typed content rows); API compatibility still exposes `links` and `sections` arrays. [2026-03-08][CODE]
- D009 ACTIVE: `accent_color` stores either solid colors (e.g. `#ef4444`) or CSS `linear-gradient(...)` for both quote and banner sections. [2026-03-08][CODE]

## Working set
- `.agents/AGENTS.md`
- `CONTINUITY.md`
- `apps/web-builder/app/(private)/dashboard/builder/linktree/[slug]/components/sections-editor-fields.tsx`
- `apps/web-builder/app/(private)/dashboard/builder/linktree/[slug]/components/accent-picker.tsx`
- `packages/templates/src/components/linktree/linktree-neo-brutalist.tsx`
- `packages/templates/src/components/linktree/linktree-neo-brutalist-sections.tsx`
- `apps/web-builder/lib/schemas/linktree.ts`
- `apps/api-service/internal/linktree/linktree_service.go`
- `apps/api-service/internal/linktree/linktree_dto.go`
- `apps/api-service/models/linktree_link.go`
- `apps/api-service/models/linktree_section.go`
- `apps/web-admin/database/migrations/2026_03_08_150000_expand_accent_color_columns_for_linktree_gradients.php`

## Receipts
- 2026-03-08 [CODE] Added type-specific field filtering and modularized form/editor files below 300 LOC.
- 2026-03-08 [TOOL] Validation tools unavailable locally (`pnpm` and `npm` commands not found).
- 2026-03-08 [CODE] Removed `Image URL`/`Support QR Image URL` inputs from content dialog to enforce upload-only image entry.
- 2026-03-08 [CODE] Updated API Nginx block to `client_max_body_size 200M` + CORS `add_header ... always` and reloaded container.
- 2026-03-08 [CODE] Removed Nginx `add_header`/`OPTIONS` override causing duplicate `Access-Control-Allow-Origin`.
- 2026-03-08 [CODE] Replaced Tailwind arbitrary grid background class with inline CSS style on root wrapper.
- 2026-03-08 [CODE] Switched background to theme variables (`var(--background)`, `var(--border)`) for light/dark parity.
- 2026-03-08 [CODE] Aligned Neo Brutalist as structure-only (heavy borders, spacing, hierarchy) and removed hardcoded platform colors in favor of theme tokens from DB.
- 2026-03-08 [CODE] Kept code-file modularity rule by reducing `linktree-neo-brutalist.tsx` to 294 LOC.
- 2026-03-08 [CODE] Made grid background subtler with theme-aware low-opacity lines (dark: white 8%, light: black 6%).
- 2026-03-08 [CODE] Removed manual `position` from Linktree sections schema/editor/provider/save pipeline; ordering now follows draggable list order only.
- 2026-03-08 [CODE] Migrated Link-type social icon mapping to Font Awesome (`react-icons/fa6`) for builder + sites, keeping preset badge colors and icon-over-image priority (`FaGlobe` for portfolio).
- 2026-03-08 [CODE] Removed extra brutal-shadow styling from Neo Brutalist toggle wrapper; kept logo border + hard offset logo shadow, restored intended hero typography (smaller/tighter name + smaller tagline), and kept `about` below phone/email with subtler styling.
- 2026-03-08 [CODE] Increased Support and Promo card typography, added vertical padding in Promo content block, switched Quote text to `font-mono`, added Quote/Banner accent picker (solid+gradient), and aligned Quote text-color behavior with Banner when accent backgrounds are set.
- 2026-03-08 [CODE] Mirrored portfolio OG behavior in Linktree: controller now triggers `ProjectService.SaveOGImage(projectID)` asynchronously after save with panic recovery and error logging.
- 2026-03-08 [CODE] Implemented minimalist `LinktreeDefault` parity with Neo data model: merged ordered content stream, `background_style` plain/grid, icon-key badges, and section rendering via new `linktree-default-sections.tsx`.
- 2026-03-08 [CODE] Removed `linktree-retro` and `linktree-cyber` entries from Linktree builder layout chooser (`design-panel.tsx`), leaving only Default and Neo Brutalist.
- 2026-03-08 [CODE] Updated web-marketing showcase feed to use `project.og_image_url` previews and added clickable client pagination with cached page fetches via `/api/projects/list/public`.
- 2026-03-08 [CODE] Updated ShowcaseCard preview fallback: OG image is attempted first; on missing/broken image the card switches to live iframe preview (`LivePreviewFrame`).
- 2026-03-20 [CODE] Replaced Linktree mocked dashboard with real analytics UI and added outbound link click tracking in active Linktree templates plus compatible hook exports in both `web-sites` and `web-builder`.
- 2026-03-20 [CODE] Fixed Linktree dashboard Turbopack build failure by replacing unavailable Lucide icon export `MousePointerSquare` with `MousePointerSquareDashed`.
- 2026-03-20 [CODE] Added backend aggregate endpoint `GET /api/page-activities/:id/top-links` and switched Linktree dashboard from client-side click grouping to server-side top-link analytics.
- 2026-03-20 [CODE] Updated tracking transport to use `sendBeacon`/`keepalive` for link clicks so navigation away from Linktree pages does not abort analytics requests.
- 2026-03-20 [CODE] Added shared `trackThenNavigate` helper and rewired Linktree cards/promo/contact links to wait for tracking before navigation.
- 2026-03-20 [CODE] Synced portfolio showcase click tracking with the new transport by switching `trackPageProjectClick` in `apps/web-sites/hooks/api/use-page-activity.ts` to `sendTrackingEvent`.
- 2026-03-20 [CODE] Added shared `portfolio-track-navigation.ts` helper and rewired active portfolio showcase links (`default`, `cyber`, `bento`, `glass`, `vaporware`, `kinetic`, `neo-brutalist`, `newspaper`) to track before navigation.
- 2026-03-20 [CODE] Fixed builder project edit dialog so updates preserve existing publish state by coercing `project.published` to boolean and sending that value on update.
