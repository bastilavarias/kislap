# CONTINUITY.md

## Snapshot
- Goal: Add Linktree-level background selector (`plain`/`grid`) in form and render it in template. [2026-03-08][USER]
- Success criteria: background choice persists to DB/API and toggles template backdrop style. [2026-03-08][USER]
- Now: background selector persists via DB/API; Neo Brutalist background uses theme variables (`--background`, `--border`) and layout styling matches the reference index design language. [2026-03-08][CODE]
- Next: Validate in browser that `background_style=grid/plain`, card shadows, and section blocks match expected output in both light and dark modes. [2026-03-08][ASSUMPTION]
- Open questions: None. [2026-03-08][ASSUMPTION]

## Done (recent)
- Verified API returns `background_style` for Linktree. [2026-03-08][CODE]
- Added migration `2026_03_08_130000_add_background_style_to_linktrees_table.php`. [2026-03-08][CODE]
- Added `background_style` in Linktree model + DTO + service save mapping. [2026-03-08][CODE]
- Added `background_style` to web-builder schema/types/default values/mapping. [2026-03-08][CODE]
- Added background selector (plain/grid) in design panel and wired it via form state. [2026-03-08][CODE]
- Updated Neo Brutalist template to apply grid via inline CSS and remove debug `bg-red-600`. [2026-03-08][CODE]
- One-table Linktree content model work (typed `linktree_links`) remains active and integrated; payload compatibility maintained. [2026-03-08][CODE]

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
- 2026-03-08 [CODE] Added dynamic section renderer module `linktree-neo-brutalist-sections.tsx`.
- 2026-03-08 [CODE] Updated Neo Brutalist template to render persisted sections instead of static hardcoded blocks.
- 2026-03-08 [CODE] Added `packages/templates/src/components/linktree/linktree-neo-brutalist.tsx`.
- 2026-03-08 [CODE] Patched `builder.tsx` to pass `themeStyles` to `renderTemplate` and removed `console.log(settings)`.
- 2026-03-08 [CODE] Removed `AGENTS.md` at repo root.
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
