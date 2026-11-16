<template>

  <div class="tn-page min-h-screen pt-[66px]" :class="{ 'tienda-theme': temaActivo }" :style="fondoStyle">

    <!-- 🔥 MISMO HEADER DE NEGOCIO -->
    <NegpresHeader />

    <!-- CONTENIDO -->
    <div class="content-container">

      <div v-if="!producto" class="text-center mt-10 text-gray-500">
        Cargando producto...
      </div>

      <div v-else>
        <DetalleImagenSlider :producto="producto" />
        <DetalleInfoCard :producto="producto" @toast="showToast" @update:variante="v => varianteSeleccionada = v" />
      </div>

    </div>
    <AppWhatsappFloat v-if="producto" :celular="data?.negocio?.celular_informes" :mensaje="`
Buenos días. Quisiera información sobre el producto ${producto?.name}${textoAtributoMensaje} que se encuentra a S/ ${producto?.price}.

Muchas gracias.
`" />

  </div>
  <GsapToast ref="toastRef" />

</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import DetalleImagenSlider from './components/DetalleImagenSlider.vue'
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
import AppWhatsappFloat
  from '../../../../components/layout/AppWhatsappFloat.vue'


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

const varianteSeleccionada = ref(null)

const textoAtributoMensaje = computed(() => {
  if (!producto.value || !varianteSeleccionada.value) return ''

  let label = 'Opción'
  if (producto.value.variantes?.atributo) {
    label = producto.value.variantes.atributo
  } else if (producto.value.variantes_json) {
    try {
      const parsed = JSON.parse(producto.value.variantes_json)
      if (parsed.atributo) label = parsed.atributo
    } catch (e) { }
  }

  return ` (${label}: ${varianteSeleccionada.value.valor})`
})

/* =========================
   🎨 TEMA (base_css + estilo_css)
========================= */

const STYLE_BASE_ID = 'tn-theme-base'
const STYLE_ESTILO_ID = 'tn-theme-estilo'

const temaActivo =
  computed(() => !!data.value?.tema?.base_css)

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

watch(
  () => [
    data.value?.tema?.base_css,
    data.value?.tema?.estilo_css
  ],
  ([base, estilo]) => {
    if (!base) return
    setStyle(STYLE_BASE_ID, base)
    setStyle(STYLE_ESTILO_ID, estilo || '')
  },
  { immediate: true }
)

onUnmounted(() => {
  document.getElementById(STYLE_BASE_ID)?.remove()
  document.getElementById(STYLE_ESTILO_ID)?.remove()
})

const fondoStyle = computed(() => {

  if (temaActivo.value) {
    return {}
  }

  const tema_id = Number(
    data.value?.tema?.tema_id || 0
  )

  /* =========================
     🔥 TEMA DE LA TIENDA
  ========================= */

  if (

    tema_id > 0

    &&

    data.value?.tema?.fondo

  ) {

    return cssToObject(

      data.value.tema.fondo

    )

  }

  /* =========================
     🔥 FONDO DEL MERCADO
  ========================= */

  if (

    mercado.value?.patron_fondo

  ) {

    return cssToObject(

      mercado.value.patron_fondo

    )

  }

  return {}

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