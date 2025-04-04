import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    // Allow CORS from backend API server
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? process.env.VITE_API_URL 
          : 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
    allowedHosts: [
      '8888-2405-201-5c15-894-fdd5-a371-32b3-b158.ngrok-free.app',
      'd557-2405-201-5c15-894-fdd5-a371-32b3-b158.ngrok-free.app',
      '.onrender.com'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
  }
})
