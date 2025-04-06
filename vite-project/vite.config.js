import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    fs: {
      strict: false,
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate'
    }
  },
});
