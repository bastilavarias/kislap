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
- Rebuilt the `clean` menu display-poster generator to match a hardcoded screenshot-style reference: solid red background, `MENÜ` heading, two white instruction pills, corner-bracket QR framing, arrow accent, and `OBLOMOV` footer wordmark. The layout now ignores dynamic poster copy/colors and only keeps the live QR while scaling cleanly for A4/A5/A6. [2026-04-14][CODE]
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
- 2026-04-14 [CODE] Replaced the previous generic `clean` poster composition in `apps/api-service/internal/menu/menu_display_poster.go` with a screenshot-matched static reference layout. Current `clean` intentionally hardcodes the red palette, Turkish instruction text, and `OBLOMOV` footer wordmark while keeping the QR live and scaling the composition across A4/A5/A6.
- 2026-04-14 [TOOL] `go test ./internal/menu` passed in `apps/api-service` after the `clean` display-poster update.

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


## 2026-04-03 Admin FastCGI Params
- Expanded :3000 nginx fastcgi params (index, PATH_INFO, PATH_TRANSLATED) to avoid 404s from PHP-FPM.


## 2026-04-03 Admin FastCGI Port Standardization
- Reverted web-admin PHP-FPM to default port 9000 and updated nginx/admin compose to target 9000.


## 2026-04-03 Admin Nginx Root Mount
- Mounted web-admin public assets into nginx and switched :3000 to standard Laravel try_files + php handler.


## 2026-04-06 Admin Enhancements (No Showcase Queue)
- Added project content inspector with content status + issues and a project health dashboard table.
- Added admin audit log model, migration, logger, and read-only resource.
- Added user support actions (verify email, reset password, impersonate/stop) and audit logging.
- Added project publish/unpublish actions + bulk actions with audit logs.


## 2026-04-08 Admin Nav Cleanup
- Hid Parsed Files, Page Activities, and Showcase resources from Filament navigation and blocked view access without deleting resource files yet.
- Hid Layouts resource from Filament navigation and blocked direct access for now so layout management can return later as a separate feature.

## 2026-04-08 Admin Hosted Site Shortcut
- Added env-driven hosted-site URL support in web-admin via config('app.site_url') / SITE_URL, with wildcard replacement for project subdomains.
- Added a Visit site action to the Projects table that opens the hosted public page in a new tab using the project's sub_domain.

## 2026-04-08 Linktree Admin Simplification
- Removed the Sections relation manager from the Linktree edit page for now, leaving only Links in the lower relation area.
- Added reusable small URL preview actions for active admin forms and dialogs, covering hosted/public site-related website and image URL fields without adding extra card chrome.
- Applied the same centered single-form pattern from Linktree to Portfolio and Menu: root schema forced to one column, main details live in one primary section, theme JSON moved into collapsed accordions, and edit/create pages now use a large centered content width.


## 2026-04-08 Admin Dashboard Foundation
- Added AdminDashboardService to centralize overview metrics, traffic trend data, publishing status buckets, top projects, and needs-attention project ranking for Filament widgets.
- Expanded the admin dashboard from basic totals into a fuller command-center layout: overview stats, traffic chart, publishing snapshot chart, top projects table, recent admin activity, and a focused needs-attention projects table.
- Kept dashboard implementation inside web-admin only for now; any future shared/public dashboard APIs should be created in api-service (Go), not here.


## 2026-04-08 Dashboard Visual Structure + Public Metrics API
- Reduced the admin dashboard's box-heavy feel by removing dashboard tables, trimming the top stat cards, and adding lightweight section header widgets for overview, content/product mix, and operations.
- Added more chart-led widgets: top projects by traffic, needs-attention by type, and admin action breakdown.
- Added a reusable public metrics endpoint in api-service at GET /api/dashboard/public for marketing/builder-friendly aggregate stats (published sites, active builders, total views, total clicks, CTR, and published project type mix).


