import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cartellink.github.io',
  base: '/',
  trailingSlash: 'never',
  build: { format: 'file' }
});
