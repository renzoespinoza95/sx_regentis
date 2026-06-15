<template>

    <div class="mt-4 flex justify-center">

        <div class="
                relative

                w-full
                md:max-w-md
                lg:max-w-lg

                h-[280px]

                overflow-hidden

                rounded-b-3xl

                select-none
            " @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag"
            @touchstart="startTouch" @touchend="endTouch">

            <!-- FONDO -->

            <img src="https://barsi-img.b-cdn.net/p_info/5u5f.png" class="
        absolute
        inset-0

        w-full
        h-full

        object-fill
    ">

            <!-- SLIDER -->

            <div class="
                    absolute
                    inset-0

                    flex

                    transition-transform
                    duration-500
                " :style="{

                    transform:

                        `translateX(-${index * 100}%)`

                }">

                <div v-for="(img, i) in imagenes" :key="i" class="
                        min-w-full

                        flex
                        items-center
                        justify-center

                        cursor-pointer
                    " @click="abrirStory">

                    <img :src="img" class="
                            w-full
                            h-full
                            object-contain
                            p-2
                        ">

                </div>

            </div>

            <!-- IZQUIERDA -->

            <button v-if="
                index > 0
            " @click.stop="prev" class="
                    absolute

                    left-3
                    top-1/2

                    -translate-y-1/2

                    w-10
                    h-10

                    rounded-full

                    bg-black/40

                    text-white
                ">

                <i class="fa fa-chevron-left"></i>

            </button>

            <!-- DERECHA -->

            <button v-if="
                index < imagenes.length - 1
            " @click.stop="next" class="
                    absolute

                    right-3
                    top-1/2

                    -translate-y-1/2

                    w-10
                    h-10

                    rounded-full

                    bg-black/40

                    text-white
                ">

                <i class="fa fa-chevron-right"></i>

            </button>

            <!-- DOTS -->

            <div class="
                    absolute

                    bottom-3
                    left-0

                    w-full

                    flex
                    justify-center

                    gap-2
                ">

                <div v-for="(img, i) in imagenes" :key="i" class="
                        w-2.5
                        h-2.5

                        rounded-full

                        transition-all
                    " :class="i === index

                        ?

                        'bg-white'

                        :

                        'bg-white/40'

                        ">
                </div>

            </div>

        </div>

    </div>

    <StoryViewer v-model="storyVisible" :imagenes="imagenes" />

</template>

<script setup>

import {

    computed,
    ref,
    watch,
    onUnmounted

}
    from 'vue'

import StoryViewer
    from '../../../../../components/StoryViewer.vue'

const props =
    defineProps({

        producto: Object

    })

const index =
    ref(0)

const storyVisible =
    ref(false)

let interval =
    null

/* =====================================
   IMAGENES
===================================== */

const imagenes =
    computed(() => {

        const lista =

            props.producto
                ?.imagenes

            ||

            []

        const salida =

            lista

                .map(

                    x => x.img

                )

                .filter(Boolean)

        if (

            salida.length

        ) {

            return salida

        }

        return [

            'https://picsum.photos/600/400?random=55'

        ]

    })

/* =====================================
   AUTOPLAY
===================================== */

function startTimer() {

    stopTimer()

    interval =

        setInterval(

            () => {

                next()

            },

            3000

        )

}

function stopTimer() {

    if (

        interval

    ) {

        clearInterval(
            interval
        )

        interval = null

    }

}

/* =====================================
   NEXT
===================================== */

function next() {

    if (

        index.value

        <

        imagenes.value.length - 1

    ) {

        index.value++

    }
    else {

        index.value = 0

    }

}

/* =====================================
   PREV
===================================== */

function prev() {

    if (

        index.value > 0

    ) {

        index.value--

    }
    else {

        index.value =

            imagenes.value.length - 1

    }

}

/* =====================================
   STORY
===================================== */

function abrirStory() {

    storyVisible.value =
        true

}

/* =====================================
   TOUCH
===================================== */

let touchStartX = 0

function startTouch(e) {

    touchStartX =

        e.changedTouches[0]
            .clientX

}

function endTouch(e) {

    const diff =

        e.changedTouches[0]
            .clientX

        -

        touchStartX

    if (

        diff > 60

    ) {

        prev()

    }

    if (

        diff < -60

    ) {

        next()

    }

}

/* =====================================
   MOUSE DRAG
===================================== */

let dragging = false
let dragStartX = 0

function startDrag(e) {

    dragging = true

    dragStartX =
        e.clientX

}

function onDrag(e) {

    if (

        !dragging

    ) {

        return

    }

    const diff =

        e.clientX

        -

        dragStartX

    if (

        diff > 80

    ) {

        prev()

        stopDrag()

    }

    if (

        diff < -80

    ) {

        next()

        stopDrag()

    }

}

function stopDrag() {

    dragging = false

}

/* =====================================
   WATCH
===================================== */

watch(

    imagenes,

    () => {

        index.value = 0

        startTimer()

    },

    {

        immediate: true

    }

)

onUnmounted(

    stopTimer

)

</script>