## 2026-04-08 Marketing Analytics Foundation
- Added shared marketing analytics tables via Laravel migration: marketing_sessions and marketing_events in the shared database.
- Added marketing analytics APIs in api-service for session start, event tracking, heartbeat, session end, and overview reporting at /api/marketing-analytics/overview.
- Wired web-admin to consume marketing analytics from api-service through MarketingDashboardClient and added a dedicated Marketing website section with chart widgets for trend, top pages, sources, and event mix.
- Kept builder project analytics (page_activities) separate from marketing website analytics by design.

## 2026-04-08 Marketing Help Inbox
- Added a shared `help_inquiries` table via Laravel migration for marketing-site support requests, including IP address, admin status/notes, and resolution timestamp fields.
- Added a public api-service endpoint at `POST /api/help-inquiries` backed by a new help inquiry service/model, with server-side spam protection capped at 3 submissions per day per IP.
- Added a new `/help` page in `web-marketing` with a compact support form that posts to api-service, plus a footer/header Help touchpoint and env-driven contact email support.
- Added a new `Help Inquiries` Filament resource in `web-admin` under `Support` so marketing submissions can be reviewed and marked in progress/resolved.

## 2026-04-13 Menu Display Poster Redesign Plan
- Current state: the display-poster generator now uses HTML/CSS rendered to PNG in `apps/api-service/internal/menu/menu_display_poster.go`, and the latest `brand` output is structurally better but still feels too boxy, too dashboard-like, and not yet compelling as a real in-store asset. [2026-04-13][USER]
- Direction locked: stop treating the poster like a promo flyer or admin card stack. The visual basis should come from the existing menu template family (`menu-showcase`, `menu-editorial`, `menu-runway`, `menu-default`) and then be elevated with stronger poster composition, not random decorative blocks. [2026-04-13][USER]
- Product framing locked: this feature is `Generate Display Poster`, not literal printing. The output should feel like a polished asset a restaurant would actually place in an acrylic stand or counter display. [2026-04-13][USER]

### Redesign goals
- Blend the strongest qualities of the menu templates with poster-specific visual drama:
  - menu-template strengths: cover-led hero, refined typography, cleaner information hierarchy, believable hospitality styling
  - poster strengths: bolder CTA, scannable QR prominence, stronger vertical flow, faster distance readability
- Reduce the “box inside box inside box” feeling by introducing more asymmetry, overlap, soft transitions, and fewer equally weighted panels.
- Make the poster feel designed for physical use:
  - the QR block should read as the primary interaction target
  - the hero should sell the venue mood
  - business/location/menu link details should support, not dominate
- Keep theme-derived colors, but use them more artfully:
  - stronger tonal layering
  - better surface contrast
  - less flat card-grid behavior

### Design problems to solve in the next pass
- Too boxy:
  - every region currently has similar card treatment, which makes the poster feel like a dashboard, not a branded display asset
- Weak visual rhythm:
  - the current layout still reads as a 2x2 information grid rather than a deliberate poster composition
- QR hierarchy needs refinement:
  - QR is present but not yet treated as the hero interaction moment
- Not enough artistic tension:
  - poster needs stronger interplay between photography, copy, and accent color
- Menu DNA is present but not yet fully absorbed:
  - current result borrows structure, but not enough of the mood and sophistication from the public menu templates

### Design principles for the next implementation
- One dominant visual anchor:
  - either the hero image or the QR block must lead immediately, with the other clearly secondary
- One clear CTA zone:
  - headline + QR + short instruction should work together as one cohesive scan invitation
- Soft composition over rigid panels:
  - use fewer hard-bordered rectangles
  - prefer layered surfaces, tinted overlays, embedded badges, and sectional contrast
- Poster-first typography:
  - headlines should be shorter, tighter, and composed for distance readability
  - support copy should be quieter and constrained
- Real hospitality mood:
  - image treatment, spacing, and copy blocks should feel more like a menu brand and less like a dashboard report
