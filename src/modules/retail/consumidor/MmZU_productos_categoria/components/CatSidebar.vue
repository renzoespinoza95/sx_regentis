<template>

    <div ref="sidebar" class="w-24 flex flex-col items-center gap-4 pt-2 overflow-y-auto no-scrollbar cursor-grab"
        style="max-height: calc(100vh - 140px);">

        <div v-for="(cat, i) in categorias" :key="i" @click="$emit('change', i)"
            class="flex flex-col items-center cursor-pointer">

            <!-- IMAGEN -->
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 transition" :class="i === active
                ? 'border-orange-500 scale-105'
                : 'border-transparent opacity-70'">
                <img :src="`https://picsum.photos/100?random=${i + 50}`" class="w-full h-full object-cover" />
            </div>

            <!-- TEXTO -->
            <div class="text-[10px] mt-1 text-center leading-tight"
                :class="i === active ? 'text-orange-500 font-semibold' : 'text-gray-500'">
                {{ cat }}
            </div>

        </div>

    </div>

</template>

<script setup>
import { ref } from 'vue'

defineProps({
    categorias: Array,
    active: Number
})

const sidebar = ref(null)

let isDown = false
let startY = 0
let scrollTop = 0

function startDrag(e) {
    isDown = true

    sidebar.value.classList.add('grabbing') // 👈 efecto visual

    startY = e.pageY - sidebar.value.offsetTop
    scrollTop = sidebar.value.scrollTop
}

function onDrag(e) {
    if (!isDown) return

    e.preventDefault()

    const y = e.pageY - sidebar.value.offsetTop
    const walk = (y - startY) * 1.5

    sidebar.value.scrollTop = scrollTop - walk
}

function stopDrag() {
    isDown = false

    sidebar.value.classList.remove('grabbing') // 👈 efecto visual
}
</script>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    scrollbar-width: none;
}

/* estado normal */
.sidebar-draggable {
    cursor: grab;
}

/* mientras arrastras */
.grabbing {
    cursor: grabbing;
    user-select: none;
}
</style>