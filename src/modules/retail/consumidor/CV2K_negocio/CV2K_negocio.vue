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
      <AppSnackbar ref="snackbarRef" />
    </div>

  </div>

</template>

<script setup>

import {
  computed,
  onMounted,
  ref,
  watch
}
  from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import { useUsuario } from '../../../../services/usuarioService.js'
import { usePrincipal } from '../../../../services/usePrincipal.js'
import {
  useRoute,
  useRouter
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
import AppSnackbar
  from '../../../../components/layout/AppSnackbar.vue'

/* =========================
   🔥 PRINCIPAL (CLAVE)
========================= */

//const principal = usePrincipal()

/* =========================
   🔥 ESTADO GLOBAL
========================= */

const { mercado } = useMercado()
const {

  isLogged,

  setNegIdTienda

} = useUsuario()
const route = useRoute()
const router = useRouter()

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

const snackbarRef =
  ref(null)

/* =========================
   🔥 FONDO DINÁMICO
========================= */
const fondoStyle = computed(() => {

  const tema_id = Number(
    data.value?.tema?.tema_id || 0
  )

  console.log(
    'tema_id',
    tema_id
  )

  console.log(
    'tema.fondo',
    data.value?.tema?.fondo
  )

  if (

    tema_id > 0

    &&

    data.value?.tema?.fondo

  ) {

    console.log(
      'USANDO TEMA'
    )

    return cssToObject(

      data.value.tema.fondo

    )

  }

  console.log(
    'USANDO MERCADO'
  )

  if (

    mercado.value?.patron_fondo

  ) {

    return cssToObject(

      mercado.value.patron_fondo

    )

  }

  return {}

})


watch(

  data,

  (v) => {

    if (!v) {
      return
    }

    /* =========================
       MOD 404
    ========================= */

    if (

      v.redirect === 'mod_404'

    ) {

      router.replace(
        '/mod_404'
      )

      return

    }

    /* =========================
       NEGOCIO INACTIVO
    ========================= */

    const isActivo =

      Number(

        v?.negocio?.is_activo

        ??

        v?.is_activo

        ??

        0

      )

    if (

      isActivo !== 1

    ) {

      snackbarRef.value?.open(

        '⚠️ Los productos no están disponibles'

      )

    }

  },

  {

    immediate: true

  }

)

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