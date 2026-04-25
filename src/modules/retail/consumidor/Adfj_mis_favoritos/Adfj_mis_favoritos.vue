<template>
    <div class="min-h-screen pattern-background">

        <NegpresHeader />

        <div class="content-container">

            <SectionTitle title="Tus productos favoritos 💛" />

            <FavoritesGrid :productos="favoritos" />

            <EmptyState v-if="favoritos.length === 0" />

        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'

import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import FavoritesGrid from './components/FavoritesGrid.vue'
import SectionTitle from './components/SectionTitle.vue'
import EmptyState from './components/EmptyState.vue'

const favoritos = ref([
    { id: 1, nombre: 'iPhone 9', precio: 477, img: 'https://picsum.photos/200?1', descuento: 10 },
    { id: 2, nombre: 'iPhone X', precio: 737, img: 'https://picsum.photos/200?2', descuento: 15 },
    { id: 3, nombre: 'Samsung', precio: 1055, img: 'https://picsum.photos/200?3', descuento: 20 },
    { id: 4, nombre: 'OPPO F19', precio: 229, img: 'https://picsum.photos/200?4', descuento: 12 }
])
</script>

<style scoped>
.pattern-background {
    background-color: #e5e5f7;
    background-image:
        linear-gradient(135deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(225deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(45deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(315deg, #FCCBB5 25%, #e5e5f7 25%);
    background-size: 20px 20px;
}

.content-container {
    max-width: 1400px;
    margin: auto;
    padding: 20px;
}
</style>