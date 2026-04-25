import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {

  // cargar variables .env (por si usas otras)
  const env = loadEnv(mode, process.cwd(), '')

  return {

    /**
     * 🔥 BASE FIJA
     * Usa "./" para que funcione:
     * - en APK (TWA / WebView)
     * - en cualquier subruta
     * - sin depender del entorno
     */
    base: './',

    plugins: [
      vue(),
      tailwindcss()
    ]

  }

})