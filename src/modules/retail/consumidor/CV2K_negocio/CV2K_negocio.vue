<template>

  <div class="min-h-screen" :style="fondoStyle">

    <!-- HEADER -->
    <!-- HEADER -->
    <RegHeader v-if="!isLogged" />
    <NegpresHeader v-else />

    <!-- CONTENIDO -->
    <div class="content-container">

      <NegpresSearch />
      <NegpresHero />
      <NegpresMasVendidos />
      <NegpresCategoriasGrid />
      <AppChatFloat />

    </div>

  </div>

</template>

<script setup>

import { computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import { useUsuario } from '../../../../services/usuarioService.js'
import RegHeader from '../../../../modules/reg_principal/components/RegHeader.vue'

import NegpresMasVendidos from './components/NegpresMasVendidos.vue'
import NegpresCategoriasGrid from './components/NegpresCategoriasGrid.vue'
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import NegpresSearch from './components/NegpresSearch.vue'
import NegpresHero from './components/NegpresHero.vue'
import AppChatFloat from '../../consumidor/CV2K_negocio/components/AppChatFloat.vue'


// 🔥 traer mercado (reactivo)
const { mercado } = useMercado()
const { isLogged } = useUsuario()

// 🔥 fondo dinámico desde BD
const fondoStyle = computed(() => {

  if (!mercado.value?.patron_fondo) {
    return {}
  }

  // 👇 usa TU función existente
  return cssToObject(mercado.value.patron_fondo)

})

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.content-container {
  width: 100%;
  max-width: 1400px;
  margin: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 40px;
}
</style>