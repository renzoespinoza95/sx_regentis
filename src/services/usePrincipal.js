import axios from 'axios'

import {
  ref
}
from 'vue'

import {
  useQuery
}
from '@tanstack/vue-query'

import {
  useMercado
}
from './useMercado'

import {
  useUsuario
}
from './usuarioService'

import {
  firma
}
from './security'

const API =
  import.meta.env.VITE_PUBLIC_URL_BASE

const USE_VQ =
  import.meta.env.VITE_PUBLIC_VUE_QUERY == '1'

const STALE =
  parseInt(

    import.meta.env.VITE_PUBLIC_VQ_STALETIME
    ||
    '0'

  )

const STORAGE_KEY =
  'regentis_principal_cache'

/* =========================================
   🔥 STORAGE MERCADO
========================================= */

const STORAGE_MERCADO_ID =
  'regentis_mercado_id'



/* =========================================
   🔥 GET MERCADO ID
========================================= */

function getMercadoId(){

  return parseInt(

    localStorage.getItem(
      STORAGE_MERCADO_ID
    )

    ||

    '0'

  )

}

/* =========================================
   🔥 SET MERCADO ID
========================================= */

export function setMercadoId(
  mercado_id
){

  localStorage.setItem(

    STORAGE_MERCADO_ID,

    String(
      mercado_id
      ||
      0
    )

  )

}

/* =========================================
   🔥 USE PRINCIPAL
========================================= */

export function usePrincipal(){

  /* =========================================
     🔥 GLOBAL
  ========================================= */

  const {
    setMercado
  } = useMercado()

  /* =========================================
   🔥 USUARIO
========================================= */

const {
  getNegId
} = useUsuario()

  /* =========================================
     🔥 FETCH
  ========================================= */

  const fetchPrincipal =
    async () => {

      const cache =
        getCache()

      /* =========================================
         🔥 MERCADO ID
      ========================================= */

      const mercado_id =
        getMercadoId()

      /* =========================================
         🔥 FIRMA
      ========================================= */

      const seguridad =
        firma()

      console.log(
        'FIRMA PRINCIPAL >>>',
        seguridad
      )

      console.log(
        'MERCADO_ID >>>',
        mercado_id
      )

      /* =========================================
         🔥 CACHE
      ========================================= */

      if (cache) {

        /* =========================================
           🔥 SYNC GLOBAL
        ========================================= */

        setMercado(cache)

        /* =========================================
           🔥 REVALIDAR
        ========================================= */

        setTimeout(async () => {

          try {

            const r =
              await axios.post(

                `${API}/app/principal`,

                {

                  mercado_id:
                    mercado_id,

                  neg_id:

  getNegId()

  ||

  0,

                  xin:
                    seguridad.xin,

                  yuan:
                    seguridad.yuan

                }

              )

            setCache(
              r.data.data
            )

          } catch (e) {

            console.error(
              'Error revalidando principal',
              e
            )

          }

        }, 0)

        return cache

      }

      /* =========================================
         🔥 FETCH REAL
      ========================================= */

      const r =
        await axios.post(

          `${API}/app/principal`,

          {

            mercado_id:
              mercado_id,

            neg_id:

  getNegId()

  ||

  0,

            xin:
              seguridad.xin,

            yuan:
              seguridad.yuan

          }

        )

      setCache(
        r.data.data
      )

      return r.data.data

    }

  /* =========================================
     🔥 VUE QUERY
  ========================================= */

  if (

    USE_VQ
    &&
    STALE > 0

  ){

    return useQuery({

      queryKey: [

        'principal',

        getMercadoId(),

        getNegId()
||
0

      ],

      queryFn:
        fetchPrincipal,

      staleTime:
        STALE
        *
        60
        *
        1000

    })

  }

  /* =========================================
     💥 AXIOS DIRECTO
  ========================================= */

  const data =
    ref(null)

  const isLoading =
    ref(false)

  async function refetch(){

    try {

      isLoading.value = true

      const res =
        await fetchPrincipal()

      data.value =
        res

      return res

    } finally {

      isLoading.value = false

    }

  }

  /* =========================================
     🔥 AUTOLOAD
  ========================================= */

  refetch()

  return {

    data,

    isLoading,

    refetch

  }

  /* =========================================
     🔥 CACHE HELPERS
  ========================================= */

  function getCache(){

    try {

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        )

      return raw
        ? JSON.parse(raw)
        : null

    } catch(e){

      console.error(
        'Error leyendo cache principal',
        e
      )

      return null

    }

  }

  function setCache(data){

    try {

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

      )

      /* =========================================
         🔥 GLOBAL
      ========================================= */

      setMercado(data)

    } catch(e){

      console.error(
        'Error guardando cache principal',
        e
      )

    }

  }

}