// Front_Infraestructura/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Lee tu dominio de ngrok de una variable de entorno:
const NGROK_URL = process.env.NGROK_URL || ''

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    // Para que Vite genere HMR sobre wss://<tu-domino> y puerto 443:
    origin: NGROK_URL,
    hmr: NGROK_URL
      ? {
          protocol: 'wss',
          host: NGROK_URL.replace(/^https?:\/\//, ''),
          clientPort: 443,
        }
      : undefined,

    // Proxy de tu API:
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})