# CONTINUITY.md

## Snapshot
- Goal: Advance `menu` from a working Phase 1 into a stronger Phase 2 product without adding ordering yet. [2026-03-20][USER]
- Success criteria: menu builder exposes richer business data, the public menu feels more polished and interactive, QR UX is cleaner, and analytics presentation improves while staying within Kislap's current project-type structure. [2026-03-20][USER]
- Now: Menu Phase 2 slice is implemented: builder supports opening hours and social/review links, the public menu template has stronger business presentation plus an item detail dialog, QR has presets/copy feedback, and the menu dashboard includes lightweight activity charts. [2026-03-20][CODE]
- Next: Continue menu polish with three follow-ups: unify the footer across templates, add more `menu` templates, and reorganize the menu builder form for clearer editing flow. [2026-03-28][USER]
- Open questions: Variants/add-ons, advanced QR styling beyond presets, ordering, reviews collection, history restore, multilingual, and additional menu templates remain deferred. [2026-03-20][USER]
- Open questions: Best shared footer pattern across portfolio/linktree/menu, which menu template variants should come first after `menu-default`, and how far the menu form reorg should go beyond section/order cleanup. [2026-03-28][USER]
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

- 2026-03-28 [CODE] Menu cleanup pass removed `whatsapp`, `country`, `tripadvisor`, `google-reviews`, and legacy `currency` from menu builder/API/parser/template paths; menu dashboard was simplified; and new one-file templates `menu-editorial` + `menu-showcase` were added and wired through builder/web-sites.
- 2026-03-28 [TOOL] `npm run build` passed in `apps/web-sites` and `apps/web-builder` using `C:\laragon\bin\nodejs\node-v22\npm.cmd` after the menu cleanup and extra template pass.

- 2026-03-28 [CODE] Menu layout selector now mirrors portfolio/linktree with icon-first cards and no fake previews; added three new menu templates: menu-bistro, menu-runway, and menu-mosaic, all wired through web-builder selection and web-sites rendering.
- 2026-03-28 [TOOL] Verified both app builds after selector/template expansion: apps/web-sites and apps/web-builder passed.


- 2026-03-29 [USER] User plans to switch later to the web-marketing repo after the current menu/template work.


- 2026-03-29 [CODE] SEO for public sites is now centralized in apps/web-sites/lib/site-seo.ts with type-aware metadata and JSON-LD for portfolio, linktree, and menu; apps/web-sites/app/sites/[site]/page.tsx now uses request-aware canonical/live URLs and injects structured data.
- 2026-03-29 [TOOL] 
pm run build passed in apps/web-sites after the SEO/structured-data pass.


2026-03-29 [CODE] Began web-marketing upgrade: added type filtering support to apps/api-service/internal/project project list endpoints, created SEO-focused marketing pages for portfolio/linktree/menu in apps/web-marketing/src/pages, added shared builder feature page/data modules, expanded landing specialized-features cards to link into those pages, updated showcase.astro and showcase-feed.tsx for project-type filtering with pagination, and added internal footer links to the three builder pages.
2026-03-29 [TOOL] gofmt completed for project controller/service and go test ./internal/project passed in apps/api-service. Frontend build for apps/web-marketing could not be run in this shell because Node/npm is not available on PATH.


2026-03-29 [CODE] Tightened web-marketing messaging with a sharper homepage hero, updated visible sample/founder placeholder text to Juan Delacruz in landing/about content, refreshed about-page positioning copy to reflect portfolio/linktree/menu, and cleaned several marketing text encoding artifacts/checkmark placeholders.
2026-03-29 [CODE] Added a public project stats endpoint for web-marketing About (/api/projects/stats/public) returning published-site count, active-builder count, template count, and uptime; pps/web-marketing/src/pages/about.astro now fetches those stats server-side and passes them into bout-page-content.tsx, which now renders a dynamic stats band instead of hardcoded values.
2026-03-29 [TOOL] gofmt ran on project controller/service/routes and go test ./internal/project passed after the About stats endpoint addition.
2026-03-31 [USER] Requested a UX improvement audit for apps/web-marketing to identify the highest-impact next steps for conversion and clarity.
2026-03-31 [USER] Refined builder-creation direction: replace the dialog with a dedicated project-creation page that uses a left-side guided form and a right-side live preview driven by selected type/starter/layout/theme, using placeholder content to show the result before creation.

