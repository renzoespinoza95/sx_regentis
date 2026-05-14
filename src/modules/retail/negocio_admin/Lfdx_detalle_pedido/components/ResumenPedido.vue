<template>

    <div class="mt-3 bg-gray-50 rounded-md p-3 text-sm space-y-2">

        <div class="flex justify-between">
            <span>Subtotal</span>
            <span>S/ {{ subtotal }}</span>
        </div>

        <div class="flex justify-between">
            <span>Delivery</span>
            <span>S/ {{ delivery }}</span>
        </div>

        <div class="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>S/ {{ total }}</span>
        </div>

    </div>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    items: Array
})

// 🔥 cálculo automático
const subtotal = computed(() => {
    return props.items.reduce((sum, p) => {
        return sum + (p.precio_unitario * p.cantidad)
    }, 0)
})

// 🔥 demo (puedes cambiar luego)
const delivery = computed(() => 0)

const total = computed(() => {
    return subtotal.value + delivery.value
})
</script>
