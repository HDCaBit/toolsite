import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor'
          }
          if (id.includes('@fortawesome')) {
            return 'fontawesome'
          }
          if (id.includes('node_modules/qrcode') || id.includes('node_modules/marked') || id.includes('node_modules/react-helmet-async')) {
            return 'utils'
          }
        },
      },
    },
  },
})
