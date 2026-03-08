# Invariants Continuity

## SSR Safety
- Browser-only libraries must not run during SSR.
- If a dependency touches `window`/`document` at import time, load it via client-only boundaries.

## Theme Safety
- Never assume `theme_object` exists or has valid shape.
- Always normalize and fallback to a complete default theme object.
- Do not pass unnormalized theme payload directly into template renderers.

## Change Scope
- Keep fixes narrow and local to the failing path.
- Prefer preserving existing visual and behavioral intent unless asked to redesign.

