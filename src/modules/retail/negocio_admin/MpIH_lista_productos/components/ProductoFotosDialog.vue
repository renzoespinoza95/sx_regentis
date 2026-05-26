<template>

    <div v-if="visible" class="
            fixed
            inset-0
            z-[9999]

            bg-black/50
            backdrop-blur-sm

            flex
            items-center
            justify-center

            p-4
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
                    p-5
                    space-y-4

                    max-h-[70vh]
                    overflow-y-auto
                ">

                <!-- GALERIA -->
                <ProductoGallery :imagenes="producto?.imagenes || []
                    " />

                <!-- UPLOADER -->
                <ProductoUploader :producto="producto" @uploaded="
                    onUploaded
                " />

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


const emit =
    defineEmits([

        'uploaded'

    ])

const visible =
    ref(false)

const producto =
    ref(null)

const box =
    ref(null)



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

defineExpose({

    open

})

</script>