- 2026-03-31 [CODE] Centralized pps/web-marketing builder/public URLs through src/lib/site-config.ts, replaced hardcoded marketing CTAs/nav/footer/showcase links with env-driven helpers, and pointed builder feature pages to starter-aware creation URLs using BUILDER_URL and SITE_URL.
- 2026-03-31 [CODE] Added a dedicated builder creation route at pps/web-builder/app/(private)/dashboard/projects/new with a left-side guided flow (type, starter, layout, theme, basics) and a right-side live preview rendered from shared templates using placeholder content.
- 2026-03-31 [CODE] Added shared starter definitions in pps/web-builder/lib/project-starters.ts, wired starter query params through marketing -> builder links, seeded empty portfolio/linktree/menu providers from starter defaults on first load, and preserved intended destination across auth redirects with post_auth_redirect session storage.
- 2026-03-31 [CODE] Restored missing appointment compatibility expected by shared portfolio templates by adding pps/web-builder/lib/schemas/appointment.ts and reintroducing create + CreateAppointmentPayload in pps/web-builder/hooks/api/use-appointment.ts.
- 2026-03-31 [CODE] Wrapped ClientAuthGuard in Suspense inside both pps/web-builder/app/(private)/layout.tsx and pps/web-builder/app/(public)/layout.tsx to satisfy Next.js useSearchParams() CSR bailout requirements during production build.
- 2026-03-31 [TOOL] 
pm run build passed in pps/web-marketing and pps/web-builder using C:\laragon\bin\nodejs\node-v22\npm.cmd after the env-driven marketing URL pass and new builder creation flow work.

- 2026-03-31 [CODE] Project creation preview now renders on a fixed desktop canvas and scales to fit the available panel in project-template-preview.tsx, preventing shared public templates from appearing as squeezed in-pane layouts during starter selection.
- 2026-03-31 [TOOL] 
pm run build passed again in pps/web-builder after the project creation preview scaling fix.

- 2026-03-31 [CODE] Added desktop/tablet/mobile preview controls to the new builder project-creation page and expanded starter mock data across portfolio/linktree/menu so previews render fuller, more believable sample content during selection.
- 2026-03-31 [TOOL] 
pm run build passed in pps/web-builder after the preview viewport toggle and starter-data expansion pass.

- 2026-03-31 [CODE] Replaced the in-page project creation preview with a dedicated iframe-backed preview route at pps/web-builder/app/preview/project, using shared template components in their own document so layout spacing, breakpoints, and image behavior are much closer to the real public render.
- 2026-03-31 [CODE] Extracted shared mock preview project generation into pps/web-builder/lib/project-preview-data.ts and expanded preview menu imagery/content so starter previews show richer category/item/gallery states.
- 2026-03-31 [TOOL] 
pm run build passed in pps/web-builder after the iframe-backed preview route conversion.

- 2026-03-31 [CODE] Enriched builder starter mock data with fuller portfolio history/projects, richer linktree sections, more menu items/images, and swapped avatar/logo/cover placeholders to real photo assets so project creation previews look more convincing.
- 2026-03-31 [TOOL] 
pm run build passed in pps/web-builder after the starter data enrichment pass.

- 2026-03-31 [CODE] Tuned the portfolio starter preview data to mirror the real default portfolio shape more closely: 3 experiences with human-readable dates, 2 project cards, a longer intro paragraph, denser skills, and a cleaner social set so the hero and content rhythm align better with the actual published layout.
- 2026-03-31 [TOOL] 
pm run build passed in pps/web-builder after the portfolio preview data alignment pass.

- 2026-03-31 [CODE] Removed the iframe from the builder project creation preview and replaced it with a builder-side preview renderer that mirrors the pps/web-sites pattern: builder-local enderTemplate, theme normalization, ComponentThemeProvider, and shared template rendering inside the creation page.
- 2026-03-31 [TOOL] 
pm run build passed in pps/web-builder after switching the creation preview from iframe-backed rendering to the builder-side shared-template render path.

- 2026-03-31: Converted shared portfolio/linktree/menu templates toward container-query breakpoints for builder preview fidelity, added @source for @kislap/templates in web-builder globals, removed preview filler height/padding issues, reset preview scroll on selection change, and normalized touched template files back to UTF-8 after batch edits. Builder build passes.

- 2026-03-31: Adjusted builder menu preview fidelity for default menu. In pps/web-builder/lib/project-starters.ts, removed category image_url values from the default/cafe base starter so preview only shows item images, not category images. In packages/templates/src/components/menu/menu-default.tsx, simplified MenuSection to accept a single items array and render a real 2-column grid at @lg instead of the old left/right split props. Removed unused splitItemsIntoColumns. Verified with pps/web-builder build passing.

- 2026-03-31: Expanded menu starter preview data in pps/web-builder/lib/project-starters.ts. Default/cafe starter now has more item images and variants; restaurant and food-stall starters gained more items plus variants. Starter-specific preview names now resolve to Cafe Moto, Resto Express, and Siomai Prince. Updated pps/web-builder/app/(private)/dashboard/projects/new/components/project-creation-page.tsx so the menu project-name placeholder and preview fallback use those branded starter names. Verified with pps/web-builder build passing.

