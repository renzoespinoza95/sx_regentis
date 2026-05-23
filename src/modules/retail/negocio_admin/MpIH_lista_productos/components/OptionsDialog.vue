<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-xl p-5 w-72 space-y-3">

            <!-- NUEVO -->
            <!-- =========================================
🔥 NUEVA CATEGORIA
========================================= -->

            <button class="
        w-full
        text-left
        px-3
        py-2
        rounded-lg
        hover:bg-gray-100
        transition
        flex
        items-center
        gap-2
    " @click="abrirNuevaCategoria">

                <i class="
            fa
            fa-folder-open
            text-orange-500
        ">
                </i>

                <span>

                    Nueva categoría

                </span>

            </button>

            <!-- =========================================
🔥 MIS CATEGORIAS
========================================= -->

            <button class="
    w-full
    text-left
    px-3
    py-2
    rounded-lg
    hover:bg-gray-100
    transition
    flex
    items-center
    gap-2
" @click="abrirMisCategorias">

                <i class="
        fa
        fa-tags
        text-green-500
    ">
                </i>

                <span>

                    Mis categorías

                </span>

            </button>

            <!-- CERRAR -->
            <button class="w-full text-white py-2 rounded-md bg-red-500 mt-2" @click="close">

                Cerrar

            </button>

        </div>

    </div>

</template>

<script setup>

import {
    ref,
    nextTick
} from 'vue'

import gsap from 'gsap'

const visible = ref(false)

const box = ref(null)

/* ======================================
🔥 EMITS
====================================== */

const emit =
    defineEmits([

        'categoria-created',

        'mis-categorias'

    ])

/* ======================================
   🔥 OPEN
====================================== */

function open() {

    visible.value = true

    nextTick(() => {

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

    })

}

/* ======================================
🔥 NUEVA CATEGORIA
====================================== */

function abrirNuevaCategoria() {

    close()

    emit(
        'categoria-created'
    )

}

/* ======================================
🔥 MIS CATEGORIAS
====================================== */

function abrirMisCategorias() {

    close()

    emit(
        'mis-categorias'
    )

}

/* ======================================
   🔥 CLOSE
====================================== */

function close() {

    gsap.to(box.value, {

        scale: 0.7,

        opacity: 0,

        duration: 0.2,

        onComplete: () => {

            visible.value = false

        }

    })

}

defineExpose({
    open
})

</script>
