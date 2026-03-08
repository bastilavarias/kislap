# CONTINUITY.md

## Snapshot
- Goal: Showcase page should render static OG image previews (not live iframe previews) and support clickable pagination. [2026-03-08][USER]
- Success criteria: `ShowcaseCard` uses `project.og_image_url` for preview image, and users can navigate pages with clickable pagination controls. [2026-03-08][USER]
- Now: `showcase-feed.tsx` now prefers `project.og_image_url` and automatically falls back to `LivePreviewFrame` when OG is missing or fails to load; pagination remains client-side cached (Prev/Next + page buttons). [2026-03-08][CODE]
- Next: Validate in browser that pages fetch correctly and `Next` disables after the final non-full page response. [2026-03-08][ASSUMPTION]
- Open questions: None. [2026-03-08][ASSUMPTION]

## Done (recent)
- Added OG-preview fallback behavior: if `og_image_url` is absent/broken, `ShowcaseCard` renders `LivePreviewFrame`. [2026-03-08][CODE]
- Switched Showcase card preview from live iframe to `project.og_image_url` image rendering with fallback image. [2026-03-08][CODE]
- Implemented clickable Showcase pagination with page-number buttons and Prev/Next controls. [2026-03-08][CODE]
- Added client-side page cache + on-demand fetch for `/api/projects/list/public?page=&limit=9`. [2026-03-08][CODE]
- Added `og_image_url` to web-marketing `APIResponseProject` typing. [2026-03-08][CODE]
- Passed `apiBaseUrl` from `showcase.astro` into `ShowcaseFeed` for client pagination fetches. [2026-03-08][CODE]
- Removed Linktree builder layout options for `linktree-retro` and `linktree-cyber` in design panel. [2026-03-08][CODE]

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
- 2026-03-08 [CODE] Unified Linktree builder content stream and split payload mapping in provider save path.
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
