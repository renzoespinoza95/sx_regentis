<template>
  <div class="flex items-center justify-center gap-3 mt-4">

    <button class="text-white w-8 h-8 rounded-lg flex items-center justify-center shadow" :style="btnStyle"
      @click="decrement">
      -
    </button>

    <span class="text-gray-800 font-medium">
      {{ qty }}
    </span>

    <button class="text-white w-8 h-8 rounded-lg flex items-center justify-center shadow" :style="btnStyle"
      @click="increment">
      +
    </button>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMercado } from '../../../../../services/useMercado.js'

const qty = ref(1)

const { mercado } = useMercado()

const btnStyle = computed(() => ({
  background: mercado.value?.topnavbar_color || '#f97316'
}))

function increment() {
  qty.value++
}

function decrement() {
  if (qty.value > 1) qty.value--
}
</script>