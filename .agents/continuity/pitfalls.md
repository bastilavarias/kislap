# Pitfalls Continuity

## Known Incident: Null Theme Styles
- Symptom: `Cannot read properties of null (reading 'styles')` in builder.
- Cause: direct access of `settings.theme.styles` when theme object was null/malformed.
- Prevention: normalize theme payload and use default fallback before render.

## Known Incident: Leaflet SSR Crash
- Symptom: `window is not defined` from `leaflet`/`react-leaflet` in SSR.
- Cause: top-level imports of browser-only map library in shared templates.
- Prevention: enforce client-only loading boundary for map components.

## Frequent Risks
- Inconsistent project typing (`any`) can hide invalid data until runtime.
- Debug leftovers (`console.log`, old variable references) can reintroduce failures.

