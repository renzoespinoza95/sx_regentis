<template>
  <div class="flex flex-col h-screen bg-gray-100">

    <TopHeader />

    <MapView ref="mapRef" :lugares="lugares" :initialCenter="initialCenter" />

  </div>
</template>
<script setup>

import {
  ref,
  computed
}
  from 'vue'

import {
  useMercado
}
  from '../../../../services/useMercado.js'

import TopHeader
  from './components/TopHeader.vue'

import MapView
  from './components/MapView.vue'

/* =========================================
🔥 MERCADO
========================================= */

const {
  mercado
} = useMercado()

const mapRef =
  ref(null)

/* =========================================
📍 CENTER
========================================= */

const initialCenter =
  computed(() => {

    const lat =

      Number(
        mercado.value?.map_lat
      )

      ||

      -12.056273847827748

    const lng =

      Number(
        mercado.value?.map_lng
      )

      ||

      -77.03712625305339

    return [

      lat,
      lng

    ]

  })

/* =========================================
📍 LUGARES
========================================= */

const lugares =
  computed(() => {

    return [

      {

        nombre:

          mercado.value?.nombre
          ||

          'Regentis',

        logo:

          mercado.value?.logo
          ||

          'https://barsi-img.b-cdn.net/recursos/logo-regentis.png',

        coords:

          initialCenter.value

      }

    ]

  })

</script>