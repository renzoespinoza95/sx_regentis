<script setup>

import { computed } from 'vue'

const props = defineProps({
  producto: Object
})

/* =========================
   🔥 IMAGEN PRINCIPAL
========================= */

const imagenPrincipal = computed(() => {

  const imagenes =
    props.producto?.imagenes || []

  /* 🔥 ORDEN = 1 */
  const principal = imagenes.find(
    i => Number(i.orden) === 1
  )

  if (principal?.img) {
    return principal.img
  }

  /* 🔥 FALLBACK PRIMERA */
  if (imagenes[0]?.img) {
    return imagenes[0].img
  }

  /* 🔥 FALLBACK FINAL */
  return 'https://picsum.photos/600/400?random=55'

})

</script>

<template>

  <div class="mt-4 flex justify-center">

    <div class="w-full md:max-w-md lg:max-w-lg h-[280px] overflow-hidden rounded-b-3xl">

      <img :src="imagenPrincipal" class="w-full h-full object-cover" />

    </div>

  </div>

</template>