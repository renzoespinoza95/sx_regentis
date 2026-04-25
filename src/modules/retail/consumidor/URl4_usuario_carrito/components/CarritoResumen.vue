<template>
  <div class="mt-6 text-sm space-y-3">

    <div class="flex justify-between">
      <span class="text-gray-500">Subtotal</span>
      <span>$45.99</span>
    </div>

    <div class="flex justify-between">
      <span class="text-gray-500">Shipping</span>
      <span>$4.99</span>
    </div>

    <div class="flex justify-between font-semibold text-base">
      <span>Bag Total</span>
      <span>$50.98</span>
    </div>


    <button class="mt-6 w-full bg-[#FD7635] text-white py-3 rounded-full text-sm font-medium" @click="irFechaEntrega">
      Realizar pedido
    </button>

  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function irFechaEntrega() {
  router.push({
    path: '/QJB5_fecha_entrega',
    query: {
      titulo: 'Fecha de entrega'
    }
  })
}
</script>