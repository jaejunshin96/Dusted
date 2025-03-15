import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase this value (in kB) as needed
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
      host: true,
      port: 5173,
  },
})
