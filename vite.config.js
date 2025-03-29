import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '8888-2405-201-5c15-894-fdd5-a371-32b3-b158.ngrok-free.app',
      'd557-2405-201-5c15-894-fdd5-a371-32b3-b158.ngrok-free.app'
      // keep any existing allowed hosts
    ]
  }
})
