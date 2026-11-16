<template>

    <div v-if="subcategorias.length > 0" class="w-full py-2 px-3 bg-transparent">

        <div ref="scrollRef" class="flex items-center gap-3 overflow-x-auto no-scrollbar cursor-grab"
            :class="{ 'tn-sub': tematizado }" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"
            @mouseleave="stopDrag">

            <button v-for="(sub, i) in subcategorias" :key="sub.subcategoria_id ?? i" type="button"
                class="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                :class="{ 'tn-sub-item': tematizado, active: tematizado && isActive(sub) }"
                @click="$emit('change', sub.subcategoria_id)">

                <!-- ==================== CON TEMA ==================== -->
                <template v-if="tematizado">

                    <!-- Imagen con aro -->
                    <div class="tn-ring" :class="{ active: isActive(sub) }">

                        <div class="tn-ring-img w-12 h-12">
                            <img :src="getImg(sub, i)" :alt="sub.nombre" />
                        </div>

                    </div>

                    <!-- Nombre -->
                    <span class="tn-sub-name">
                        {{ sub.nombre }}
                    </span>

                </template>

                <!-- ==================== SIN TEMA ==================== -->
                <template v-else>

                    <!-- Imagen circular -->
                    <div class="w-12 h-12 rounded-full overflow-hidden transition relative border-2" :class="isActive(sub)
                        ? 'border-orange-500 scale-105 shadow-md'
                        : 'border-gray-200 opacity-80 group-hover:opacity-100'">
                        <img :src="getImg(sub, i)" class="w-full h-full object-cover" />
                    </div>

                    <!-- Nombre -->
                    <span class="text-[11px] mt-1 text-center leading-tight whitespace-nowrap font-medium"
                        :class="isActive(sub) ? 'text-orange-600 font-bold' : 'text-gray-600'">
                        {{ sub.nombre }}
                    </span>

                </template>

            </button>

        </div>

    </div>

</template>

<script setup>

import { ref } from 'vue'

/* =========================
   PROPS
========================= */

const props = defineProps({

    subcategorias: {
        type: Array,
        default: () => []
    },

    active: {
        type: [Number, String],
        default: 'recomendado'
    },

    /* true cuando el negocio tiene un tema con base_css */
    tematizado: {
        type: Boolean,
        default: false
    }

})

defineEmits(['change'])


/* =========================
   AYUDAS
========================= */

function isActive(sub) {
    return sub.subcategoria_id === props.active
}

function getImg(sub, i) {

    if (sub.img) return sub.img

    return `https://picsum.photos/100?random=${sub.subcategoria_id || i}`

}


/* =========================
   ARRASTRE (MOUSE)
========================= */

const scrollRef = ref(null)

let isDown = false
let startX = 0
let scrollLeft = 0

function startDrag(e) {

    isDown = true

    scrollRef.value.classList.add('cursor-grabbing')

    startX = e.pageX - scrollRef.value.offsetLeft
    scrollLeft = scrollRef.value.scrollLeft

}

function onDrag(e) {

    if (!isDown) return

    e.preventDefault()

    const x = e.pageX - scrollRef.value.offsetLeft
    const walk = (x - startX) * 1.5

    scrollRef.value.scrollLeft = scrollLeft - walk

}

function stopDrag() {

    isDown = false

    if (scrollRef.value) {
        scrollRef.value.classList.remove('cursor-grabbing')
    }

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