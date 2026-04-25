<template>

    <div class="min-h-screen" :style="fondoStyle">

        <NegpresHeader />

        <div class="content-container">

            <SearchBar />

            <div class="flex mt-4">

                <!-- IZQUIERDA -->
                <CatSidebar :categorias="categorias" :active="activeCat" @change="setCategoria" />

                <!-- DERECHA -->
                <ProductGrid :productos="productosFiltrados" />

            </div>

        </div>

    </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import CatSidebar from './components/CatSidebar.vue'
import ProductGrid from './components/ProductGrid.vue'
import SearchBar from './components/SearchBar.vue'

// 🔥 IMPORTANTE (igual que el otro módulo)
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

const categorias = [
    'Popular',
    'Smartphones',
    'Laptops',
    'Fragance',
    'Skincare',
    'Groceries',
    'Home',
    'Furniture',
    'Tops',
    'Women'
]

const activeCat = ref(0)

const productos = [
    { id: 1, nombre: 'iPhone 9', precio: 477, img: 'https://picsum.photos/200?1' },
    { id: 2, nombre: 'iPhone X', precio: 737, img: 'https://picsum.photos/200?2' },
    { id: 3, nombre: 'Samsung Universe', precio: 1055, img: 'https://picsum.photos/200?3' },
    { id: 4, nombre: 'OPPO F19', precio: 229, img: 'https://picsum.photos/200?4' },
    { id: 5, nombre: 'Huawei P30', precio: 446, img: 'https://picsum.photos/200?5' },
    { id: 6, nombre: 'MacBook Pro', precio: 1556, img: 'https://picsum.photos/200?6' },
    { id: 7, nombre: 'HP EliteBook', precio: 899, img: 'https://picsum.photos/200?7' },
    { id: 8, nombre: 'Dell XPS', precio: 1200, img: 'https://picsum.photos/200?8' },
    { id: 9, nombre: 'Lenovo Thinkpad', precio: 999, img: 'https://picsum.photos/200?9' },
    { id: 10, nombre: 'Asus Zenbook', precio: 850, img: 'https://picsum.photos/200?10' }
]

const productosFiltrados = computed(() => {
    return productos // luego aquí filtras por categoría
})

function setCategoria(index) {
    activeCat.value = index
}

// =========================
// 🔥 FONDO DINÁMICO
// =========================

const { mercado } = useMercado()

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) {
        return {}
    }

    return cssToObject(mercado.value.patron_fondo)

})
</script>