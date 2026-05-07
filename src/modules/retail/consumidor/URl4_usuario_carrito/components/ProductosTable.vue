<template>

    <div>

        <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold">Productos</span>
        </div>

        <div class="space-y-2">

            <ProductoRow v-for="(p, i) in items" :key="i" :item="p" @edit="$emit('edit', $event)"
                @delete="$emit('delete', $event)" />

        </div>

    </div>

</template>

<script setup>
import ProductoRow from './ProductoRow.vue'
import { useMercado } from '../../../../../services/useMercado.js'

const { mercado } = useMercado()

defineProps({ items: Array })
defineEmits(['edit', 'delete'])
</script>