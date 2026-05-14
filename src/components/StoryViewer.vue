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

                <button @click="close" class="w-9 h-9 rounded-full bg-black/50 text-white">

                    <i class="fa fa-times"></i>

                </button>

            </div>

        </div>

        <!-- 🔥 IMG -->
        <img :src="imagenes[index]" class="max-h-screen max-w-full object-contain mx-auto" />

        <!-- 🔥 LEFT -->
        <button v-if="index > 0" @click="prev"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white">

            <i class="fa fa-chevron-left"></i>

        </button>

        <!-- 🔥 RIGHT -->
        <button v-if="index < imagenes.length - 1" @click="next"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white">

            <i class="fa fa-chevron-right"></i>

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