- 2026-03-31: Added more preview menu items per category in pps/web-builder/lib/project-starters.ts. Cafe starter gained additional coffee/non-coffee/pastry items; restaurant starter gained more starters and mains; food-stall starter gained more extras and rice-bowl items. Verified with pps/web-builder build passing.

- 2026-03-31: Fixed preview menu category/item linkage in pps/web-builder/lib/project-preview-data.ts. uildMenuProjectData now creates categories first and maps each item’s menu_category_id from its category_key instead of using index + 1. This was why menu preview only showed a few items despite richer starter data. Verified with pps/web-builder build passing.

- 2026-03-31: Reworked portfolio preview persona in pps/web-builder/lib/project-starters.ts to a new fictional profile (Avery Navarro) with different avatar, contact info, work history, education, showcases, and skills. Updated freelancer copy to remove leftover John reference. In pps/web-builder/app/(private)/dashboard/projects/new/components/project-creation-page.tsx, portfolio placeholder/preview fallback now uses starter-aware names. In pps/web-builder/lib/project-preview-data.ts, portfolio preview slug/user names are derived from projectName instead of hardcoded john-doe. Verified with pps/web-builder build passing.

- 2026-03-31: Reworked link page preview personas and sections in pps/web-builder/lib/project-starters.ts. Default link persona is now Mika Reyes, personal-brand is Nika Valdez, and launch-links is Orbit Labs. Expanded link sections with more creative banner/link/quote mixes inspired by the user's own link page style. Updated pps/web-builder/app/(private)/dashboard/projects/new/components/project-creation-page.tsx so linktree placeholder/preview fallback uses starter-aware names. Updated pps/web-builder/lib/project-preview-data.ts so linktree preview slug/subdomain derive from project name instead of hardcoded john-doe-links. Verified with pps/web-builder build passing.

- 2026-03-31: Linktree preview cleanup. In pps/web-builder/lib/project-starters.ts, set the creator starter default layout to linktree-neo-brutalist. In pps/web-builder/lib/project-preview-data.ts, fixed uildLinktreeProjectData to split link items from non-link sections instead of assigning every section into both links and sections; this removed the empty/duplicated cards showing in neo-brutalist preview. Verified with pps/web-builder build passing.

- 2026-03-31: Enriched creator linktree preview in pps/web-builder/lib/project-starters.ts with more section types already supported by shared templates. Added a promo/image section, a support/QR section, and accent colors for banner/quote so the preview shows richer possibilities beyond plain link rows. Verified with pps/web-builder build passing.

- 2026-03-31: Cleaned mojibake from shared menu templates and portfolio neo-brutalist footer. Fixed broken peso/copyright output in menu-editorial.tsx, menu-showcase.tsx, menu-runway.tsx, menu-mosaic.tsx, menu-bistro.tsx, and portfolio/neo-brutalist.tsx. g now finds no remaining Â/broken peso sequences in those paths. pps/web-builder build passes.

- 2026-03-31: Tweaked project creation selection cards in pps/web-builder/app/(private)/dashboard/projects/new/components/project-creation-page.tsx so selected/hover states keep a solid card background. Replaced translucent g-primary/10/g-accent/20 with g-card plus a light red gradient overlay on selected cards, and made audience chips use opaque g-background. Verified with pps/web-builder build passing.

- 2026-03-31: Adjusted the preview viewport toggle styling in pps/web-builder/app/(private)/dashboard/projects/new/components/project-template-preview.tsx. Replaced the rounded capsule segmented control with a sharper bordered control using divider lines and square-ish segment buttons. Verified with pps/web-builder build passing.

- 2026-03-31: Flattened the outer preview shell in pps/web-builder/app/(private)/dashboard/projects/new/components/project-template-preview.tsx by removing the large rounded border radius. Verified with pps/web-builder build passing.

- 2026-03-31: Added a Clear form action to the new project creation page in pps/web-builder/app/(private)/dashboard/projects/new/components/project-creation-page.tsx. Reset clears name/description/subdomain and restores the initial type/starter/layout/theme derived from query params/defaults. Placed it beside the create button. Verified with pps/web-builder build passing.

- 2026-03-31: Removed the mistaken Clear form button from the new project creation page in pps/web-builder/app/(private)/dashboard/projects/new/components/project-creation-page.tsx. Added the reset action where it actually belongs: Clear content buttons in the real builder forms for portfolio, linktree, and menu (.../portfolio/[slug]/components/form.tsx, .../linktree/[slug]/components/form.tsx, .../menu/[slug]/components/form.tsx). These clear content fields and nested arrays while preserving the current layout/theme selection. Verified with pps/web-builder build passing.

