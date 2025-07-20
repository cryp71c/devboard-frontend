import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  buildEnd() {
    writeFileSync(resolve(__dirname, 'dist/CNAME'), 'cryp71c.dev');
  },
});
