<template>
  <div class="px-4 mt-6">

    <div class="flex justify-between mb-3">
      <span class="font-semibold">
        Marketplace
      </span>
    </div>
    <div v-if="negocios.length" class="
    grid
    grid-cols-2
    sm:grid-cols-3
    md:grid-cols-4
    gap-4
  ">

      <div v-for="(n, index) in negocios" :ref="el => cardsRef[index] = el" :key="n.neg_id" class="
      min-w-[140px]
      bg-white
      rounded-2xl
      shadow-md
      p-3
    ">

        <!-- IMAGEN -->
        <img :src="n.img_logo

          ||

          'https://barsi-img.b-cdn.net/recursos/sg3f.png'

          " class="
        w-12
        h-12
        rounded-lg
        object-cover
      " />

        <!-- NOMBRE -->
        <div class="mt-2 text-sm font-semibold">
          {{ n.nombre }}
        </div>

        <!-- INFO -->
        <div class="text-xs text-gray-500">
          {{ n.icono || '🏪' }}
          Puesto {{ n.puesto }}
        </div>

        <!-- BOTON -->
        <router-link :to="`/CV2K_negocio/${n.neg_id}`

          +

          `?titulo=${encodeURIComponent(n.nombre)}`

          " class="
        mt-2
        text-white
        text-xs
        px-3
        py-1
        rounded-full
        w-full
        text-center
        block
      " :style="{
        background:
          mercado.topnavbar_color
          ||
          '#FD7635'
      }">

          Entrar

        </router-link>

      </div>

    </div>

    <!-- EMPTY -->
    <div v-else class="
  w-full

  flex
  items-start
  justify-center
  pb-10
">

      <EmptyLetter titulo="Disponible" texto="Sé el primero en esta categoría ✨" />

    </div>

  </div>


</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue'
import { usePrincipal } from '../../../services/usePrincipal'
import { categoriaSeleccionada } from '../../../services/useCategoria'
import EmptyLetter
  from '../../../components/layout/EmptyLetter.vue'
import gsap from 'gsap'

const negocios = ref([])
const allNegocios = ref([])
const container = ref(null)
const cardsRef = ref([])
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
    n.rubros?.some(

      r =>

        String(r.rubro_id)

        ===

        String(
          categoriaSeleccionada.value.rubro_id
        )

    )
  )

})

/* =========================================
   🔥 GSAP ENTRADA
========================================= */

watchEffect(() => {

  if (!negocios.value.length) {
    return
  }

  requestAnimationFrame(() => {

    gsap.fromTo(

      cardsRef.value,

      {

        opacity: 0,

        y: 80,

        scale: 0.92

      },

      {

        opacity: 1,

        y: 0,

        scale: 1,

        duration: 0.7,

        stagger: 0.08,

        ease: 'power3.out'

      }

    )

  })

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