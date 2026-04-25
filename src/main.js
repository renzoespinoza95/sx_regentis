import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'
import 'leaflet/dist/leaflet.css'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_PUBLIC_URL_BASE

const app = createApp(App)

// 🔥 Vue Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1
    }
  }
})

app.use(VueQueryPlugin, {
  queryClient
})

// 🔥 FALTABA ESTO
app.use(router)

app.mount('#app')