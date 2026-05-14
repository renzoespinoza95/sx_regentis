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
  useTienda
}
  from '../../../../services/useTienda.js'

import TopHeader
  from './components/TopHeader.vue'

import MapView
  from './components/MapView.vue'

const { data } =
  useTienda()

const mapRef = ref(null)

/* =========================================
   📍 CENTER
========================================= */

const initialCenter = computed(() => {

  const lat =
    Number(
      data.value?.negocio?.map_lat
    ) || -12.056273847827748

  const lng =
    Number(
      data.value?.negocio?.map_lng
    ) || -77.03712625305339

  return [lat, lng]

})

/* =========================================
   📍 LUGARES
========================================= */
const lugares = computed(() => {

  const negocio =
    data.value?.negocio || {}

  return [

    {

      nombre:

        negocio.nombre
        ||

        'Regentis',

      logo:

        negocio.img_logo
        ||

        negocio.logo
        ||

        'https://barsi-img.b-cdn.net/recursos/logo-regentis.png',

      coords:

        initialCenter.value

    }

  ]

})


</script>