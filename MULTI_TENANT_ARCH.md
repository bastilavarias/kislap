# Project Architecture & Deployment Guide

## Overview

This project implements a **hybrid Cloudflare architecture** that separates frontend and backend concerns for optimal performance, security, and development flexibility.

**Architecture Components:**

- **Frontend**: Next.js application deployed via OpenNext to a single Cloudflare Worker, providing edge rendering with multi-tenant support
- **Backend**: Go API running on a private server, securely exposed through Cloudflare Tunnel
- **Routing**: Cloudflare manages traffic distribution using subdomain-based routing with specific route precedence over wildcards

---

## Traffic Routing Strategy

The routing strategy uses a **wildcard pattern with explicit exceptions** to handle multi-tenancy while maintaining clear API boundaries.

### Route Configuration

| Hostname         | Route Pattern      | Destination        | Handler           |
| ---------------- | ------------------ | ------------------ | ----------------- |
| `kislap.app`     | `kislap.app`       | Frontend (Root)    | Cloudflare Worker |
| `*.kislap.app`   | `*.kislap.app/*`   | Frontend (Tenants) | Cloudflare Worker |
| `api.kislap.app` | `api.kislap.app/*` | Backend API        | Cloudflare Tunnel |

### Critical Configuration: API Route Bypass

To ensure `api.kislap.app` traffic reaches the Go backend instead of the Next.js Worker, you must configure a route exception in Cloudflare.

**Configuration Steps:**

1. Navigate to **Cloudflare Dashboard → Zones → Your Domain → Workers Routes**
2. Add a new route:
   - **Route Pattern**: `api.kislap.app/*`
   - **Worker**: Select **None** (or leave blank to disable)
3. Save the configuration

This prevents the wildcard Worker route from intercepting API requests.

---

## Frontend Deployment

### Multi-Tenant Architecture

The application uses Next.js middleware to implement tenant-based routing without requiring separate deployments or DNS configurations per tenant.

**Request Flow Example:**

```
Incoming Request:  https://sebastech.kislap.app/dashboard
                          ↓
Middleware Rewrite: /sites/sebastech/dashboard
                          ↓
File Resolution:    app/sites/[site]/dashboard/page.tsx
```

**Benefits:**

- Single Worker instance serves all tenants
- One Next.js build for all subdomains
- Unlimited tenant subdomains without additional configuration
- Simplified deployment and maintenance

### Wrangler Configuration

The `wrangler.jsonc` file configures the Worker deployment and routing:

```jsonc
{
  "name": "sparkle",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-09-23",

  "vars": {
    "NEXT_PUBLIC_ROOT_DOMAIN": "kislap.app",
  },

  "routes": [
    {
      "pattern": "kislap.app",
      "custom_domain": true,
    },
    {
      "pattern": "www.kislap.app",
      "custom_domain": true,
    },
    {
      "pattern": "*.kislap.app/*",
      "zone_name": "kislap.app",
    },
  ],
}
```

**Important Notes:**

- `custom_domain: true` does **not** support wildcard patterns
- Wildcard routes require `zone_name` instead
- The `NEXT_PUBLIC_ROOT_DOMAIN` variable must match your production domain

### DNS Configuration

A wildcard DNS record enables automatic resolution of all tenant subdomains.

**Required DNS Record:**

| Type  | Name | Target                           | Proxy Status           |
| ----- | ---- | -------------------------------- | ---------------------- |
| CNAME | `*`  | `sparkle.<username>.workers.dev` | Proxied (Orange Cloud) |

**Requirements:**

- The DNS record **must** be proxied (orange cloud enabled in Cloudflare)
- No per-tenant DNS records are required
- All tenant subdomains are resolved automatically
- The Worker middleware handles tenant extraction dynamically

---

## Backend Deployment

### Cloudflare Tunnel Setup

The Go API backend is exposed securely using Cloudflare Tunnel, keeping your server private and unreachable from the public internet.

**Configuration:**

- **Public Hostname**: `api.kislap.app`
- **Internal Service**: `http://127.0.0.1:5000`

### Host Header Configuration

To prevent "Invalid Host Header" errors from the Go server, configure the tunnel with a custom HTTP host header.

**Option 1: Cloudflare Zero Trust Dashboard**

1. Navigate to **Zero Trust → Access → Tunnels**
2. Select your tunnel and edit the public hostname
3. Under **Additional application settings → HTTP Settings**
4. Set **HTTP Host Header** to `127.0.0.1`

**Option 2: Configuration File (`config.yml`)**

```yaml
tunnel: <your-tunnel-id>
credentials-file: /path/to/credentials.json

ingress:
  - hostname: api.kislap.app
    service: http://127.0.0.1:5000
    originRequest:
      httpHostHeader: "127.0.0.1"
  - service: http_status:404
```

