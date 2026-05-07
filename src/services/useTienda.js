import { ref, onMounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchTienda } from './tiendaService.js'
import { USE_VUE_QUERY, STALE_TIME } from '../config/appConfig.js'

export function useTienda() {

  // 🔥 modo SIN Vue Query
  const data = ref(null)
  const loading = ref(false)

  if (!USE_VUE_QUERY) {

    const load = async () => {
      loading.value = true
      data.value = await fetchTienda()
      loading.value = false
    }

    onMounted(load)

    return {
      data,
      loading
    }
  }

  // 🔥 modo CON Vue Query
  const query = useQuery({
    queryKey: ['tienda'],
    queryFn: fetchTienda,
    staleTime: STALE_TIME
  })

  return {
    data: query.data,
    loading: query.isLoading
  }
} 
