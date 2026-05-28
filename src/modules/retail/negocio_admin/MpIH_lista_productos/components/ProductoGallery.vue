<template>

    <div>

        <!-- EMPTY -->
        <div v-if="!localImagenes.length" class="
                h-32

                rounded-3xl

                bg-[#fff4ee]

                flex
                items-center
                justify-center

                text-gray-400

                text-sm
            ">

            Sin imágenes 😢

        </div>

        <!-- GRID -->
        <div v-else class="
                grid
                grid-cols-4
                gap-2
            ">

            <div v-for="(img, index) in localImagenes" :key="img.product_image_id" class="
                    relative

                    rounded-2xl

                    overflow-hidden

                    bg-[#fff4ee]

                    aspect-[3/4]

                    shadow-[0_4px_12px_rgba(0,0,0,0.08)]

                    group

                    select-none
                    cursor-grab
                    active:cursor-grabbing

                    transition
                " draggable="true" @dragstart="onDragStart(index)" @dragover.prevent @drop="onDrop(index)"
                @touchstart="onTouchStart($event, index)" @touchmove="onTouchMove($event)" @touchend="onTouchEnd">

                <!-- DELETE -->
                <button class="
                        absolute
                        top-1
                        right-1

                        z-20

                        w-7
                        h-7

                        rounded-full

                        bg-red-500

                        text-white

                        flex
                        items-center
                        justify-center

                        shadow-lg

                        active:scale-90
                        transition
                    " @click.stop="confirmarEliminar(img)">

                    <i class="fa fa-times text-[11px]"></i>

                </button>

                <!-- IMAGE -->
                <img :src="img.img" class="
                        w-full
                        h-full

                        object-cover

                        transition

                        group-hover:scale-105
                    ">

                <!-- PRINCIPAL -->
                <div v-if="Number(img.orden) === 1" class="
                        absolute

                        top-1
                        left-1

                        px-2
                        py-1

                        rounded-full

                        bg-[#FD7635]

                        text-white

                        text-[10px]

                        font-bold

                        shadow-lg
                    ">

                    Principal

                </div>

                <!-- ORDEN -->
                <div class="
                        absolute

                        bottom-1
                        left-1

                        w-6
                        h-6

                        rounded-full

                        bg-black/60

                        text-white

                        text-[11px]
                        font-bold

                        flex
                        items-center
                        justify-center
                    ">

                    {{ img.orden }}

                </div>

            </div>

        </div>

    </div>

    <AppSnackbar ref="snackbarRef" />

</template>

<script setup>

import {
    ref,
    watch
}
    from 'vue'

import axios
    from 'axios'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'

import {
    firma
}
    from '../../../../../services/security'

const props = defineProps({

    imagenes: {

        type: Array,

        default: () => []

    }

})

const emit =
    defineEmits([

        'updated',

        'deleted'

    ])

const snackbarRef =
    ref(null)

const localImagenes =
    ref([])

/* =========================================
🔥 SYNC
========================================= */

watch(

    () => props.imagenes,

    (val) => {

        localImagenes.value =

            [...(val || [])]

                .sort((a, b) => {

                    return Number(a.orden) - Number(b.orden)

                })

    },

    {

        immediate: true,
        deep: true

    }

)

/* =========================================
🔥 DRAG
========================================= */

const dragIndex =
    ref(null)

function onDragStart(index) {

    dragIndex.value =
        index

}

async function onDrop(dropIndex) {

    if (

        dragIndex.value === null

        ||

        dragIndex.value === dropIndex

    ) {
        return
    }

    moverImagen(

        dragIndex.value,

        dropIndex

    )

    dragIndex.value = null

}

/* =========================================
🔥 TOUCH
========================================= */

const touchIndex =
    ref(null)

let touchStartX = 0

function onTouchStart(e, index) {

    touchIndex.value =
        index

    touchStartX =
        e.touches[0].clientX

}

function onTouchMove() {

}

async function onTouchEnd(e) {

    if (touchIndex.value === null) {
        return
    }

    const touchEndX =
        e.changedTouches[0].clientX

    const diff =
        touchEndX - touchStartX

    /* =========================================
       🔥 DERECHA
    ========================================= */

    if (diff > 50) {

        const nuevoIndex =
            touchIndex.value - 1

        if (nuevoIndex >= 0) {

            moverImagen(

                touchIndex.value,

                nuevoIndex

            )

        }

    }

    /* =========================================
       🔥 IZQUIERDA
    ========================================= */

    if (diff < -50) {

        const nuevoIndex =
            touchIndex.value + 1

        if (

            nuevoIndex

            <

            localImagenes.value.length

        ) {

            moverImagen(

                touchIndex.value,

                nuevoIndex

            )

        }

    }

    touchIndex.value =
        null

}

/* =========================================
🔥 MOVER
========================================= */

async function moverImagen(from, to) {

    const lista =
        [...localImagenes.value]

    const movido =
        lista.splice(from, 1)[0]

    lista.splice(to, 0, movido)

    /* =========================================
       🔥 REORDENAR
    ========================================= */

    lista.forEach((x, i) => {

        x.orden = i + 1

    })

    localImagenes.value =
        lista

    emit(
        'updated',
        lista
    )

    await guardarOrden()

}

/* =========================================
🔥 GUARDAR ORDEN
========================================= */

async function guardarOrden() {

    try {

        const seguridad =
            firma()

        await axios.post(

            '/QVhq/ordenarFotoProducto',

            {

                lista:

                    localImagenes.value.map(x => ({

                        product_image_id:
                            x.product_image_id,

                        orden:
                            x.orden

                    })),

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

    } catch (e) {

        console.error(e)

    }

}

/* =========================================
🔥 ELIMINAR
========================================= */

function confirmarEliminar(img) {

    snackbarRef.value?.open(

        '¿Eliminar esta foto? 🗑️',

        () => {

            eliminarFoto(img)

        }

    )

}

async function eliminarFoto(img) {

    try {

        const seguridad =
            firma()

        const r =
            await axios.post(

                '/CK2f/eliminarFotoProducto',

                {

                    product_image_id:
                        img.product_image_id,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (

            r.data?.res === 'ok'

        ) {

            localImagenes.value =

                localImagenes.value.filter(

                    x =>

                        Number(
                            x.product_image_id
                        )

                        !==

                        Number(
                            img.product_image_id
                        )

                )

            /* =========================================
               🔥 REORDENAR
            ========================================= */

            localImagenes.value.forEach((x, i) => {

                x.orden = i + 1

            })

            await guardarOrden()

            emit(
                'deleted',
                img
            )

        }

    } catch (e) {

        console.error(e)

    }

}

</script>