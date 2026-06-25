<template>

    <div ref="sidebar" class="w-24 flex flex-col items-center gap-4 pt-2 overflow-y-auto no-scrollbar cursor-grab"
        style="max-height: calc(100vh - 140px);">

        <div ref="itemsRef" v-for="(cat, i) in categorias" :key="i" @click="$emit('change', i)"
            class="flex flex-col items-center cursor-pointer">

            <!-- IMAGEN -->
            <div class="w-14 h-14 rounded-full overflow-hidden transition relative"
                :class="i === active ? 'rainbow-border scale-105' : 'opacity-70'">
                <img :src="getImg(cat, i)" class="w-full h-full object-cover" />
            </div>

            <!-- TEXTO -->
            <div class="text-[10px] mt-1 text-center leading-tight" :class="{
                'text-orange-500 font-semibold': i === active
            }" :style="i === active

            ? {}

            : subtituloStyle

        ">
                {{ cat.name }}
            </div>

        </div>

    </div>

</template>

<script setup>
import {
    ref,
    onMounted,
    onUnmounted,
    computed
}
    from 'vue'
import { useTienda }
    from '../../../../../services/useTienda.js'
import { gsap } from 'gsap'

const itemsRef = ref([])

defineProps({
    categorias: Array,
    active: Number
})

function getImg(cat, i) {
    if (cat.img) return cat.img
    return `https://picsum.photos/100?random=${cat.category_id || i}`
}

const sidebar = ref(null)
const { data } = useTienda()

const subtituloStyle = computed(() => {

    const tema_id = Number(
        data.value?.tema?.tema_id || 0
    )

    if (

        tema_id > 0

        &&

        data.value?.tema?.subtitulo

    ) {

        return {

            color:
                data.value.tema.subtitulo

        }

    }

    return {

        color:
            '#0F0F0F'

    }

})

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

/* ARCOIRIS */
/* 🌈 CONTENEDOR CON BORDE ANIMADO */
.rainbow-border {
    position: relative;
    padding: 3px;
    /* grosor del borde */
    border-radius: 9999px;
}

/* 🌈 CAPA DEL BORDE */
.rainbow-border::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;

    background: linear-gradient(45deg,
            red,
            orange,
            yellow,
            lime,
            cyan,
            blue,
            violet,
            red);

    background-size: 300% 300%;

    animation: rainbowMove 3s linear infinite;

    -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);

    -webkit-mask-composite: xor;
    mask-composite: exclude;
}

/* 🌈 ANIMACIÓN */
@keyframes rainbowMove {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 300% 50%;
    }
}

.rainbow-border::after {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    background: inherit;
    filter: blur(6px);
    opacity: 0.6;
    z-index: -1;
}
</style>