- 2026-03-31: Reworked the marketing homepage 'Everything you need. Nothing you don\'t.' section in pps/web-marketing/src/components/landing-page-content.tsx from a generic 4-card feature grid into a more proof-driven layout: stronger performance lead block, analytics proof block, instant public URLs with example URL rows, and conversion/template placeholders using inline placeholder visuals while waiting for real assets.

- 2026-03-31: Replaced the previous 'Everything you need. Nothing you don\'t.' homepage block in pps/web-marketing/src/components/landing-page-content.tsx with a clearer 'Why Kislap' section. New structure focuses on the product argument (less builder chaos, faster publishing rhythm) and a companion proof column for hosted URLs, built-in analytics, and template readiness using lightweight placeholder visuals.

- 2026-03-31: Tightened the homepage 'Why Kislap' proof row in pps/web-marketing/src/components/landing-page-content.tsx by changing the sample public URLs to include the https:// prefix for stronger trust signaling. Could not rerun the marketing build in this shell because 
pm is not available on PATH.

- 2026-03-31: Investigated portfolio avatar upload flow after live-site report. API/controller/service path already handled multipart vatar correctly. Tightened builder-side portfolio form in pps/web-builder/app/(private)/dashboard/builder/portfolio/[slug]/components/form.tsx to mark avatar selection dirty/validated and clear stale vatar_url when a new file is chosen. Updated pps/web-builder/app/(private)/dashboard/builder/portfolio/[slug]/components/portfolio-provider.tsx so successful saves clear the temporary vatar File, write back the saved vatar_url, and sync the in-memory project portfolio object. Could not rerun pps/web-builder build in this shell because 
pm is not available on PATH.

- 2026-03-31: Fixed brittle menu template imports in both pps/web-builder/hooks/use-template-renderer.tsx and pps/web-sites/hooks/use-template-renderer.tsx. Replaced deep imports like @kislap/templates/src/components/menu/menu-bistro with package-root MenuTemplates destructuring from @kislap/templates, matching the existing Portfolio/Biz/Linktree loading pattern. Could not rerun builds in this shell because 
pm is not available on PATH.

- 2026-03-31: Fixed web-builder shared-template resolution for Turbopack builds. web-builder is not configured as a workspace consumer of @kislap/templates, so package-root imports failed. Switched pps/web-builder/hooks/use-template-renderer.tsx and pps/web-builder/app/preview/project/preview-frame.tsx to import directly from ../../../packages/templates/src and ../../../../../packages/templates/src. Updated pps/web-builder/app/globals.css to scan ../../../packages/templates/src instead of 
ode_modules/@kislap/templates, and added experimental.turbo.root to pps/web-builder/next.config.ts so external shared-template source imports resolve cleanly from the monorepo root. Could not rerun the build in this shell because 
pm is not available on PATH.

- 2026-03-31: Updated Next config root handling for Vercel/Turbopack in both pps/web-builder/next.config.ts and pps/web-sites/next.config.ts. Replaced deprecated experimental.turbo with top-level 	urbopack, introduced a shared epoRoot constant, and set both outputFileTracingRoot and 	urbopack.root to the same repo-root path to avoid Vercel root mismatch warnings and downstream Turbopack failures.

- 2026-03-31: Adjusted web-builder shared-template consumption again after Vercel Turbopack continued failing with RangeError: Invalid count value: -1 while importing template source directly from packages/templates. Switched pps/web-builder back to package-root usage by adding @kislap/templates as a local file dependency in pps/web-builder/package.json, enabling 	ranspilePackages: ['@kislap/templates'] in pps/web-builder/next.config.ts, restoring package-root imports in pps/web-builder/hooks/use-template-renderer.tsx and pps/web-builder/app/preview/project/preview-frame.tsx, and pointing Tailwind @source back to ../../../node_modules/@kislap/templates. This makes web-builder follow the same stable package-consumer pattern as web-sites instead of importing external monorepo source directly under Turbopack.

- 2026-03-31: Changed pps/web-builder/package.json production build script from 
ext build --turbopack to plain 
ext build. Reason: Vercel production builds were still failing with opaque Turbopack RangeError: Invalid count value: -1 even after import/root fixes. Kept local dev on Turbopack for fast iteration, but moved production builds to the more stable Next/Webpack path for deployment reliability.

- 2026-03-31: After moving web-builder production builds to standard 
ext build, webpack surfaced real missing shared-template deps from the iz template family. Added leaflet, eact-leaflet, and aligned lucide-react to ^0.555.0 in pps/web-builder/package.json so shared templates imported by web-builder can compile on Vercel.