- Print-aware layout:
  - preserve generous breathing room at A4/A5/A6 without overfilling small sizes

### Proposed visual architecture for `brand`
- Hero strip:
  - large mood image as the top or upper-left visual anchor
  - venue name and small kicker integrated into the hero, not floating as an unrelated block
  - logo treated as a compact premium badge, not a dominant tile
- CTA/scan area:
  - larger QR presence with better framing
  - “Scan to view our menu” / “Scan here” copy should feel like one design unit
  - reduce competing red/info cards near the QR
- Secondary detail area:
  - address, menu URL, and size note should become a quieter support band or footer cluster
  - avoid giving metadata equal visual weight with the CTA
- Accent treatment:
  - use accent color as a ribbon, band, overlay, highlight chip, or CTA emphasis
  - avoid filling many separate boxes with the accent color

### Concrete implementation plan
1. Recompose the `brand` template around three visual zones instead of four equal cards:
   - hero/media zone
   - scan/CTA zone
   - support/details zone
2. Reduce border-heavy styling:
   - fewer outlined cards
   - more tonal surfaces and nested contrast
3. Introduce controlled overlap:
   - allow the QR section or headline band to visually tuck into the hero/image area where appropriate
4. Refine typography scale rules by size:
   - A4 can support stronger display typography
   - A5/A6 need tighter headline clamping and fewer support lines
5. Rework spacing system:
   - larger macro spacing between zones
   - tighter micro spacing within copy groups
6. Simplify support content:
   - address and URL should collapse gracefully when absent
   - footer note should stay small and non-competing
7. Keep HTML/CSS renderer:
   - do not revert to hand-built SVG
   - continue using `utils.CaptureHTML(...)` and Chromium PNG generation

### Poster-template evolution path
- Phase A: refine `brand` into a compelling default poster with stronger menu-template influence
- Phase B: refine `clean` so it becomes a practical “safe for any restaurant” option
- Phase C: add more expressive template variants only after `brand` and `clean` are actually strong enough to ship

### Guardrails for the next implementation pass
- Do not chase a literal flyer clone again.
- Do not add more decorative blocks just to make the poster look “busy”.
- Do not increase information density unless it improves scan intent or venue clarity.
- Do not let theme colors overpower QR readability or text contrast.
- Keep the build focused on composition, hierarchy, and realism rather than feature creep.

## 2026-04-13 Menu Display Poster Next Iteration Plan
- Current visual status: the `brand` display poster is now materially better after the HTML/CSS redesign pass. It has stronger structure, better atmosphere, and better menu-template influence, but it still feels like a promising draft rather than a polished, desirable in-store asset. [2026-04-13][USER]
- User feedback: “much better but not that yet”; continue later. The next pass should be planned deliberately, not improvised. [2026-04-13][USER]

### What improved
- The poster no longer looks like the old promo-flyer clone.
- The overall structure is clearer:
  - hero image/mood area
  - CTA / scan block
  - support details
- The dark stage and softer tonal surfaces are stronger than the previous rigid card stack.
- The QR zone feels more purposeful and less random than earlier versions.

### What still feels off
- Still too componentized:
  - even though the boxes are softer, the poster still reads as assembled UI modules rather than one cohesive composition
- Hero and CTA are not fully “talking” to each other:
  - they coexist, but they do not yet feel like one designed flow
- The right-side support/meta stack still feels product-UI-ish:
  - useful, but not elegant enough for a print/display asset
- Typography hierarchy is improved but still not memorable:
  - the headline is readable, but not yet premium or iconic
- The current composition is safe:
  - cleaner than before, but still not “sellable” enough for future physical display products

### Core objective for the next visual pass
- Move the poster from:
  - “well-structured UI poster”
- toward:
  - “brand-led display piece that still happens to contain QR and info”

