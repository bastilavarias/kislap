// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://kislap.app",

  output: "static",
  adapter: node({
    mode: "standalone", // Essential for Docker
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap()],

  env: {
    schema: {
      APP_VERSION: envField.string({ context: "client", access: "public" }),
      API_URL: envField.string({ context: "client", access: "public" }),
    },
  },
});