- 2026-03-31: Refined web-builder shared-template strategy again after webpack still compiled through packages/templates/src/index.ts and pulled in unnecessary package-root graph. Switched pps/web-builder/hooks/use-template-renderer.tsx to direct family-level source imports (packages/templates/src/components/biz|portfolio|linktree|menu) and changed pps/web-builder/app/preview/project/preview-frame.tsx to direct family-level source imports for portfolio/linktree/menu only, avoiding package-root src/index.ts imports. Restored Tailwind @source in pps/web-builder/app/globals.css to ../../../packages/templates/src, removed the temporary @kislap/templates file dependency from pps/web-builder/package.json, and removed 	ranspilePackages from pps/web-builder/next.config.ts so builder has one clean external-source strategy again.

- 2026-03-31: Removed iz templates from pps/web-builder/hooks/use-template-renderer.tsx. Root cause from Vercel traces: the new project creation preview only uses portfolio/linktree/menu, but the builder preview renderer still imported packages/templates/src/components/biz, which dragged in leaflet, eact-leaflet, and sibling-package dependency resolution issues. Deleted the BizTemplates import, izTemplates map, and project.type === 'biz' branch so the failing iz family no longer enters the web-builder preview build graph.

- 2026-03-31: Further narrowed web-builder shared-template imports to exact component files. Replaced family-level imports in pps/web-builder/hooks/use-template-renderer.tsx with direct component imports for each portfolio/linktree/menu template used there, and replaced family-level imports in pps/web-builder/app/preview/project/preview-frame.tsx with direct component imports for only the previewed templates. Goal: prevent family index.ts files from pulling unrelated siblings into the build graph and causing opaque Vercel compile failures.

- 2026-03-31: Identified the real monorepo resolution problem on Vercel: importing shared template source directly from ../../packages/templates/... makes those files resolve bare package deps upward from packages/templates, where pps/web-builder/node_modules is not an ancestor. Switched web-builder to the correct hybrid approach: keep @kislap/templates as a local file dependency, enable 	ranspilePackages: ['@kislap/templates'], restore Tailwind @source to ../../../node_modules/@kislap/templates, and import exact deep component files from @kislap/templates/src/components/... in both pps/web-builder/hooks/use-template-renderer.tsx and pps/web-builder/app/preview/project/preview-frame.tsx. This preserves a narrow build graph while giving the shared files proper dependency resolution from 
ode_modules/@kislap/templates.

- 2026-03-31: Updated root package.json workspaces to include pps/web-builder. This aligns the monorepo workspace graph with the actual apps consuming shared packages like @kislap/templates, and should improve local-package resolution/linking behavior in CI/Vercel for web-builder.

- 2026-04-01: Added root dev-clients.sh for Windows/Git Bash-friendly local frontend development. It launches 
pm run dev in pps/web-builder, pps/web-sites, and pps/web-marketing in parallel and traps Ctrl+C to stop all three together.

- 2026-04-01: Wired the root dev launcher into package.json with dev:clients, which runs ash ./dev-clients.sh from the repo root to start web-builder, web-sites, and web-marketing together.

- 2026-04-01: Updated root dev-clients.sh to launch frontend apps on fixed dev ports: web-builder on 3000, web-sites on 3001, and web-marketing on 4321. Next apps use -p, Astro marketing uses --port.

- 2026-04-01: Added responsive mobile/tablet switching to the new project creation page in pps/web-builder/app/(private)/dashboard/projects/new/components/project-creation-page.tsx. Desktop (xl) still uses the split form/preview layout. Below xl, a Form / Preview tab switch is shown and only one pane is rendered at a time to keep the preview readable on smaller screens.

- 2026-04-01: Tightened pps/web-builder/app/(private)/dashboard/projects/new/components/project-template-preview.tsx to prevent horizontal scrollbars in the preview shell. Changed the scroll area to overflow-y-auto overflow-x-hidden and constrained the scaled preview wrapper with maxWidth: '100%' plus overflow-x-hidden, so desktop preview scaling cannot spill beyond the container width.

- 2026-04-01: Rolled back the preview-shell overflow clamp in pps/web-builder/app/(private)/dashboard/projects/new/components/project-template-preview.tsx. The attempt to force overflow-x-hidden and maxWidth: '100%' on the scaled preview wrapper caused broader preview breakage, so the shell was restored to the prior overflow-auto / plain wrapper behavior.

- 2026-04-01: Adjusted pps/web-builder/app/(private)/dashboard/projects/new/components/project-template-preview.tsx so Desktop preview mode on narrow screens uses a true wide canvas with horizontal scrolling instead of forced scaling/clipping. Added useHorizontalDesktopScroll condition: when iewport === 'desktop' and the available preview width is under 1024 and narrower than the desktop canvas, scale is pinned to 1 and the preview shell becomes overflow-x-auto overflow-y-auto. Tablet/mobile preview modes still use the fit-to-pane scaling behavior.

