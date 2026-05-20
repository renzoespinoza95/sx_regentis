<template>

  <div class="min-h-screen pt-20" :style="fondoStyle">

    <!-- HEADER -->
    <RegHeader v-if="!isLogged" />
    <NegpresHeader v-else :show-logo-left="true" />

    <!-- CONTENIDO -->
    <div class="content-container">

      <NegpresSearch />
      <NegpresHero :banners="data?.sliders || []" />
      <NegpresMasVendidos :productos="data?.mas_vendidos || []" />
      <NegpresCategoriasGrid :categorias="data?.categorias || []" />
      <AppChatFloat :neg-id="data?.negocio?.neg_id || data?.neg_id"
        texto-mensaje="Buenos días. Me gustaría recibir información sobre sus productos, precios y métodos de entrega. Muchas gracias." />

    </div>

  </div>

</template>

<script setup>

import { computed, onMounted } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import { useUsuario } from '../../../../services/usuarioService.js'
import { usePrincipal } from '../../../../services/usePrincipal.js'
import {
  useRoute
}
  from 'vue-router'
import RegHeader from '../../../../modules/reg_principal/components/RegHeader.vue'

import NegpresMasVendidos from './components/NegpresMasVendidos.vue'
import NegpresCategoriasGrid from './components/NegpresCategoriasGrid.vue'
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import NegpresSearch from './components/NegpresSearch.vue'
import NegpresHero from './components/NegpresHero.vue'
import AppChatFloat from '../../../../components/layout/AppChatFloat.vue'
import { useTienda } from '../../../../services/useTienda.js'

/* =========================
   🔥 PRINCIPAL (CLAVE)
========================= */

const principal = usePrincipal()

/* =========================
   🔥 ESTADO GLOBAL
========================= */

const { mercado } = useMercado()
const {

  isLogged,

  setNegIdTienda

} = useUsuario()
const route = useRoute()

/* =========================
   🔥 DATA TIENDA
========================= */

const { data, loading } = useTienda()

/* =========================================
   🏪 NEG_ID INMEDIATO
========================================= */

const neg_id_route =
  route.params?.neg_id

console.log(
  '🏪 neg_id route =>',
  neg_id_route
)

/* =========================================
   💾 GUARDAR ANTES DE useTienda
========================================= */

setNegIdTienda(
  neg_id_route
)

/* =========================
   🔥 FONDO DINÁMICO
========================= */

const fondoStyle = computed(() => {

  if (!mercado.value?.patron_fondo) {
    return {}
  }

  return cssToObject(mercado.value.patron_fondo)

})

onMounted(() => {

  principal.refetch?.()

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