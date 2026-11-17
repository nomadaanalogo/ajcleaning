// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // PENDIENTE: confirmar el dominio real. También se usa en public/robots.txt.
  site: 'https://www.ajcleaninghome.com',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
