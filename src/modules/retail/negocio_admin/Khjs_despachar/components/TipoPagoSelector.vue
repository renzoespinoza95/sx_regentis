<template>

    <div class="space-y-4">

        <!-- LABEL -->
        <div class="text-sm font-semibold text-gray-700">

            Tipo de pago

        </div>

        <!-- SCROLL -->
        <div ref="scrollRef"
            class="flex gap-2 overflow-x-auto pb-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
            @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp"
            @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">

            <!-- EFECTIVO -->
            <button
                class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                :class="modelValue === 'EFECTIVO'
                    ? 'bg-green-500 border-green-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700'" @click="$emit('update:modelValue', 'EFECTIVO')">

                💵 EFECTIVO

            </button>

            <!-- YAPE -->
            <button
                class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                :class="modelValue === 'YAPE'
                    ? 'bg-purple-500 border-purple-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700'" @click="$emit('update:modelValue', 'YAPE')">

                📱 YAPE

            </button>

            <!-- PLIN -->
            <button
                class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                :class="modelValue === 'PLIN'
                    ? 'bg-fuchsia-500 border-fuchsia-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700'" @click="$emit('update:modelValue', 'PLIN')">

                🟣 PLIN

            </button>


            <!-- CREDITO -->
            <button
                class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                :class="modelValue === 'POR_PAGAR'
                    ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700'" @click="$emit('update:modelValue', 'POR_PAGAR')">

                🧾 POR PAGAR

            </button>

        </div>

    </div>

</template>

<script setup>

import {
    ref
}
    from 'vue'

defineProps({

    modelValue: {

        type: String,

        default: 'EFECTIVO'

    }

})

defineEmits([
    'update:modelValue'
])

const scrollRef =
    ref(null)

const isDown =
    ref(false)

let startX = 0

let scrollLeft = 0

/* =========================================
   MOUSE
========================================= */

function onMouseDown(e) {

    isDown.value = true

    startX =
        e.pageX
        -
        scrollRef.value.offsetLeft

    scrollLeft =
        scrollRef.value.scrollLeft

}

function onMouseMove(e) {

    if (!isDown.value)
        return

    e.preventDefault()

    const x =
        e.pageX
        -
        scrollRef.value.offsetLeft

    const walk =
        (x - startX) * 1.2

    scrollRef.value.scrollLeft =
        scrollLeft - walk

}

function onMouseUp() {

    isDown.value = false

}

/* =========================================
   TOUCH
========================================= */

function onTouchStart(e) {

    isDown.value = true

    startX =
        e.touches[0].pageX
        -
        scrollRef.value.offsetLeft

    scrollLeft =
        scrollRef.value.scrollLeft

}

function onTouchMove(e) {

    if (!isDown.value)
        return

    const x =
        e.touches[0].pageX
        -
        scrollRef.value.offsetLeft

    const walk =
        (x - startX) * 1.2

    scrollRef.value.scrollLeft =
        scrollLeft - walk

}

function onTouchEnd() {

    isDown.value = false

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