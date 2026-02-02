// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';


// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  image: {
    service: passthroughImageService()
  },

  site: 'https://www.margaritas.me',

  output: 'server',
  integrations: [react(), sitemap()],
  adapter: vercel(),
});