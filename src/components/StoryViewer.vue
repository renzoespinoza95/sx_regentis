<template>

    <div v-if="modelValue" class="fixed inset-0 bg-black z-[999999] flex items-center justify-center">

        <!-- 🔥 TOP -->
        <div class="absolute top-0 left-0 w-full px-2 pt-3 z-20">

            <!-- BARRAS -->
            <div class="flex gap-1">

                <div v-for="(img, i) in imagenes" :key="i" class="flex-1 h-1 bg-white/30 rounded overflow-hidden">

                    <div class="h-full bg-white transition-all duration-200" :style="{

                        width:

                            i < index
                                ? '100%'

                                : i === index
                                    ? `${progress}%`

                                    : '0%'

                    }">

                    </div>

                </div>

            </div>

            <!-- X -->
            <div class="flex justify-end mt-3">

                <button @click="close"
                    class="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center">

                    <i class="fa fa-times"></i>

                </button>

            </div>

        </div>

        <!-- 🔥 IMG -->
        <img :src="imagenes[index]" class="max-h-screen max-w-full object-contain mx-auto" />

        <!-- 🔥 LEFT -->
        <button v-if="index > 0" @click="prev"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center">

            <i class="fa fa-chevron-left"></i>

        </button>

        <!-- 🔥 RIGHT -->
        <button v-if="index < imagenes.length - 1" @click="next"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center">

            <i class="fa fa-chevron-right"></i>

        </button>

        <!-- 🔥 BOTÓN FLOTANTE DESCARGAR (ROJO) -->
        <button v-if="imagenes[index]" @click="descargarImagenActual" class="
            fixed

            bottom-24
            right-6

            z-[9999]

            w-20
            h-20

            rounded-full

            bg-[#EF4444]

            flex
            items-center
            justify-center

            shadow-[0_8px_25px_rgba(239,68,68,.45)]

            active:scale-95

            transition
            cursor-pointer
        " title="Descargar imagen">

            <i class="
                fa
                fa-download

                text-white
            " style="
                font-size: 40px;
                line-height: 1;
            ">
            </i>

        </button>

    </div>

</template>

<script setup>

import {
    ref,
    watch,
    onUnmounted
} from 'vue'

import { bus } from '../services/eventBus.js'

const props = defineProps({

    modelValue: Boolean,

    imagenes: {
        type: Array,
        default: () => []
    }

})

const emit = defineEmits([
    'update:modelValue'
])

const index = ref(0)
const progress = ref(0)

let interval = null

function startTimer() {

    clearTimer()

    progress.value = 0

    interval = setInterval(() => {

        progress.value += 2

        if (progress.value >= 100) {

            next()

        }

    }, 100)

}

function clearTimer() {

    if (interval) {

        clearInterval(interval)

        interval = null

    }

}

function next() {

    if (index.value < props.imagenes.length - 1) {

        index.value++

        startTimer()

    } else {

        close()

    }

}

function prev() {

    if (index.value > 0) {

        index.value--

        startTimer()

    }

}

function close() {

    clearTimer()

    bus.emit(
        'bottomnav:toggle',
        false
    )

    emit(
        'update:modelValue',
        false
    )

}

/* =========================================
🔥 DESCARGAR IMAGEN ACTUAL
========================================= */
async function descargarImagenActual() {

    const url = props.imagenes[index.value]

    if (!url) return

    try {

        const response = await fetch(url)

        const blob = await response.blob()

        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')

        a.href = blobUrl

        a.download = `story_img_${Date.now()}.jpg`

        document.body.appendChild(a)

        a.click()

        document.body.removeChild(a)

        URL.revokeObjectURL(blobUrl)

    } catch (e) {

        // Fallback por si hay restricción de CORS al realizar fetch
        const windowRef = window.open(url, '_blank')

        if (windowRef) windowRef.focus()

    }

}

watch(

    () => props.modelValue,

    (v) => {

        if (v) {

            bus.emit(
                'bottomnav:toggle',
                true
            )

            index.value = 0

            startTimer()

        } else {

            bus.emit(
                'bottomnav:toggle',
                false
            )

            clearTimer()

        }

    }

)

onUnmounted(clearTimer)

</script>