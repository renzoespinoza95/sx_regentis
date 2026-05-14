<template>

  <div class="min-h-screen pt-20" :style="fondoStyle">

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
    <AppChatFloat v-if="producto" :neg-id="data?.negocio?.neg_id" :texto-mensaje="`
Buenos días. Quisiera información sobre el producto ${producto?.name || producto?.nombre}
que se encuentra a S/ ${producto?.precio || producto?.price}.
Muchas gracias.
`" :contexto="{
  tipo: 'producto',
  data: {
    product_id: producto?.product_id,
    nombre: producto?.name || producto?.nombre,
    precio: producto?.precio || producto?.price,
    url: `/QZMq_detalle_prod/${producto?.product_id}`,
    imagen: producto?.imagen || producto?.img
  }
}" />


  </div>
  <GsapToast ref="toastRef" />

</template>

<script setup>
import { computed, ref, watch } from 'vue'
import DetalleImagen from './components/DetalleImagen.vue'
import DetalleInfoCard from './components/DetalleInfoCard.vue'
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import { useRoute } from 'vue-router'
import { useTienda } from '../../../../services/useTienda.js'
import GsapToast from '../../../../components/layout/GsapToast.vue'
import AppChatFloat from '../../../../components/layout/AppChatFloat.vue'
import { useTrackingQueue } from '../../../../services/useTrackingQueue.js'
import { useUsuario } from '../../../../services/usuarioService.js'


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

const { addTracking } = useTrackingQueue()

const { usuario } = useUsuario()

watch(producto, (p) => {

  if (!p) return

  const usu_id = usuario.value?.user?.usu_id

  if (!usu_id) return

  addTracking({

    usu_id,

    accion: 'view_producto',

    descripcion: 'Usuario vio producto',

    extra_data: {

      product_id: p.product_id,
      nombre: p.name,
      precio: p.price

    }

  })

}, { immediate: true })

</script>

<style scoped>
.content-container {
  width: 100%;
  max-width: 1400px;
  margin: auto;
}
</style>