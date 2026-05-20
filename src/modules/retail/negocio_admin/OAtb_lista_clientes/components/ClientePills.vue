<template>

    <div ref="lettersScroll" class="
            overflow-x-auto
            pb-2
            no-scrollbar
            cursor-grab
            active:cursor-grabbing
            select-none
        " @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp"
        @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">

        <div class="
                grid
                grid-rows-2
                grid-flow-col
                gap-2
                w-max
            ">

            <!-- TODOS -->
            <div @click="select(null)" class="
                    flex-shrink-0
                    px-3
                    py-2
                    rounded-full
                    text-xs
                    flex
                    items-center
                    gap-1
                    cursor-pointer
                    transition
                    active:scale-95
                " :class="modelValue === null
                        ?
                        'bg-orange-500 text-white'
                        :
                        'bg-orange-100 text-orange-600'
                    ">

                🔥 Todos

            </div>

            <!-- FAVORITOS -->
            <div @click="select('FAVORITOS')" class="
                    flex-shrink-0
                    px-3
                    py-2
                    rounded-full
                    text-xs
                    flex
                    items-center
                    gap-1
                    cursor-pointer
                    transition
                    active:scale-95
                " :class="modelValue === 'FAVORITOS'
                        ?
                        'bg-pink-500 text-white'
                        :
                        'bg-pink-100 text-pink-600'
                    ">

                ❤️ Favoritos

            </div>

            <!-- POR PAGAR -->
            <div @click="select('POR_PAGAR')" class="
                    flex-shrink-0
                    px-3
                    py-2
                    rounded-full
                    text-xs
                    flex
                    items-center
                    gap-1
                    cursor-pointer
                    transition
                    active:scale-95
                " :class="modelValue === 'POR_PAGAR'
                        ?
                        'bg-red-500 text-white'
                        :
                        'bg-red-100 text-red-600'
                    ">

                💸 Por pagar

            </div>

            <!-- LETRAS -->
            <div v-for="l in letras" :key="l" @click="select(l)" class="
                    flex-shrink-0
                    px-3
                    py-2
                    rounded-full
                    text-xs
                    font-semibold
                    cursor-pointer
                    transition
                    active:scale-95
                " :class="modelValue === l
                        ?
                        'bg-orange-500 text-white'
                        :
                        'bg-orange-100 text-orange-600'
                    ">

                {{ l }}

            </div>

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

        default: null

    }

})

const emit =
    defineEmits([

        'update:modelValue'

    ])

const letras = [

    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'

]

function select(
    value
) {

    emit(
        'update:modelValue',
        value
    )

}

/* ======================================
   🖱️ DRAG
====================================== */

const lettersScroll =
    ref(null)

const isDragging =
    ref(false)

let startX = 0
let scrollLeft = 0

function onMouseDown(e) {

    isDragging.value = true

    startX =
        e.pageX
        -
        lettersScroll.value.offsetLeft

    scrollLeft =
        lettersScroll.value.scrollLeft

}

function onMouseMove(e) {

    if (!isDragging.value)
        return

    e.preventDefault()

    const x =
        e.pageX
        -
        lettersScroll.value.offsetLeft

    const walk =
        (x - startX) * 1.2

    lettersScroll.value.scrollLeft =
        scrollLeft - walk

}

function onMouseUp() {

    isDragging.value = false

}

function onTouchStart(e) {

    isDragging.value = true

    startX =
        e.touches[0].pageX
        -
        lettersScroll.value.offsetLeft

    scrollLeft =
        lettersScroll.value.scrollLeft

}

function onTouchMove(e) {

    if (!isDragging.value)
        return

    const x =
        e.touches[0].pageX
        -
        lettersScroll.value.offsetLeft

    const walk =
        (x - startX) * 1.2

    lettersScroll.value.scrollLeft =
        scrollLeft - walk

}

function onTouchEnd() {

    isDragging.value = false

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
