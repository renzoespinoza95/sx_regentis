<template>

    <div class="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-3 overflow-y-auto no-scrollbar"
        style="max-height: calc(100vh - 160px);">

        <ProductCard v-for="p in productos" :key="p.id" :producto="p" />

    </div>

</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
    productos: Array
})
</script>