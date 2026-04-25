<template>

    <div class="mt-6">

        <div class="px-4 mb-3 font-semibold text-gray-700">
            Mas Vendidos
        </div>

        <!-- CAROUSEL -->
        <div ref="container" class="flex gap-4 overflow-x-auto no-scrollbar px-4 cursor-grab" @mousedown="startDrag"
            @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchstart="startDrag" @touchmove="onDrag"
            @touchend="stopDrag">

            <div v-for="(p, i) in productos" :key="i" class="min-w-[160px]">
                <NegpresProductoCard v-bind="p" />
            </div>

        </div>

    </div>

</template>

<script setup>
import { ref } from 'vue'
import NegpresProductoCard from './NegpresProductoCard.vue'

const productos = [
    { title: 'Leche Gloria', price: '4.70', rating: '5.0', img: 'https://picsum.photos/300?random=31', badge: '25%' },
    { title: 'Arroz Extra', price: '19.80', rating: '4.8', img: 'https://picsum.photos/300?random=32', badge: 'OFERTA' },
    { title: 'Aceite Primor', price: '8.50', rating: '4.7', img: 'https://picsum.photos/300?random=33', badge: 'HOT' },
    { title: 'Azúcar Rubia', price: '3.20', rating: '4.6', img: 'https://picsum.photos/300?random=34', badge: 'D10' },
    { title: 'Fideos Don Vittorio', price: '2.90', rating: '4.9', img: 'https://picsum.photos/300?random=35', badge: 'TOP' },
    { title: 'Atún Florida', price: '6.50', rating: '5.0', img: 'https://picsum.photos/300?random=36', badge: '🔥' }
]

const container = ref(null)

let isDown = false
let startX
let scrollLeft

function startDrag(e) {
    isDown = true
    const pageX = e.touches ? e.touches[0].pageX : e.pageX
    startX = pageX - container.value.offsetLeft
    scrollLeft = container.value.scrollLeft
}

function onDrag(e) {
    if (!isDown) return
    e.preventDefault()

    const pageX = e.touches ? e.touches[0].pageX : e.pageX
    const x = pageX - container.value.offsetLeft
    const walk = (x - startX) * 1.2
    container.value.scrollLeft = scrollLeft - walk
}

function stopDrag() {
    isDown = false
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    scrollbar-width: none;
}
</style>