<template>

  <div class="min-h-screen pt-20" :style="fondoStyle">

    <!-- NAVBAR -->
    <RegHeader />

    <!-- CONTENIDO -->
    <div class="content-container">

      <RegSearch />

      <RegHero />

      <RegCategorias />

      <RegMiniApps />

      <PromoApkModal ref="promoRef" />

    </div>

  </div>

</template>

<script setup>

import {
  ref,
  onMounted,
  computed,
  watch
}
  from 'vue'

import RegHeader
  from './components/RegHeader.vue'

import RegSearch
  from './components/RegSearch.vue'

import PromoApkModal
  from './components/PromoApkModal.vue'

import RegCategorias
  from './components/RegCategorias.vue'

import RegMiniApps
  from './components/RegMiniApps.vue'

import RegHero
  from './components/RegHero.vue'

import {
  useUsuario
}
  from '../../services/usuarioService.js'

import {
  useMercado
}
  from '../../services/useMercado.js'

import {
  cssToObject
}
  from '../../services/useCss.js'


const {
  mercado
} = useMercado()

const {

  setNegIdTienda,
  isLogged

} = useUsuario()

const promoRef =
  ref(null)

const fondoStyle =
  computed(() => {

    if (
      !mercado.value?.patron_fondo
    ) {

      return {}

    }

    return cssToObject(
      mercado.value.patron_fondo
    )

  })

/* =========================================
   🔥 MODAL LOGIN GUEST
========================================= */
const MERCADO_ID =
  Number(
    import.meta.env
      .VITE_PUBLIC_MERCADO_ID
    || 0
  )

onMounted(() => {

  setNegIdTienda(null)

  console.log(
    '🏪 mercado_id =>',
    MERCADO_ID
  )

})

</script>

<style scoped>
/* ============================= */
/* CONTENEDOR PRINCIPAL          */
/* ============================= */

.content-container {

  width: 100%;
  max-width: 1400px;
  margin: auto;

  /* 👇 ESPACIO PARA EL NAVBAR */
  padding-top: 50px;

  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 40px;

}
</style>