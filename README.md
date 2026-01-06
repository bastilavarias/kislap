# Kislap

Kislap is forms to site web platform consists of a website builder, public-facing sites, a Go-based API service, and a Laravel-based admin panel.

## Project Structure

The project is organized as a monorepo with the following main applications:

### Apps

- **[web-builder](apps/web-builder)**: A Next.js 15 application for building websites. Features a drag-and-drop interface powered by `dnd-kit`, state management with `zustand`, and UI components using `radix-ui` and `tailwindcss`.
- **[web-sites](apps/web-sites)**: A Next.js 15 application specialized for rendering public sites, configured for Cloudflare OpenNext.
- **[api-service](apps/api-service)**: A Go (v1.25) backend service using the Gin framework and GORM for database operations. Handles AI integrations (OpenAI, Google GenAI) and PDF generation.
- **[web-admin](apps/web-admin)**: A Laravel 12 application serving as the administrative backend.

### Packages

- **packages/**: Shared packages and utilities (e.g., templates).

## Infrastructure

The backend services are containerized using Docker Compose:

- **kislap_web_server**: Nginx gateway.
- **kislap_flash**: The Go API service (Port 5000).
- **kislap_admin**: The Laravel Admin application (Port 8000).
- **kislap_database**: MySQL 8 database (Port 3307).
- **kislap_adminer**: Adminer database management interface (Port 8080).

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) (Project uses NPM workspaces)
- [Go](https://go.dev/) (Optional, if running API locally)
- [PHP](https://www.php.net/) (Optional, if running Admin locally)

## Getting Started

### 1. Setup Environment Variables

Copy the example environment files in each application directory if they exist (e.g., `.env.example` to `.env`).

### 2. Start Backend Services

Run the Docker Compose stack to start the database, API, and Admin services.

```bash
docker-compose up -d
```

Service URLs:
- **API Service**: http://localhost:5000
- **Admin Panel**: http://localhost:8000
- **Adminer (DB GUI)**: http://localhost:8080 (Server: `kislap_database`, User: `root`, Pass: `password`, DB: `kislap`)

### 3. Install Dependencies

Install Node.js dependencies for the frontend applications from the root directory:

```bash
npm install
```

### 4. Run Frontend Applications

You can run the frontend applications locally using `npm run dev`.

**Web Builder:**
```bash
cd apps/web-builder
npm run dev
```

**Web Sites:**
```bash
cd apps/web-sites
npm run dev
```

## Development

- **Database**: The MySQL data is persisted in the `database_data` volume.
- **Hot Reloading**: 
    - The Go service uses `air` for live reloading within the container.
    - The Laravel service is configured for development.
    - Next.js apps use standard HMR.
