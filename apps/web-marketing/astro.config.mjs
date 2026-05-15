// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

const disabledMarketingRoutes = new Set([
  "/features/",
  "/features/digital-menu-builder/",
  "/features/link-page-builder/",
  "/features/portfolio-builder/",
  "/linktree-builder/",
  "/menu-builder/",
  "/portfolio-builder/",
]);

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://kislap.app",

  output: "static",
  adapter: node({
    mode: "standalone", // Essential for Docker
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap({
      filter(page) {
        const pathname = new URL(page).pathname;
        return !disabledMarketingRoutes.has(pathname);
      },
    }),
  ],

  env: {
    schema: {
      APP_VERSION: envField.string({ context: "client", access: "public" }),
      API_URL: envField.string({ context: "client", access: "public" }),
      BUILDER_URL: envField.string({ context: "client", access: "public" }),
      SITE_URL: envField.string({ context: "client", access: "public" }),
    },
  },
});
