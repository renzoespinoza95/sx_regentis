<script setup>
import { ref } from 'vue'

const qty = ref(1)

function plus() {
  qty.value++
}

function minus() {
  if (qty.value > 1) qty.value--
}
</script>

<template>
  <div class="flex items-center justify-center gap-6 mt-6">

    <div class="text-xl font-semibold">
      $5.60
    </div>

    <div class="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-4">
      <button @click="minus">
        <i class="fa fa-minus"></i>
      </button>
      <span>{{ qty }}</span>
      <button @click="plus">
        <i class="fa fa-plus"></i>
      </button>
    </div>

  </div>
</template>
