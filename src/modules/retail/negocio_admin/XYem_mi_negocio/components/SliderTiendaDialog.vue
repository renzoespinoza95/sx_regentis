<template>

    <div v-if="visible" class="
        fixed
        inset-0

        bg-black/40

        flex
        items-center
        justify-center

        z-50
    ">

        <div ref="box" class="
                bg-white

                rounded-[32px]

                w-full
                max-w-md

                overflow-hidden

                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            ">

            <div class="
                    relative

                    px-5
                    pt-5
                    pb-4

                    text-white
                " style="
                    background:
                    linear-gradient(
                        135deg,
                        #FD7635 0%,
                        #ff995e 100
                    );
                ">

                <button class="
        absolute
        top-4
        right-4
        z-30

        w-8
        h-8

        rounded-full

        bg-red-500

        text-white
        text-sm
        font-bold

        flex
        items-center
        justify-center

        shadow-md
        active:scale-90
        transition
    " @click="close">

                    ✕

                </button>

                <div class="
                        text-2xl
                        font-black
                    ">

                    {{ producto?.name }}

                </div>

                <div class="
                        text-sm
                        opacity-90
                        mt-1
                    ">

                    Slider de la tienda

                </div>

            </div>

            <div class="
        flex

        max-h-[70vh]

        overflow-hidden
    ">

                <div class="
            w-16

            shrink-0

            bg-[#fff5ef]

            border-r

            border-orange-200

            flex

            items-center

            justify-center
        " @touchstart="scrollStart" @touchmove.prevent="scrollMove" @touchend="scrollEnd">

                    <div class="
                text-[11px]

                font-black

                tracking-widest

                text-orange-500

                select-none

                rotate-180

                [writing-mode:vertical-rl]
            ">

                        DELIZAR POR ESTE LADO

                    </div>

                </div>

                <div ref="scrollRef" class="
        flex-1

        p-5

        space-y-4

        overflow-y-auto
    ">

                    <SliderGallery :imagenes="producto?.imagenes || []" @updated="onGalleryUpdated"
                        @deleted="onGalleryDeleted" />

                    <SliderUploader :producto="producto" @uploaded="onUploaded" />

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import {

    ref,
    nextTick,
    watch,
    onUnmounted

}
    from 'vue'

import gsap
    from 'gsap'

import SliderGallery
    from './SliderGallery.vue'

import SliderUploader
    from './SliderUploader.vue'

import {

    bus,
    hideBottomNav,
    showBottomNav

}
    from '../../../../../services/eventBus.js'

const scrollRef =
    ref(null)

let startY = 0

let startScroll = 0


const emit = defineEmits([

    'uploaded',

    'deleted'

])

const visible =
    ref(false)

const producto =
    ref(null)

const box =
    ref(null)

/* =========================================
🔥 SCROLL TOUCH
========================================= */

function scrollStart(e) {

    startY =

        e.touches[0].clientY

    startScroll =

        scrollRef.value.scrollTop

}

function scrollMove(e) {

    if (

        !scrollRef.value

    ) {

        return

    }

    const delta =

        e.touches[0].clientY

        -

        startY

    scrollRef.value.scrollTop =

        startScroll

        -

        delta

}

function scrollEnd() {

}

/* =========================================
🔥 UPLOADED
========================================= */

function onUploaded(data) {

    // Agregar la nueva imagen directamente al estado local para actualizar la galería de inmediato
    if (producto.value) {
        if (!producto.value.imagenes) {
            producto.value.imagenes = []
        }
        producto.value.imagenes.push(data)
    }

    emit(

        'uploaded',

        data

    )

}

/* =========================================
🔥 OPEN (CORREGIDO)
========================================= */
async function open(item) {

    // 🔴 CRITICAL FIX: Debes colocar los paréntesis () para ejecutar la función
    hideBottomNav();

    producto.value = item;
    visible.value = true;

    await nextTick();

    gsap.fromTo(
        box.value,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
}

/* =========================================
🔥 CLOSE (CORREGIDO)
========================================= */
function close() {

    gsap.to(
        box.value,
        {
            scale: 0.7,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                visible.value = false;

                // 🔴 CRITICAL FIX: Debes colocar los paréntesis () para ejecutar la función
                showBottomNav();
            }
        }
    );
}

/* =========================================
🔥 GALLERY UPDATED
========================================= */

function onGalleryUpdated(lista) {

    if (!producto.value) {
        return
    }

    producto.value.imagenes =
        [...lista]

}

/* =========================================
🔥 GALLERY DELETED
========================================= */

function onGalleryDeleted(lista) {

    if (

        !producto.value

    ) {

        return

    }

    producto.value.imagenes =

        [

            ...lista

        ]

    emit(

        'deleted',

        {

            neg_id:

                producto.value.neg_id,

            imagenes:

                [

                    ...producto.value.imagenes

                ]

        }

    )

}

function agregarImagen(imagen) {

    if (

        !producto.value

    ) {

        return

    }

    producto.value.imagenes = [

        imagen,

        ...(producto.value.imagenes || [])

    ]

}

function eliminarImagenes(lista) {

    if (

        !producto.value

    ) {

        return

    }

    producto.value.imagenes = [

        ...lista

    ]

}

defineExpose({

    open,

    agregarImagen,

    eliminarImagenes

})

</script>