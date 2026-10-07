import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js is big; the 3D hero is lazy-loaded into its own chunk
    chunkSizeWarningLimit: 1500,
  },
})
