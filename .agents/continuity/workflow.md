# Workflow Continuity

## Default Debug Flow
1. Start from stack trace file + line.
2. Verify current code path before editing.
3. Patch the smallest failing path.
4. Check adjacent null/SSR/type risks.
5. Summarize exact files changed and residual risk.

## Validation Expectations
- Run lint/typecheck/build when tooling is available.
- If tooling is unavailable in shell, state that explicitly.

## Update Discipline
- When a new bug class appears, add one short entry to:
  - `pitfalls.md` (symptom/cause/prevention)
  - `decisions.md` (if a lasting technical decision was made)

