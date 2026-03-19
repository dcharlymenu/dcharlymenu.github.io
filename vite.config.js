import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/charly-menu/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
  },
});
