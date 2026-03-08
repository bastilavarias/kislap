# Decisions Continuity

## Decision Format
Use this for important technical decisions:

```
Date:
Area:
Decision:
Why:
Tradeoff:
Follow-up:
```

## Current Decisions
Date: 2026-03-08  
Area: Public site rendering (`apps/web-sites`, `packages/templates`)  
Decision: Treat theme payload as untrusted and enforce default fallback.  
Why: Prevent runtime crashes from nullable/malformed persisted data.  
Tradeoff: Fallback may hide upstream data quality issues unless monitored.  
Follow-up: Improve project typing for `biz` and `linktree` to reduce `any`.

Date: 2026-03-08  
Area: Biz templates map rendering  
Decision: Keep Leaflet behind strict client-only loading boundaries.  
Why: Prevent SSR import-time crashes (`window` access).  
Tradeoff: Map is unavailable during SSR and appears after hydration.  
Follow-up: Add lightweight fallback skeleton for map areas if needed.

