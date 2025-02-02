import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "https://xxaver.github.io/blockchain-beispiel/",
  plugins: [react()],
})
