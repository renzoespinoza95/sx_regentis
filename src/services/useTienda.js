import { ref, onMounted, computed } from 'vue'

import { useQuery }
from '@tanstack/vue-query'

import { fetchTienda }
from './tiendaService.js'

import {
  USE_VUE_QUERY,
  STALE_TIME
}
from '../config/appConfig.js'

export function useTienda() {

  /* =========================================
     🔥 MODO SIN VUE QUERY
  ========================================= */

  const data =
    ref(null)

  const loading =
    ref(false)

  const tema =
    computed(() => {

      return (

        data.value?.tema

        ||

        {

          tema_id: 0,

          nombre_tema: '',

          topnavbar: '',

          fondo: '',

          boton: '',

          fondo_card: ''

        }

      )

    })

  if (!USE_VUE_QUERY) {

    const load =
      async () => {

        loading.value =
          true

        try {

          data.value =
            await fetchTienda()

        }

        finally {

          loading.value =
            false

        }

      }

    onMounted(load)

    return {

      data,

      tema,

      loading

    }

  }

  /* =========================================
     🔥 MODO CON VUE QUERY
  ========================================= */

  const query =
    useQuery({

      queryKey: [

        'tienda'

      ],

      queryFn:
        fetchTienda,

      staleTime:
        STALE_TIME

    })

  const temaQuery =
    computed(() => {

      return (

        query.data.value?.tema

        ||

        {

          tema_id: 0,

          nombre_tema: '',

          topnavbar: '',

          fondo: '',

          boton: '',

          fondo_card: ''

        }

      )

    })

  return {

    data:
      query.data,

    tema:
      temaQuery,

    loading:
      query.isLoading

  }

}