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

            <!-- HEADER -->
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
                        #ff995e 100%
                    );
                ">

                <!-- CLOSE -->
                <button class="
                        absolute
                        top-4
                        right-4

                        w-10
                        h-10

                        rounded-full

                        bg-white/20

                        text-white

                        active:scale-95
                    " @click="close">

                    <i class="fa fa-times"></i>

                </button>

                <!-- TITULO -->
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

                    Fotos del producto

                </div>

            </div>

            <!-- BODY -->
            <div class="
        flex

        max-h-[70vh]

        overflow-hidden
    ">

                <!-- BANDA IZQUIERDA -->
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

                <!-- CONTENIDO -->
                <div ref="scrollRef" class="
        flex-1

        p-5

        space-y-4

        overflow-y-auto
    ">

                    <ProductoGallery :imagenes="producto?.imagenes || []" @updated="onGalleryUpdated"
                        @deleted="onGalleryDeleted" />

                    <ProductoUploader :producto="producto" @uploaded="onUploaded" />

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

import ProductoGallery
    from './ProductoGallery.vue'

import ProductoUploader
    from './ProductoUploader.vue'

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

    emit(

        'uploaded',

        data

    )

}

/* =========================================
🔥 OPEN
========================================= */

/* =========================================
🔥 OPEN
========================================= */

async function open(item) {

    hideBottomNav()

    producto.value =
        item

    visible.value =
        true

    await nextTick()

    gsap.fromTo(

        box.value,

        {

            scale: 0.7,
            opacity: 0

        },

        {

            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'

        }

    )

}

/* =========================================
🔥 CLOSE
========================================= */

function close() {

    gsap.to(

        box.value,

        {

            scale: 0.7,

            opacity: 0,

            duration: 0.2,

            onComplete: () => {

                visible.value =
                    false

                showBottomNav()

            }

        }

    )

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

            product_id:

                producto.value.product_id,

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
