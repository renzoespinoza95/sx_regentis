<template>

    <div>

        <div class="text-sm font-semibold mb-2">
            Pedidos anteriores
        </div>

        <div class="space-y-2">

            <PedidoRowView v-for="(p, i) in items" :key="i" :item="p" />

        </div>

    </div>

</template>

<script setup>
import PedidoRowView from './PedidoRowView.vue'

defineProps({
    items: Array
})
</script>
