# .agents/AGENTS.md

This file mirrors the canonical rules in root `AGENTS.md`.

## Important rules

- Build modular first. No code files longer than 300 lines of code! Documentation, plans etc. can be as long as needed, but code files must be modular.
- Think ahead! Do not write code that you know will need to be changed later without planning for that change now. So keep entrypoints stable and isolate logic into smaller modules from the start!
- Do not limit yourself due to the LOC limit! If a task requires more code, split it into multiple files/modules/functions.
- When splitting a large UI/module into multiple related components, do not leave too many sibling files in one flat directory. If the split produces several related files, group them into a dedicated folder named after the feature/template/component family and keep a clear entry file so the structure stays easy to scan.
- Do not add default fallbacks during development phase. Is something fails, let it fail, so we can fix it!
- Do not leavy empty try-catch blocks anywhere!
- Do not reinvent the wheel! Use open source, self-hosted libraries when needed. Ask the user, and help them qualify their selection.
- Design UI for the end-user, not for the schema!

## Active UI Skill: gpt-taste

- For frontend, marketing, public-template, landing-page, and rich UI implementation work, apply the `gpt-taste` skill.
- Before writing React/UI code for those surfaces, include a `<design_plan>` with deterministic layout/font/component/motion selections, AIDA coverage, hero line-width math, bento density math, label sweep, and button contrast verification.
- Use premium navigation first, then AIDA structure: Attention hero, Interest bento/interactive content, Desire GSAP motion/media, Action CTA/footer.
- Use wide hero typography that stays within 2-3 lines; avoid stamp icons, spam tags, raw hero stats, and cheap meta-labels like `SECTION 01` or `QUESTION 05`.
- Bento grids must use `grid-flow-dense` and have mathematically verified spans with no empty cells.
- Motion-rich UI should use real GSAP/ScrollTrigger where appropriate, plus hover physics on clickable cards/images.
- Prefer sophisticated assets and contextual imagery; wrap rich pages in an overflow-safe root such as `overflow-x-hidden w-full max-w-full`.

## Kislap Design Direction

- Default visual language: disciplined neo-brutalist, not generic SaaS polish.
- Use a hard, editorial structure: strong grid alignment, thick black borders, square corners, bold shadows, oversized uppercase display type, and intentional asymmetry.
- Core palette: black, white, Kislap red/primary, and secondary yellow. Use page-type accents sparingly: blue for portfolio, fuchsia for link page, amber for menu.
- Typography: prefer Outfit for product/marketing surfaces and JetBrains Mono for small technical/action labels. Avoid soft generic gradient text unless there is a specific reason.
- Components: do not reinvent primitives when shadcn/Radix-style local components exist. Reuse `Button`, `Badge`, `Accordion`, dialogs, menus, tabs, etc., then style them to match the brutalist system.
- Builder redesign direction: use the same visual DNA but tune density for productivity. Builder UI can be calmer and more operational, but should still use clear borders, strong section hierarchy, direct labels, and decisive states.
- Avoid “AI/SaaS template” tropes: pill-label clutter, glassmorphism as the primary style, vague feature cards, fake stats, soft gradient blobs, generic dashboards, and copy aimed at developers instead of end users.
- Content should be consumer-centered: talk about what users can publish, share, inspect, or improve. Keep internal implementation notes out of visible UI except explicit placeholder image replacement notes during design drafts.
- Media placeholders must state replacement sizes clearly, but final UI should use real product screenshots, published page captures, menu/QR assets, or contextual photography.
- Motion should feel physical: pinned sections, card stacking, horizontal rails, scale/fade on media, and tactile hover movement. Avoid fade-only motion for major marketing sections.

## Kislap Brand Identity Addendum

- Brand essence: "fill the form, publish the site." Kislap turns structured inputs into visible public pages while hiding domain, database, code, hosting, and page-generation complexity.
- Kislap should feel practical, fast, creative, and public-facing. The product is not a blank-canvas site builder; it is a focused publishing system for portfolios, link pages, and digital menus.
- Core visual identity: black/white structure, Kislap red (`#ff3132`), secondary yellow, occasional cyan/fuchsia/amber accents, thick black outlines, square geometry, hard offset shadows, and oversized uppercase editorial type.
- Builder screens should be calmer than marketing pages. Keep the brand DNA, but prioritize operational clarity, dense controls, direct labels, and stable workflows.
- Brutalist does not mean chaotic. Avoid loud diagonal fills, decorative clutter, fake preview blocks, excessive card stacks, and unnecessary framed containers when a simple product surface works better.
- Use cards only when they are structurally useful: repeated items, modals, focused tools, or browser/page previews. Avoid nested cards and avoid making every section a framed card.
- Visible copy should be consumer-centered: what the user can publish, share, inspect, update, or open. Avoid implementation-first language unless the section is explicitly about platform mechanics.

