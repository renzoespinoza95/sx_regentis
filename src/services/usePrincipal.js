import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import { useMercado } from './useMercado'
import {
  firma
} from './security'

const API = import.meta.env.VITE_PUBLIC_URL_BASE

const USE_VQ = import.meta.env.VITE_PUBLIC_VUE_QUERY == '1'
const STALE = parseInt(import.meta.env.VITE_PUBLIC_VQ_STALETIME || '0')

const STORAGE_KEY = 'regentis_principal_cache'

// 🔥 mercado por env
const MERCADO_ID = parseInt(import.meta.env.VITE_PUBLIC_MERCADO_ID || '0')

// 🔥 negocio por env (NUEVO)
const NEG_ID = parseInt(import.meta.env.VITE_PUBLIC_NEG_ID || '0')

export function usePrincipal(){

  // 🔥 sincronización global
  const { setMercado } = useMercado()

  const fetchPrincipal = async () => {

    const cache = getCache()

    /* =========================
      🔥 FIRMA
    ========================== */

    const seguridad =
      firma()

    console.log(
      'FIRMA PRINCIPAL >>>',
      seguridad
    )

    /* =========================
       🔥 1. CACHE
    ========================== */
    if (cache) {

      // 🔥 sincronizar estado global desde cache
      setMercado(cache)

      // 🔥 revalidar en segundo plano
      setTimeout(async () => {
        try {

          const r = await axios.post(
              `${API}/app/principal`,

              {

                mercado_id:
                  MERCADO_ID,

                neg_id:
                  NEG_ID,

                xin:
                  seguridad.xin,

                yuan:
                  seguridad.yuan

              }

            )

          setCache(r.data.data)

        } catch (e) {
          console.error('Error revalidando principal', e)
        }
      }, 0)

      return cache
    }

    /* =========================
       🔥 2. FETCH
    ========================== */

    const r = await axios.post(
      `${API}/app/principal`,

      {

        mercado_id:
          MERCADO_ID,

        neg_id:
          NEG_ID,

        xin:
          seguridad.xin,

        yuan:
          seguridad.yuan

      }

    )

    setCache(r.data.data)

    return r.data.data
  }

  /* =========================
     🔥 VUE QUERY
  ========================== */

  if (USE_VQ && STALE > 0){

    return useQuery({
      queryKey: ['principal', MERCADO_ID, NEG_ID],
      queryFn: fetchPrincipal,
      staleTime: STALE * 60 * 1000
    })

  }

  /* =========================
     💥 AXIOS DIRECTO
  ========================== */

  return {
    data: null,
    isLoading: false,
    async refetch(){
      return await fetchPrincipal()
    }
  }

  /* =========================
     🔥 CACHE HELPERS
  ========================== */

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

      // 🔥 sincronizar estado global SIEMPRE
      setMercado(data)

    } catch(e){
      console.error('Error guardando cache principal', e)
    }
  }
}