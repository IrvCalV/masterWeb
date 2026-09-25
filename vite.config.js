import { defineConfig } from 'vite';

// base: './' keeps every asset path relative. Each built template lives
// as a static copy under public/templates/<slug>/ (Vite serves/copies
// public/ as-is), so cards just link to that path with target="_blank".
export default defineConfig({
  base: './',
});
