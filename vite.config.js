import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {

  // Carga correctamente tus variables de entorno (.env)
  const env = loadEnv(mode, process.cwd(), '')

  return {

    /**
     * 🔥 BASE WEB ABSOLUTA
     * Forzamos '/' para que el despliegue web tradicional cargue siempre
     * los assets desde la raíz, sin importar qué tan profunda sea la ruta de Vue Router.
     */
    base: '/',

    plugins: [
      vue(),
      tailwindcss()
    ]

  }

})