- Tightened mobile create-project preview containment: added min-w-0/max-w-full to the project creation grid and preview column, and updated the preview shell so desktop-mode horizontal scrolling stays inside the preview area instead of expanding the whole page (pps/web-builder/app/(private)/dashboard/projects/new/components/project-creation-page.tsx, pps/web-builder/app/(private)/dashboard/projects/new/components/project-template-preview.tsx).

- Added a live unsaved-data preview to the portfolio builder form: introduced Form / Preview tabs above the content/design area, added portfolio-form-preview.tsx that renders the shared portfolio template from current form values plus layout/theme (no save required), and wired the form to swap the editing UI with the live preview (pps/web-builder/app/(private)/dashboard/builder/portfolio/[slug]/components/form.tsx, pps/web-builder/app/(private)/dashboard/builder/portfolio/[slug]/components/portfolio-form-preview.tsx).

- Extended live unsaved-data preview tabs to linktree and menu builder forms: added Form / Preview tabs above the editing area, introduced linktree-form-preview.tsx and menu-form-preview.tsx, and wired both forms to render shared-template previews from current unsaved form values plus layout/theme (including temporary object URLs for unsaved logo/cover/item/gallery/category images in the menu preview).

- Extended ThemeControlPanel with a separate Swap palettes action that swaps 	heme.styles.light and 	heme.styles.dark without changing the active editing mode, and fixed the non-stateless update path to call updateSettings(newSettings) instead of sending stale settings (pps/web-builder/components/customizer/theme-control-panel.tsx).

- Refined ThemeControlPanel UX by combining the active mode toggle and palette swap action into one compact Mode section, with the mode toggle as the primary control and Swap palettes as a secondary action in the same cluster (pps/web-builder/components/customizer/theme-control-panel.tsx).

- Softened the combined mode/swap UI in ThemeControlPanel by removing the extra boxed card treatment, switching it to a divider-based row, and making Swap palettes a quieter secondary action (pps/web-builder/components/customizer/theme-control-panel.tsx).

- Refined the combined mode/swap UX again in ThemeControlPanel: removed the divider line, moved Swap palettes below the mode toggle, and changed it into a flatter ghost-style utility action with an ArrowUpDown icon (pps/web-builder/components/customizer/theme-control-panel.tsx).

- Highlighted the active theme editing state in ThemeControlPanel by changing Editing light/dark into a small pill-style status chip so the current editing bucket is easier to notice (pps/web-builder/components/customizer/theme-control-panel.tsx).

- Adjusted the active theme editing state styling in ThemeControlPanel again: replaced the pill chip with a lighter underlined text treatment for Editing light/dark (pps/web-builder/components/customizer/theme-control-panel.tsx).

- 2026-04-01: Hardened template overflow handling for mobile/shared links. Updated the menu template family (packages/templates/src/components/menu/menu-default.tsx, menu-editorial.tsx, menu-bistro.tsx, menu-showcase.tsx, menu-runway.tsx, menu-mosaic.tsx) so QR/share URL blocks use full-width wrapping containers instead of truncating pill rows, which fixes long social-app URLs like ?fbclid=... from blowing out the layout. Also loosened a few badge/variant/date chips in portfolio/menu templates (packages/templates/src/components/portfolio/default.tsx, minimal.tsx, ento.tsx, glass.tsx) by removing nowrap assumptions and allowing word wrapping.

- 2026-04-01: Normalized menu QR/share links to canonical page URLs. Added 
ormalizeMenuShareUrl in packages/templates/src/components/menu/menu-types.ts and updated the menu template family (menu-default.tsx, menu-editorial.tsx, menu-bistro.tsx, menu-showcase.tsx, menu-runway.tsx, menu-mosaic.tsx) so displayed share URLs, copied links, and QR code data use origin + pathname instead of full tracked URLs with query strings like ?fbclid=....

- 2026-04-01: Fixed the menu-default logo overlay bug in packages/templates/src/components/menu/menu-default.tsx. The diagonal slash element inside the circular logo shell was being rendered even when a real logo_url image existed, causing a visible white/foreground line across uploaded logos. It now renders only for the fallback logo mark.

- 2026-04-01: Fixed marketing showcase/public project URL generation in pps/web-marketing/src/lib/site-config.ts. getPublicProjectUrl now builds real subdomain-based public URLs (subdomain.kislap.app / subdomain.localhost:3001) instead of the old /sites/{subdomain} path pattern, so showcase cards and live previews point at the correct public host style again.

- 2026-04-01: Fixed mojibake in packages/templates/src/components/shared/kislap-share-footer.tsx. Restored proper ©, ♥, and ✨ characters so shared footers no longer render question-mark/garbled symbols in the ‘Made with’ and ‘Powered by Kislap’ lines.

