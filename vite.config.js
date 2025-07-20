import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/devboard-frontend/', // or '/your-repo/' if deployed at subpath
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
})