### Deep design direction for the next pass
1. Unify the poster into one composition
- Reduce the feeling that each major block has equal autonomy.
- Hero image, headline, QR, and meta should feel like parts of one orchestrated layout.
- Introduce more visual dependency between zones:
  - overlap
  - alignment rhythm
  - shared background surfaces
  - repeated shape language

2. Refine the visual hierarchy
- First read should be:
  - venue mood
  - scan CTA
  - QR
- Second read should be:
  - menu purpose / supporting copy
  - restaurant name
  - practical details
- Third read should be:
  - address, URL, size note

3. Make the poster less “admin UI”, more “hospitality graphic”
- Reduce the number of equally bordered cards.
- Replace some card containers with:
  - integrated bands
  - inset overlays
  - floating chips
  - quieter footer clusters
- Keep only the surfaces that truly help readability.

4. Improve the QR interaction moment
- The QR should feel like a central invitation, not just a technical block.
- Explore:
  - stronger QR framing
  - better CTA text alignment
  - tighter relationship between CTA and QR
  - more deliberate breathing room around the scan area

5. Make the hero more emotionally useful
- The hero image should sell venue mood and brand tone, not just occupy space.
- The overlay copy inside the hero should feel more refined:
  - less “card over image”
  - more like editorial caption / venue signature

6. Tone down support details without losing utility
- Restaurant / format / address / URL are still useful, but they should not read as equal to the scan CTA.
- These should become:
  - quieter support modules
  - likely closer to a footer/info rail than a dominant right-side stack

7. Push the typography further
- Headline:
  - more intentional line breaks
  - cleaner rhythm
  - less generic “template display text”
- Support copy:
  - shorter
  - calmer
  - more restrained
- Kicker/labels:
  - smaller and more precise

### Candidate layout directions for the next pass
- Direction A: Editorial asymmetry
  - larger dominant hero
  - QR partially anchored into the lower edge of the hero zone
  - details compressed into a cleaner bottom rail
- Direction B: Centered scan emphasis
  - QR becomes the compositional center
  - hero and details support it from top and bottom
- Direction C: Split-stage premium
  - left side mood / venue
  - right side CTA / QR / essential support
  - but with far fewer boxed separations than the current version

### Recommended next choice
- Start with Direction A: Editorial asymmetry
- Reason:
  - it best combines menu-template DNA with poster/art direction
  - it can feel more premium and less dashboard-like
  - it gives the QR a more natural “featured but integrated” role

### Implementation priorities for the next pass
1. Recompose the layout first before touching color or typography details.
2. Reduce support-card emphasis and move details toward a calmer footer/info treatment.
3. Integrate the QR block more tightly with the hero/CTA relationship.
4. Refine headline line breaks and spacing after the composition settles.
5. Only then revisit minor polish:
  - chip styling
  - micro-copy
  - shadow softness
  - gradient tuning

### Explicit non-goals for the next pass
- Do not add more decorative shapes just to make it feel “designed”.
- Do not add more text fields or feature options.
- Do not add more templates before `brand` is genuinely strong.
- Do not fall back to the earlier flyer/reference composition.

## 2026-04-13 Display Poster Reference-Copy Test Template
- Added a dedicated poster template option for controlled renderer testing: `reference-copy`.
- Purpose: validate whether the HTML/CSS -> PNG pipeline can reproduce a near-literal poster reference more tightly than the earlier SVG and freestyle HTML attempts.
- Wired end to end:
  - API branch in `apps/api-service/internal/menu/menu_display_poster.go`
  - builder schema/type support in `apps/web-builder/lib/schemas/menu.ts` and `apps/web-builder/types/api-response.ts`
  - builder template selector in `apps/web-builder/app/(private)/dashboard/builder/menu/[slug]/components/poster-panel.tsx`
- Current intent: this template is not the product direction for the main poster system; it is a visual fidelity experiment to test how closely we can copy a supplied reference using the new HTML/CSS renderer.

