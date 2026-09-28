# Pitfalls Continuity

## Known Incident: Null Theme Styles
- Symptom: `Cannot read properties of null (reading 'styles')` in builder.
- Cause: direct access of `settings.theme.styles` when theme object was null/malformed.
- Prevention: normalize theme payload and use default fallback before render.

## Known Incident: Leaflet SSR Crash
- Symptom: `window is not defined` from `leaflet`/`react-leaflet` in SSR.
- Cause: top-level imports of browser-only map library in shared templates.
- Prevention: enforce client-only loading boundary for map components.

## Known Incident: Page Preview vs Public Spacing Drift (2026-09-26 to 2026-09-28)

### Symptoms
- Builder Preview looked correct while the published Page was visibly denser/tighter.
- Changing Theme -> Spacing could appear correct in Preview but not on the public site.
- Promo/Showcase cards looked much tighter than Link cards even when they were in the same Page grid.
- Build success, HTTP 200, and a successful Wrangler deployment did **not** prove visual parity.

### What made this hard
Several independent issues overlapped and looked like one spacing bug:
1. Preview and live initially had duplicated wrappers/rendering environments.
2. Theme `spacing` was once mapped to Tailwind v4's global `--spacing`, which changed the entire Tailwind spacing scale.
3. Preview could contain newer local theme state while the API still had an older persisted value.
4. Theme Save could serialize a stale React closure after slider changes.
5. Default Link blocks had external `PageBlockFrame` padding while Promo/Showcase blocks did not, so Links appeared to have better spacing only by accident.
6. Preview width/container-query differences could change wrapping and card height, which looked like a spacing problem.

### Final architecture / invariants
- Preview and public Page must render the exact same shared `LinktreeSiteRenderer` from `packages/templates`.
- Do not create a second Page renderer, iframe copy, or public-preview-specific CSS implementation.
- Theme spacing is scoped as `--theme-spacing`; never write Page spacing into Tailwind's global `--spacing`.
- Shared renderer normalizes saved rem spacing to deterministic px before exposing `--theme-spacing`.
- Inter-block/card spacing has one source of truth: the shared content grid.
- Default block wrappers must not add external spacing around cards.
- `PageBlockFrame` padding is only for decorated Card/Highlight wrapper variants.
- Current canonical grid spacing is inline in `LinktreeDefault`: `gap: calc(var(--theme-spacing) * 11)`. This intentionally preserves the spacing users previously liked on Link cards without relying on hidden wrapper padding.
- Main grid gap is inline/shared-renderer CSS so public Tailwind source scanning cannot silently drop the critical spacing rule.
- Support blocks default to full width under Creator/Bento/Portfolio when no explicit width metadata exists.

### Save/persistence protections
- Theme state setter updates a synchronous ref as well as React state.
- Save serializes from the latest ref so rapid slider changes cannot be lost to a stale render closure.
- Save uses read-after-write verification:
  1. send the exact draft;
  2. refetch from API;
  3. compare persisted theme/composition/background to the draft;
  4. only show `Saved and verified` on exact match;
  5. reset Preview/form/theme from verified server state.
- Header shows `UNSAVED` when form/theme differs from the last verified server state.

### Validation rule
For Preview/Public visual changes, **do not stop at build success, deployment success, or HTTP 200**. Validate the actual live rendering inputs:
- API value for the saved theme/layout.
- Live HTML CSS variables, especially `--theme-spacing`.
- Live HTML/shared grid style, especially the canonical `x11` gap.
- Live Worker deployment version.
- A representative published Page, preferably side-by-side with Preview at comparable width/breakpoint.
- If screenshots disagree, measure where the drift begins before changing CSS.

### Final verified state of the incident
- Example Page: `bastilavarias.kislap.app`.
- Verified theme spacing during resolution: `0.21rem` -> `--theme-spacing: 3.36px`.
- Verified live grid: `gap: calc(var(--theme-spacing) * 11)`.
- Final spacing-model deployment from this incident: Worker `2e808c7f-8461-43c9-99d1-162c76b61f07`.
- Status: resolved; future Page spacing work must preserve the invariants above.

## Frequent Risks
- Inconsistent project typing (`any`) can hide invalid data until runtime.
- Debug leftovers (`console.log`, old variable references) can reintroduce failures.

