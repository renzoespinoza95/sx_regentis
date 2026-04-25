<template>

    <div class="mt-3 px-2">

        <div ref="container" class="flex gap-2 overflow-x-auto no-scrollbar cursor-grab" @mousedown="startDrag"
            @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchstart="startDrag" @touchmove="onDrag"
            @touchend="stopDrag">

            <!-- 🔥 TODOS -->
            <button @click="$emit('select', { category_id: null })" :style="active === null ? activeStyle : pillStyle"
                class="flex items-center gap-2 px-3 py-1 rounded-full text-xs shadow-sm whitespace-nowrap transition">
                🔥 Todos
            </button>

            <!-- 🔥 CATEGORIAS -->
            <button v-for="c in categorias" :key="c.category_id" @click="$emit('select', c)"
                class="flex items-center gap-2 px-3 py-1 rounded-full text-xs shadow-sm whitespace-nowrap transition"
                :style="c.category_id === active ? activeStyle : pillStyle">
                <span>{{ c.icon || '📦' }}</span>
                <span>{{ c.descripcion }}</span>
            </button>

        </div>

    </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useMercado } from '../../../../../services/useMercado.js'

defineProps({
    categorias: Array,
    active: Number
})
const emit = defineEmits(['select'])

const { mercado } = useMercado()

// 🔥 estilo dinámico
const pillStyle = computed(() => ({
    background: 'white',
    color: mercado.value?.topnavbar_color || '#FD7635'
}))

const activeStyle = computed(() => ({
    background: mercado.value?.topnavbar_color || '#FD7635',
    color: 'white'
}))

// ================= DRAG =================
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
