<template>

    <div class="mt-6">

        <div class="px-4 mb-3 font-semibold text-gray-700">
            Mas Vendidos
        </div>

        <!-- CAROUSEL -->
        <div ref="container" class="flex gap-4 overflow-x-auto no-scrollbar px-4 cursor-grab" @mousedown="startDrag"
            @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchstart="startDrag" @touchmove="onDrag"
            @touchend="stopDrag">

            <div v-for="p in productos" :key="p.product_id" class="w-[180px] flex-shrink-0">
                <NegpresProductoCard :product_id="p.product_id" :title="p.name" :price="p.price" :rating="5"
                    :img="p.img" badge="🔥" />
            </div>

        </div>

    </div>

</template>

<script setup>
import { ref } from 'vue'
import NegpresProductoCard from './NegpresProductoCard.vue'

const props = defineProps({
    productos: Array
})

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