<template>

  <div class="min-h-screen" :style="fondoStyle">

    <!-- 🔥 MISMO HEADER DE NEGOCIO -->
    <NegpresHeader />

    <!-- CONTENIDO -->
    <div class="content-container">

      <DetalleImagen />
      <DetalleInfoCard />

    </div>

  </div>

</template>

<script setup>
import { computed } from 'vue'
import DetalleImagen from './components/DetalleImagen.vue'
import DetalleInfoCard from './components/DetalleInfoCard.vue'
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

const { mercado } = useMercado()

const fondoStyle = computed(() => {

  if (!mercado.value?.patron_fondo) return {}

  return cssToObject(mercado.value.patron_fondo)

})

</script>

<style scoped>
.content-container {
  width: 100%;
  max-width: 1400px;
  margin: auto;
}
</style>