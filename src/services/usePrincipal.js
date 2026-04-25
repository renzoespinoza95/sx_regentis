import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import { useMercado } from './useMercado'

const API = import.meta.env.VITE_PUBLIC_URL_BASE

const USE_VQ = import.meta.env.VITE_PUBLIC_VUE_QUERY == '1'
const STALE = parseInt(import.meta.env.VITE_PUBLIC_VQ_STALETIME || '0')

const STORAGE_KEY = 'regentis_principal_cache'

// 🔥 mercado por env
const MERCADO_ID = parseInt(import.meta.env.VITE_PUBLIC_MERCADO_ID || '0')

export function usePrincipal(){

  // 🔥 sincronización global
  const { setMercado } = useMercado()

  const fetchPrincipal = async () => {

    const cache = getCache()

    // 🔥 1. SI HAY CACHE → usarlo y revalidar en background
    if (cache) {

      // 🔥 sincronizar estado global desde cache
      setMercado(cache)

      // 🔥 revalidar en segundo plano
      setTimeout(async () => {
        try {
          const r = await axios.post(`${API}/app/principal`, {
            mercado_id: MERCADO_ID
          })

          setCache(r.data.data)

        } catch (e) {
          console.error('Error revalidando principal', e)
        }
      }, 0)

      return cache
    }

    // 🔥 2. SI NO HAY CACHE → llamar API
    const r = await axios.post(`${API}/app/principal`, {
      mercado_id: MERCADO_ID
    })

    setCache(r.data.data)

    return r.data.data
  }

  // 🔥 Vue Query
  if (USE_VQ && STALE > 0){

    return useQuery({
      queryKey: ['principal', MERCADO_ID],
      queryFn: fetchPrincipal,
      staleTime: STALE * 60 * 1000
    })

  }

  // 💥 Axios directo
  return {
    data: null,
    isLoading: false,
    async refetch(){
      return await fetchPrincipal()
    }
  }

  /* =========================
     CACHE HELPERS
  ========================= */

  function getCache(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch(e){
      console.error('Error leyendo cache principal', e)
      return null
    }
  }

  function setCache(data){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

      // 🔥 sincronizar estado global
      setMercado(data)

    } catch(e){
      console.error('Error guardando cache principal', e)
    }
  }
}