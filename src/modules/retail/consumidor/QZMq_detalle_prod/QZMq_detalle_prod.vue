<template>

  <div class="min-h-screen" :style="fondoStyle">

    <!-- 🔥 MISMO HEADER DE NEGOCIO -->
    <NegpresHeader />

    <!-- CONTENIDO -->
    <div class="content-container">

      <div v-if="!producto" class="text-center mt-10 text-gray-500">
        Cargando producto...
      </div>

      <div v-else>
        <DetalleImagen :producto="producto" />
        <DetalleInfoCard :producto="producto" @toast="showToast" />
      </div>

    </div>

  </div>
  <GsapToast ref="toastRef" />

</template>

<script setup>
import { computed, ref } from 'vue'
import DetalleImagen from './components/DetalleImagen.vue'
import DetalleInfoCard from './components/DetalleInfoCard.vue'
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import { useRoute } from 'vue-router'
import { useTienda } from '../../../../services/useTienda.js'
import GsapToast from '../../../../components/layout/GsapToast.vue'

const toastRef = ref(null)

function showToast(payload) {
  toastRef.value?.show(payload)
}

const route = useRoute()
const { data } = useTienda()

const producto = computed(() => {

  const id = Number(route.params.product_id)

  if (!data.value || !id) return null

  for (const cat of data.value.categorias || []) {
    const found = (cat.productos || []).find(p => p.product_id === id)
    if (found) return found
  }

  return null
})

const { mercado } = useMercado()

const fondoStyle = computed(() => {

  if (!mercado.value?.patron_fondo) return {}

  return cssToObject(mercado.value.patron_fondo)

})

const props = defineProps({
  product_id: Number,
  title: String,
  price: String,
  rating: String,
  img: String,
  badge: String
})

</script>

<style scoped>
.content-container {
  width: 100%;
  max-width: 1400px;
  margin: auto;
}
</style>