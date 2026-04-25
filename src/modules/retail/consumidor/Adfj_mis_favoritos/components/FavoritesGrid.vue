<template>
    <div class="grid grid-cols-2 gap-4">
        <FavoriteCard v-for="p in productos" :key="p.id" :producto="p" />
    </div>
</template>

<script setup>
import FavoriteCard from './FavoriteCard.vue'

defineProps({
    productos: Array
})
</script>