- 2026-04-01: Fixed placeholder ? symbols in the menu-default template footer (packages/templates/src/components/menu/menu-default.tsx). Replaced the hardcoded question marks with ♥ for 'Made with' and ✨ for 'Powered by Kislap'. This was separate from the shared footer mojibake cleanup.

- 2026-04-01: Added optional PDF-only resume upload to the portfolio stack. Backend: added resume_url to portfolios and extended the existing portfolio multipart upload flow to accept a resume file and store it under the same object-storage path pattern using a dedicated resume folder (apps/api-service/models/portfolio.go, apps/api-service/internal/portfolio/portfolio_dto.go, portfolio_controller.go, portfolio_service.go). Builder: extended portfolio schema/types/API response types with resume and resume_url, updated the provider/save payload to persist and hydrate resume state, and added an inline PDF uploader to the Header & Bio section of the portfolio form using the existing Dropzone component (apps/web-builder/lib/schemas/portfolio.ts, apps/web-builder/types/portfolio.ts, apps/web-builder/types/api-response.ts, apps/web-builder/app/(private)/dashboard/builder/portfolio/[slug]/components/portfolio-provider.tsx, portfolio-save-payload.ts, form.tsx). Preview: portfolio form preview now creates an object URL for an unsaved resume file and passes resume_url into the live preview project (portfolio-form-preview.tsx, apps/web-builder/lib/project-preview-data.ts). Templates: added a shared PortfolioResumeButton helper and rendered it across the portfolio template family so a download CTA only appears when resume_url exists (packages/templates/src/components/portfolio/portfolio-resume-button.tsx plus default.tsx, neo-brutalist.tsx, newspaper.tsx, minimal.tsx, glass.tsx, bento.tsx, cyber.tsx, kinetic.tsx, vaporware.tsx). Also updated web-sites shared types with resume_url (apps/web-sites/types/portfolio.ts, apps/web-sites/types/api-response.ts).

