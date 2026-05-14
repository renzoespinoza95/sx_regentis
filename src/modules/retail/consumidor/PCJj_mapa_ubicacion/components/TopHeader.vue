<template>

  <div class="
      fixed
      top-0
      left-0
      right-0
      z-50
      shadow-xl
    " :style="{
      background:
        mercadoData.topnavbar_color
        || '#FD7635'
    }">

    <div class="
        flex
        items-center
        justify-between
        px-5
        py-4
      ">

      <!-- LEFT -->
      <div class="
          flex
          items-center
          gap-3
        ">

        <img :src="mercadoData.logo
          || 'https://barsi-img.b-cdn.net/recursos/logo-regentis.png'
          " class="
            w-10
            h-10
            rounded-xl
            object-cover
            bg-white
            shadow-md
          " />

        <div class="
            text-white
            font-bold
            text-lg
            truncate
          ">

          {{
            mercadoData.nombre
            || 'Regentis'
          }}

        </div>

      </div>

      <!-- RIGHT -->
      <div class="
          w-10
          h-10
          rounded-full
          bg-white/20
          backdrop-blur
          flex
          items-center
          justify-center
          text-white
          shadow-lg
        ">

        <i class="fa fa-map-marker text-lg"></i>

      </div>

    </div>

  </div>

</template>

<script setup>

import {
  computed
}
  from 'vue'

import {
  useMercado
}
  from '../../../../../services/useMercado.js'

import {
  useTienda
}
  from '../../../../../services/useTienda.js'

const { mercado } =
  useMercado()

const { data } =
  useTienda()

const mercadoData = computed(() => {

  return {

    nombre:

      data.value?.negocio?.nombre
      ||

      'Regentis',

    logo:

      data.value?.negocio?.img_logo
      ||

      'https://barsi-img.b-cdn.net/recursos/logo-regentis.png',

    topnavbar_color:

      mercado.value?.topnavbar_color
      ||

      '#FD7635'

  }

})

</script>