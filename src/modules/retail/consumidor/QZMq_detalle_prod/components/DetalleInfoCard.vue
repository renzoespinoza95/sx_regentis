<template>
  <div class="relative -mt-16 mx-auto max-w-md bg-white rounded-3xl p-6 shadow-xl">
    <div class="absolute top-4 right-4 bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
      <i class="fa fa-heart text-orange-500"></i>
    </div>

    <h2 class="text-xl font-semibold text-gray-800">
      Mango Smoothie
    </h2>

    <DetalleRating />

    <div class="mt-4 text-gray-800 font-semibold text-lg">
      Price $15
    </div>

    <DetalleCounter />

    <p class="mt-4 text-gray-500 text-sm leading-relaxed">
      Cold, creamy, thick mango smoothie filled with juicy mango
    </p>

    <button class="mt-6 w-full py-3 rounded-full text-white font-semibold shadow-lg active:scale-95 transition"
      :style="btnStyle">
      Pedir ahora
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMercado } from '../../../../../services/useMercado.js'

import DetalleRating from './DetalleRating.vue'
import DetalleCounter from './DetalleCounter.vue'

const { mercado } = useMercado()

// 🔥 color dinámico del botón
const btnStyle = computed(() => ({
  background: mercado.value?.topnavbar_color || '#f97316'
}))
</script>