- 2026-04-01: Added the missing schema migration for portfolio resumes in the repo’s real migration layer: apps/web-admin/database/migrations/2026_04_01_180000_add_resume_url_to_portfolios_table.php. This adds a nullable resume_url column to portfolios after avatar_url and drops it on rollback. The Go API itself does not have a migration runner, so web-admin migrations remain the schema source of truth.
- 2026-04-02: Reworked web-marketing information architecture for sitelink-friendly SEO without inventing a pricing page. Added a real /features hub plus canonical child pages at /features/portfolio-builder, /features/link-page-builder, and /features/digital-menu-builder (apps/web-marketing/src/pages/features.astro and features/*). Updated the main layout nav/footer/schema to treat Features as the product parent, added cleaner WebSite + Organization structured data, removed the old SearchAction markup, and switched internal marketing links/homepage feature cards to the /features/... paths (apps/web-marketing/src/layouts/main.astro, apps/web-marketing/src/components/landing-page-content.tsx, apps/web-marketing/src/lib/site-config.ts). Kept the legacy /portfolio-builder, /linktree-builder, and /menu-builder routes alive as noindex canonical aliases pointing to the new /features/... pages.
- 2026-04-02: Implemented web-admin Phase 1 with Filament 4. Installed filament/filament into apps/web-admin, ran the panel installer, and added the Admin panel provider with Kislap Admin branding (apps/web-admin/composer.json, composer.lock, app/Providers/Filament/AdminPanelProvider.php, bootstrap/providers.php, public/filament assets). Added core Eloquent models for Project, Layout, ReservedSubDomain, and ParsedFile plus upgraded User to match the actual schema: first_name/last_name, role, booleans, projects relation, parsedFiles relation, full_name accessor, SoftDeletes, and FilamentUser access control that allows all users locally but requires admin/super_admin outside local (apps/web-admin/app/Models/*). Scaffolded and filled Phase 1 Filament resources for Users, Projects, Layouts, and ReservedSubDomains with practical forms, tables, filters, soft-delete handling, and navigation groups (apps/web-admin/app/Filament/Resources/**). Also changed the web-admin root route to redirect to /admin so the app behaves like an admin tool instead of showing the default Laravel welcome page (apps/web-admin/routes/web.php).
- 2026-04-02: Wired web-admin into the local Docker dev flow for actual browser access. Updated docker-compose.yml so kislap_admin runs `php artisan serve --host=0.0.0.0 --port=8000` instead of only php-fpm, and added an nginx local virtual host for admin.kislap.test that proxies to kislap_admin:8000 (.docker/nginx/conf/local/default.conf). This makes the Filament admin reachable through the local nginx layer instead of only exposing an otherwise non-HTTP PHP-FPM port.
- 2026-04-02: Moved the local web-admin HTTP startup into the image itself. Updated apps/web-admin/Dockerfile so the container default command is `cron && php artisan serve --host=0.0.0.0 --port=8000`, and removed the matching command override from docker-compose.yml. This keeps the service behavior inside the image definition instead of splitting it across Dockerfile and compose.
- 2026-04-02: Fixed web-admin Docker build failure caused by missing PHP intl extension required by the Filament/Laravel dependency set. Updated apps/web-admin/Dockerfile to install libicu-dev and enable the intl extension via docker-php-ext-install intl before composer install.
- 2026-04-02: Simplified local access to web-admin by mapping the container's Laravel server to a dedicated host port. Updated docker-compose.yml so kislap_admin exposes 8010:8000, making the Filament panel reachable directly at http://localhost:8010/admin without relying on local hostname routing.
- 2026-04-02: Switched web-admin port mapping back to a simple 1:1 host mapping. Updated docker-compose.yml so kislap_admin exposes 8000:8000, making the Filament admin reachable at http://localhost:8000/admin.
- 2026-04-02: Added a default admin seeder for the Filament panel in web-admin. Created AdminUserSeeder to upsert admin@kislap.test / password with role super_admin, and wired it into DatabaseSeeder before ReservedSubDomainsSeeder (apps/web-admin/database/seeders/AdminUserSeeder.php, apps/web-admin/database/seeders/DatabaseSeeder.php).
- 2026-04-02: Switched web-admin back to php-fpm for better Docker performance. Updated apps/web-admin/Dockerfile to run php-fpm instead of php artisan serve. The nginx local vhost (admin.kislap.test) already proxies to kislap_admin:8000 so this path remains valid; localhost:8000 now serves PHP-FPM behind the nginx proxy.
- 2026-04-02: Routed localhost:8000 through nginx instead of php-fpm. Updated docker-compose.yml so kislap_web_server exposes 8000:80, and removed the direct 8000 mapping from kislap_admin. Admin should now be reachable at http://localhost:8000/admin via nginx vhost routing, while php-fpm stays behind the proxy.
- 2026-04-02: Phase 2 step 1: Added Project-level relation managers for portfolio, linktree, menu, and page activities so admins can inspect the content attached to each project without adding new top-level resources. Implemented missing content models (Portfolio, Linktree, Menu, PageActivity, MenuCategory, MenuItem, LinktreeSection) with key fillable fields, casts, and relations; expanded Project model with hasOne/hasMany relations for portfolio/linktree/menu/pageActivities. Added relation manager classes under app/Filament/Resources/Projects/RelationManagers and wired them into ProjectResource::getRelations.

## 2026-04-02 Phase 2 Admin Expansion
- Added Portfolio, Linktree, and Menu Filament resources with full CRUD pages, forms, and tables.
- Added relation managers for portfolio work experiences, education, showcases, showcase technologies, and skills.
- Added relation managers for linktree sections and links.
- Added relation managers for menu categories and menu items (with category picker filtered by menu).
- Added missing portfolio/linktree/linktree-link models and portfolio relations for nested records.
- Added admin dashboard widgets: stats overview and recent projects; updated panel widgets list.


## 2026-04-03 Admin Phase 2 (Ops + Moderation + Roles)
- Added support role to user roles and panel access; support is read-only in admin UI actions.
- Added BaseResource to centralize read-only rules for support users.
- Added read-only resources for Parsed Files and Page Activities under Operations.
- Added Showcase moderation fields migration and moderation resource with approve/feature actions.
- Updated portfolio showcase relation manager to include moderation flags and placement order.


## 2026-04-03 Web Admin Prod Docker
- Updated web-admin production Dockerfile to install intl and set ownership for storage/cache.
- Hardened prod compose to use kislap_admin internal expose only and removed dev-only volume mounts.


## 2026-04-03 Web Admin Prod Build Fix
- Simplified web-admin prod Dockerfile composer install to run scripts with COMPOSER_ALLOW_SUPERUSER and removed separate dump-autoload step.


## 2026-04-03 Web Admin Prod Build Fix 2
- Moved composer install to run after full app copy so artisan is available for package:discover.


## 2026-04-03 Web Admin Prod Build Fix 3
- Disabled composer scripts in prod build to avoid Filament bootstrapping before vendor is ready.
- Moved package discovery to container startup command.


## 2026-04-03 Web Admin Prod Cache Cleanup
- Clear bootstrap/cache/*.php before package discovery to avoid stale dev providers (e.g. Pail) in prod.


## 2026-04-03 Admin Port 3000 via Nginx
- Exposed port 3000 on kislap_web_server and added nginx server block to route :3000 to kislap_admin fastcgi.
- Switched kislap_admin to internal expose only in prod compose.


## 2026-04-03 Admin Port 3000 404 Fix
- Updated nginx :3000 server block to pass all requests to Laravel index.php via fastcgi (no local try_files).

