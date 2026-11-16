<template>

  <div class="tn-page min-h-screen pt-[66px]" :class="{ 'tienda-theme': temaActivo }" :style="rootStyle">

    <!-- Header fijo -->
    <NegpresHeader />

    <!-- Marquesina -->
    <NegpresMarquee :negocio="negocio" />

    <!-- Hero (ancho completo) -->
    <NegpresHero :banners="data?.sliders || []" :negocio="negocio" />

    <!-- Buscador (busca en todos los productos de la tienda) -->
    <div class="tn-container">
      <NegpresSearch :categorias="data?.categorias || []" />
    </div>

    <!-- Más vendidos -->
    <NegpresMasVendidos :productos="data?.mas_vendidos || []" />

    <!-- Categorías -->
    <NegpresCategoriasGrid :categorias="data?.categorias || []" :tematizado="temaActivo" />

    <!-- Footer -->
    <NegpresFooter :negocio="negocio" />

    <!-- Botón flotante: volver al inicio -->
    <NegpresIrArriba />

    <AppChatFloat :neg-id="negocio?.neg_id || data?.neg_id"
      texto-mensaje="Buenos días. Me gustaría recibir información sobre sus productos, precios y métodos de entrega. Muchas gracias." />

    <AppSnackbar ref="snackbarRef" />

  </div>

</template>

<script setup>

import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import { useUsuario } from '../../../../services/usuarioService.js'
import { useTienda } from '../../../../services/useTienda.js'

import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import AppChatFloat from '../../../../components/layout/AppChatFloat.vue'
import AppSnackbar from '../../../../components/layout/AppSnackbar.vue'

import NegpresMarquee from './components/NegpresMarquee.vue'
import NegpresHero from './components/NegpresHero.vue'
import NegpresSearch from './components/NegpresSearch.vue'
import NegpresMasVendidos from './components/NegpresMasVendidos.vue'
import NegpresCategoriasGrid from './components/NegpresCategoriasGrid.vue'
import NegpresFooter from './components/NegpresFooter.vue'
import NegpresIrArriba from './components/NegpresIrArriba.vue'

/* =========================================
   FORMA FESTONEADA (círculos de producto)
========================================= */

function buildScallop(lobes = 12, amp = 0.032, base = 0.455, steps = 200) {

  const pts = []

  for (let i = 0; i < steps; i++) {

    const t = (i / steps) * Math.PI * 2
    const r = base + amp * Math.cos(lobes * t)

    pts.push(
      `${(50 + r * 100 * Math.cos(t)).toFixed(2)}% ${(50 + r * 100 * Math.sin(t)).toFixed(2)}%`
    )

  }

  return `polygon(${pts.join(',')})`

}

const SCALLOP = buildScallop()

/* =========================================
   ESTADO GLOBAL
========================================= */

const { mercado } = useMercado()
const { setNegIdTienda } = useUsuario()

const route = useRoute()
const router = useRouter()

/* =========================================
   NEG_ID INMEDIATO (antes de useTienda)
========================================= */

setNegIdTienda(route.params?.neg_id)

/* =========================================
   DATA TIENDA
========================================= */

const { data } = useTienda()

const negocio = computed(() => data.value?.negocio || null)

const snackbarRef = ref(null)

/* =========================================
   TEMA (base_css + estilo_css)
========================================= */

const STYLE_BASE_ID = 'tn-theme-base'
const STYLE_ESTILO_ID = 'tn-theme-estilo'

const temaActivo = computed(() => !!data.value?.tema?.base_css)

function setStyle(id, css) {

  let el = document.getElementById(id)

  if (!el) {
    el = document.createElement('style')
    el.id = id
    document.head.appendChild(el)
  }

  if (el.textContent !== css) {
    el.textContent = css
  }

}

/* El base va primero y el estilo después:
   así las variables del estilo siempre ganan. */
watch(
  () => [
    data.value?.tema?.base_css,
    data.value?.tema?.estilo_css
  ],
  ([base, estilo]) => {

    if (!base) {
      return
    }

    setStyle(STYLE_BASE_ID, base)
    setStyle(STYLE_ESTILO_ID, estilo || '')

  },
  { immediate: true }
)

onUnmounted(() => {

  document.getElementById(STYLE_BASE_ID)?.remove()
  document.getElementById(STYLE_ESTILO_ID)?.remove()

})

/* =========================================
   FONDO LEGACY (solo si no hay base_css)
========================================= */

const fondoLegacy = computed(() => {

  if (temaActivo.value) {
    return {}
  }

  const tema_id = Number(data.value?.tema?.tema_id || 0)

  if (tema_id > 0 && data.value?.tema?.fondo) {
    return cssToObject(data.value.tema.fondo)
  }

  if (mercado.value?.patron_fondo) {
    return cssToObject(mercado.value.patron_fondo)
  }

  return {}

})

const rootStyle = computed(() => ({
  ...fondoLegacy.value,
  '--scallop': SCALLOP
}))

/* =========================================
   REDIRECT MOD 404
========================================= */

watch(
  data,
  (v) => {

    if (!v) {
      return
    }

    if (v.redirect === 'mod_404') {
      router.replace('/mod_404')
    }

  },
  { immediate: true }
)

</script>