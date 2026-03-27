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