## Kislap Image & Illustration Language

- Primary visual metaphor: forms becoming public pages. Prefer imagery that shows structured fields, checkboxes, upload controls, menus, link rows, and portfolio sections transforming into a finished website.
- Best illustration style: flat neo-brutalist digital art with thick black outlines, sharp rectangles, hard offset shadows, visible grid discipline, high contrast, and a practical publish energy.
- Best real media: actual published Kislap pages, browser-like screenshots, menu/QR assets, founder/project examples, or contextual imagery that directly explains what is being built.
- Avoid generic laptop mockups, fake dashboards, anonymous SaaS charts, random decorative blobs, 3D glass panels, soft gradients, and unreadable UI clutter.
- Do not put hero/login/product visuals inside decorative cards unless the feature is literally a browser/page preview. A full-bleed or naturally cropped image often fits the brand better.
- If generating brand art, use this base prompt:
  `Bold neo-brutalist digital illustration of an oversized web form transforming into a published website page. Large form fields, checkboxes, upload controls, and a submit action flow into clean public page sections, links, menu rows, and profile blocks. Thick black outlines, sharp edges, hard offset shadows, white background, black, Kislap red #ff3132, bright yellow, cyan, and small pink accents. Practical, energetic, polished but raw. No people, no logos, no readable brand names, no glassmorphism, no soft 3D, no gradients, no fake dashboard charts, no card frame. Landscape 16:10, suitable for a sign-in or marketing left-side visual with open space near one edge.`

## Continuity Ledger (compaction-safe)

Maintain a single continuity file for this workspace: `CONTINUITY.md`.
`CONTINUITY.md` is the canonical briefing designed to survive compaction; do not rely on earlier chat/tool output unless it's reflected there.

### Operating rule

- At the start of each assistant turn: read `CONTINUITY.md` before acting.
- Update `CONTINUITY.md` only when there is a meaningful delta in: Goal/success criteria, Invariants/constraints, Decisions, State (Done/Now/Next), Open questions, Working set, or important tool outcomes.

### Keep it bounded (anti-bloat)

- Keep `CONTINUITY.md` short and high-signal:
  - `Snapshot`: <= 25 lines.
  - `Done (recent)`: <= 7 bullets.
  - `Working set`: <= 12 paths.
  - `Receipts`: keep last 10-20 entries.
- If sections exceed caps, compress older items into milestone bullets with pointers (commit/PR/log path/doc path). Do not paste raw logs.

### Anti-drift rules

- Facts only, no transcripts.
- Every entry must include:
  - a date or ISO timestamp (e.g., `2026-01-13` or `2026-01-13T09:42Z`)
  - a provenance tag: `[USER]`, `[CODE]`, `[TOOL]`, `[ASSUMPTION]`
- If unknown, write `UNCONFIRMED` (never guess). If something changes, supersede it explicitly (don't silently rewrite history).

### Decisions and incidents

- Record durable choices in `Decisions` as ADR-lite entries (e.g., `D001 ACTIVE: ...`).
- For recurring weirdness, create a small, stable incident capsule (Symptoms / Evidence pointers / Mitigation / Status).

### Plan tool vs ledger

- Use `update_plan` for short-term execution scaffolding (3-7 steps).
- Use `CONTINUITY.md` for long-running continuity ("what/why/current state"), not micro task lists.
- Keep them consistent at the intent/progress level.

### In replies

- Start with a brief "Ledger Snapshot" (Goal + Now + Next + Open Questions).
- Print the full ledger only when it materially changed or the user requests it.

## Continuity Index
- `.agents/continuity/architecture.md`
- `.agents/continuity/invariants.md`
- `.agents/continuity/pitfalls.md`
- `.agents/continuity/decisions.md`
- `.agents/continuity/workflow.md`
