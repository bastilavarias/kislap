# Architecture Continuity

## Monorepo Structure
- Frontend builder: `apps/web-builder`
- Frontend public renderer: `apps/web-sites`
- Backend API: `apps/api-service`
- Admin backend: `apps/web-admin`
- Shared templates: `packages/templates`

## Public Rendering Path
- Page route: `apps/web-sites/app/sites/[site]/page.tsx`
- Builder wrapper: `apps/web-sites/app/components/builder.tsx`
- Template resolver: `apps/web-sites/hooks/use-template-renderer.tsx`
- Rendered templates: `packages/templates/src/components/*`

## Data Shape Reality
- Project types in use: `portfolio`, `biz`, `linktree`, `waitlist`
- Theme payloads may be object, JSON string, null, or malformed.
- Template components consume a stable `themeStyles` object.

