<template>
  <div class="px-4 mt-6">

    <div class="flex justify-between mb-3">
      <span class="font-semibold">
        Marketplace
      </span>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

      <div v-for="n in negocios" :key="n.neg_id" class="min-w-[140px] bg-white rounded-2xl shadow-md p-3">

        <!-- IMAGEN -->
        <img :src="`https://picsum.photos/100?random=${n.neg_id}`" class="w-12 h-12 rounded-lg object-cover" />

        <!-- NOMBRE -->
        <div class="mt-2 text-sm font-semibold">
          {{ n.nombre }}
        </div>

        <!-- INFO -->
        <div class="text-xs text-gray-500">
          {{ n.icono || '🏪' }} Puesto {{ n.puesto }}
        </div>

        <!-- BOTON -->
        <router-link to="/CV2K_negocio" class="mt-2 text-white text-xs px-3 py-1 rounded-full w-full text-center block"
          :style="{ background: mercado.topnavbar_color || '#FD7635' }">
          Entrar
        </router-link>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue'
import { usePrincipal } from '../../../services/usePrincipal'
import { categoriaSeleccionada } from '../../../services/useCategoria'

const negocios = ref([])
const allNegocios = ref([])
const container = ref(null)

const q = usePrincipal()
const dataLocal = ref(null)

const mercado = computed(() => {
  return q.data?.value?.mercado
    || dataLocal.value?.mercado
    || {}
})

// 🔥 CARGA DATA
if (q.data) {

  watchEffect(() => {
    if (q.data.value) {
      allNegocios.value = q.data.value.negocios
      negocios.value = allNegocios.value
    }
  })

} else {

  // 🔥 cargar si NO hay Vue Query
  onMounted(async () => {
    if (!q.data) {
      const data = await q.refetch()

      dataLocal.value = data
      allNegocios.value = data.negocios
      negocios.value = data.negocios
    }
  })

}

// 🔥 FILTRO POR CATEGORIA
watchEffect(() => {

  if (!categoriaSeleccionada.value) {
    negocios.value = allNegocios.value
    return
  }

  negocios.value = allNegocios.value.filter(n =>
    n.reg_cat_neg_id === categoriaSeleccionada.value.reg_cat_neg_id
  )

})

watchEffect(() => {
  console.log('🔥 mercado miniapps:', mercado.value)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  scrollbar-width: none;
}
</style>