### CORS Configuration

The Go backend must explicitly allow requests from your root domain and all tenant subdomains.

**Example Implementation (`middleware/cors.go`):**

```go
func isAllowedOrigin(origin string) bool {
    // Allow main domain
    if origin == "https://kislap.app" {
        return true
    }

    // Allow all subdomains (e.g., sebastech.kislap.app)
    if strings.HasSuffix(origin, ".kislap.app") {
        return true
    }

    return false
}
```

**Why This Matters:**

- Prevents unauthorized cross-origin requests
- Enables credential sharing (cookies, authentication headers)
- Avoids insecure wildcard (`*`) CORS policies that expose your API to all origins

---

## Local Development

### Environment Configuration

Set the root domain to your local development address:

```bash
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
```

### Development Workflow

1. **Start the Go backend:**

   ```bash
   go run main.go
   ```

2. **Start the Next.js development server:**

   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Root: `http://localhost:3000`
   - Tenants: `http://sebastech.localhost:3000` (requires local DNS configuration or `/etc/hosts` entries)

---

## Troubleshooting

### Common Issues and Solutions

| Error                                  | Cause                                                                                                          | Solution                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`   | Using multi-level subdomains (e.g., `service.api.kislap.app`) not covered by Cloudflare's free SSL certificate | Rename to single-level subdomain (e.g., `api-service.kislap.app`) or upgrade to Advanced Certificate Manager |
| `Cannot find module lightningcss.node` | Missing platform-specific build dependencies for Next.js/Tailwind                                              | Run clean reinstall: `npm cache clean --force && npm install`                                                |
| Deployed version not updating          | Cached build artifacts in Next.js or Cloudflare CDN                                                            | Delete `.next` and `.open-next` directories, clear Cloudflare cache, then redeploy                           |
| API requests blocked by CORS           | Origin not allowed in backend CORS configuration                                                               | Verify CORS middleware includes root domain and subdomain pattern                                            |
| Worker not catching tenant requests    | DNS wildcard record not proxied                                                                                | Enable proxy (orange cloud) on wildcard CNAME record                                                         |
| `Invalid Host Header` from Go backend  | Cloudflare Tunnel sending wrong host header                                                                    | Configure `httpHostHeader: "127.0.0.1"` in tunnel settings                                                   |

### Debugging Steps

1. **Check Cloudflare routing:**
   - Verify Worker routes in Cloudflare Dashboard
   - Confirm API bypass route exists
   - Check DNS records are proxied

2. **Verify CORS configuration:**
   - Inspect browser DevTools Network tab for CORS errors
   - Test API endpoint with `curl -H "Origin: https://tenant.kislap.app"`

3. **Test Cloudflare Tunnel:**
   - Check tunnel status: `cloudflared tunnel info`
   - View tunnel logs for connection issues

---

## Architecture Benefits

This hybrid architecture provides:

- ✅ **Edge-rendered multi-tenant frontend** for optimal performance and SEO
- ✅ **Secure private backend** via Cloudflare Tunnel (no exposed ports)
- ✅ **Clean API separation** with independent scaling and deployment
- ✅ **Zero per-tenant DNS configuration** (automatic subdomain routing)
- ✅ **Development-production parity** with minimal configuration differences
- ✅ **Scalable architecture** from prototype to enterprise without major refactoring

---

## Deployment Checklist

### Initial Setup

- [ ] Configure Cloudflare Zone for your domain
- [ ] Create Cloudflare Worker for Next.js frontend
- [ ] Set up Cloudflare Tunnel for Go backend
- [ ] Configure DNS wildcard record (proxied)
- [ ] Add API bypass route in Workers Routes

### Frontend Deployment

- [ ] Build Next.js application with OpenNext
- [ ] Configure `wrangler.jsonc` with correct domains
- [ ] Deploy Worker: `npx wrangler deploy`
- [ ] Verify root and tenant subdomain access

### Backend Deployment

- [ ] Start Cloudflare Tunnel
- [ ] Configure `httpHostHeader` setting
- [ ] Update CORS middleware with production domains
- [ ] Test API endpoint from frontend

### Testing

- [ ] Test root domain access
- [ ] Test tenant subdomain routing
- [ ] Verify API requests from both root and tenant domains
- [ ] Check CORS headers in browser DevTools
- [ ] Test SSL/TLS certificates

---

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [OpenNext Documentation](https://opennext.js.org/)
- [Next.js Multi-Tenancy Guide](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Cloudflare Worker logs in the dashboard
3. Check Cloudflare Tunnel logs: `cloudflared tunnel logs`
4. Verify DNS propagation: `dig +short tenant.kislap.app`
