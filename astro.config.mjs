import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cartellink.github.io',
  base: '/jets-website',
  trailingSlash: 'never',
  build: { format: 'file' }
});
