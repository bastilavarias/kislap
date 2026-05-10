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
