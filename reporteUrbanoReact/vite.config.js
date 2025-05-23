import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // <- isso permite acesso via IP local
    port: 5173
  },
  plugins: [react()],
})

