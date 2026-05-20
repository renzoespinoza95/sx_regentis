<template>

    <div class="relative overflow-hidden rounded-2xl select-none">

        <!-- =========================================
        🔥 ACTIONS
        ========================================= -->

        <div class="absolute inset-y-0 right-0 flex items-center">

            <!-- EDIT -->
            <button @click.stop="openCantidadDialog"
                class="w-16 h-full bg-blue-500 text-white flex items-center justify-center">

                <i class="fa fa-pencil text-xl"></i>

            </button>

            <!-- DELETE -->
            <button @click.stop="confirmarEliminar"
                class="w-16 h-full bg-red-500 text-white flex items-center justify-center rounded-r-2xl">

                <i class="fa fa-times text-2xl"></i>

            </button>

        </div>

        <!-- =========================================
        🔥 CARD
        ========================================= -->

        <div ref="cardRef"
            class="relative bg-gray-50 rounded-2xl px-3 py-3 flex items-center gap-3 text-sm transition-transform duration-200 shadow-sm cursor-grab active:cursor-grabbing"
            :style="{
                transform:
                    abierto
                        ? 'translateX(-128px)'
                        : 'translateX(0px)'
            }" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @mousedown="mouseDown"
            @mousemove="mouseMove" @mouseup="mouseUp" @mouseleave="mouseUp">

            <!-- 🔥 IMAGEN -->
            <img :src="item.img || 'https://picsum.photos/60'"
                class="w-12 h-12 rounded-xl object-cover pointer-events-none" />

            <!-- 🔥 INFO -->
            <div class="flex-1 flex flex-col min-w-0 pointer-events-none">

                <!-- NOMBRE -->
                <div class="text-gray-800 font-medium truncate">

                    {{ item.name }}

                </div>

                <!-- EXTRA -->
                <div class="flex items-center gap-2 mt-1 text-xs">

                    <!-- PRECIO -->
                    <span class="text-gray-500">

                        S/
                        {{
                            Number(
                                item.precio_unitario || 0
                            ).toFixed(2)
                        }}

                    </span>

                    <!-- CANTIDAD -->
                    <span class="text-blue-600 font-semibold">

                        x{{ item.cantidad }}
                        {{ item.unidad }}

                    </span>

                </div>

            </div>

            <!-- 🔥 TOTAL -->
            <div class="text-gray-800 font-semibold shrink-0 pointer-events-none">

                S/
                {{
                    total.toFixed(2)
                }}

            </div>

        </div>

    </div>

    <!-- =========================================
🔥 SNACKBAR
========================================= -->

    <AppSnackbar ref="snackbarRef" />

    <CantidadProductoDialog ref="cantidadDialogRef" @confirm="confirmCantidad" />

</template>

<script setup>

import {
    ref,
    computed
}
    from 'vue'
import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'
import CantidadProductoDialog
    from '../../../../../components/layout/CantidadProductoDialog.vue'


/* =========================================
🔥 PROPS
========================================= */

const props =
    defineProps({

        item: Object

    })

/* =========================================
🔥 SNACKBAR
========================================= */

const snackbarRef =
    ref(null)
/* =========================================
🔥 EMITS
========================================= */

const emit =
    defineEmits([

        'delete',
        'update'

    ])

/* =========================================
🔥 TOTAL
========================================= */

const total =
    computed(() => {

        return (

            Number(
                props.item.precio_unitario || 0
            )

            *

            Number(
                props.item.cantidad || 0
            )

        )

    })

/* =========================================
🔥 SWIPE
========================================= */

const abierto =
    ref(false)

const startX =
    ref(0)

const deltaX =
    ref(0)

const dragging =
    ref(false)

/* =========================================
📱 TOUCH
========================================= */

function touchStart(e) {

    dragging.value = true

    startX.value =
        e.changedTouches[0].clientX

    deltaX.value = 0

}

function touchMove(e) {

    if (!dragging.value)
        return

    deltaX.value =
        e.changedTouches[0].clientX
        -
        startX.value

}

function touchEnd() {

    finishSwipe()

}

/* =========================================
🖱️ MOUSE
========================================= */

function mouseDown(e) {

    dragging.value = true

    startX.value =
        e.clientX

    deltaX.value = 0

}

function mouseMove(e) {

    if (!dragging.value)
        return

    deltaX.value =
        e.clientX
        -
        startX.value

}

function mouseUp() {

    if (!dragging.value)
        return

    finishSwipe()

}

/* =========================================
🔥 FINISH
========================================= */

function finishSwipe() {

    dragging.value = false

    /* 👉 ABRIR */
    if (deltaX.value < -50) {

        abierto.value = true

        return

    }

    /* 👈 CERRAR */
    if (deltaX.value > 40) {

        abierto.value = false

    }

}

/* =========================================
📦 DIALOG
========================================= */

const cantidadDialogRef =
    ref(null)

function openCantidadDialog() {

    cantidadDialogRef.value?.open({

        ...props.item,

        precio:
            props.item.precio_unitario

    })

}

/* =========================================
🗑️ CONFIRMAR ELIMINAR
========================================= */

function confirmarEliminar() {

    snackbarRef.value?.open(

        '¿Eliminar producto?',

        () => {

            emit(
                'delete',
                props.item
            )

        }

    )

}

</script>