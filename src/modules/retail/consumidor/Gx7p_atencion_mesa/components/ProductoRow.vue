<template>

    <div class="
            relative
            overflow-hidden
            rounded-2xl
        ">

        <!-- ACTIONS RIGHT -->
        <div class="
                absolute
                inset-y-0
                right-0
                flex
                items-center
                gap-2
                px-3
                bg-gradient-to-l
                from-gray-100
                to-gray-50
            ">

            <!-- EDIT -->
            <button class="
                    w-10
                    h-10
                    rounded-full
                    bg-green-500
                    flex
                    items-center
                    justify-center
                    active:scale-95
                    transition
                    shadow-sm
                " @click.stop="$emit('edit', item)">

                <i class="
                        fa
                        fa-pencil
                        text-white
                        text-sm
                    "></i>

            </button>

            <!-- DELETE -->
            <!-- BOTON DELETE -->
            <!-- ASEGURATE QUE ESTE ASI -->

            <!-- BOTON DELETE -->
            <!-- ASEGURATE QUE ESTE ASI -->

            <button class="
        w-10
        h-10
        rounded-full
        bg-red-500
        flex
        items-center
        justify-center
        active:scale-95
        transition
        shadow-sm
    " @click.stop="$emit('delete', item)">

                <i class="
                        fa
                        fa-trash
                        text-white
                        text-sm
                    "></i>

            </button>

        </div>

        <!-- CARD -->
        <!-- EN EL MISMO ARCHIVO -->
        <!-- REEMPLAZA SOLO EL DIV ref="card" -->

        <div ref="card" class="
        relative
        z-10
        bg-white
        rounded-2xl
        border
        border-gray-100
        p-3
        flex
        items-center
        gap-3
        shadow-sm
        touch-pan-y
        select-none
        cursor-grab
        active:cursor-grabbing
    " @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @mousedown="onMouseDown"
            @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseLeave">

            <!-- IMG -->
            <img :src="item.img
                ||
                'https://picsum.photos/100'
                " class="
                    w-16
                    h-16
                    rounded-2xl
                    object-cover
                    border
                    shadow-sm
                    shrink-0
                " />

            <!-- INFO -->
            <div class="
                    flex-1
                    min-w-0
                ">

                <!-- NAME -->
                <div class="
                        text-sm
                        text-gray-700
                        line-clamp-2
                    ">

                    {{ item.nombre }}

                </div>

                <!-- META -->
                <div class="
                        mt-2
                        flex
                        items-center
                        gap-2
                        flex-wrap
                    ">

                    <!-- CANTIDAD -->
                    <div class="
                            px-2
                            py-1
                            rounded-full
                            bg-orange-100
                            text-orange-700
                            text-[11px]
                            font-semibold
                        ">

                        x{{ item.cantidad }}

                    </div>

                    <!-- PRECIO -->
                    <div class="
                            text-xs
                            text-gray-400
                        ">

                        S/{{
                            Number(
                                item.precio
                            ).toFixed(2)
                        }}

                    </div>

                    <!-- TOTAL -->
                    <div class="
                            text-xs
                            font-semibold
                            text-gray-700
                        ">

                        S/{{
                            (
                                item.cantidad
                                *
                                item.precio
                            ).toFixed(2)
                        }}

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>
<!-- REEMPLAZA TODO EL SCRIPT -->

<script setup>

import {
    ref
}
    from 'vue'

import gsap
    from 'gsap'

const props =
    defineProps({

        item:
            Object

    })

defineEmits([
    'edit',
    'delete'
])

const card =
    ref(null)

let startX = 0
let currentX = 0
let isDragging = false

/* ======================================
   🔥 START
====================================== */

function start(clientX) {

    isDragging = true

    startX = clientX

}

/* ======================================
   🔥 MOVE
====================================== */

function move(clientX) {

    if (!isDragging)
        return

    currentX = clientX

    let diff =
        currentX - startX

    /* ======================================
       SOLO IZQUIERDA
    ====================================== */

    if (diff > 0) {

        diff = 0

    }

    if (diff < -120) {

        diff = -120

    }

    gsap.set(

        card.value,

        {

            x: diff

        }

    )

}

/* ======================================
   🔥 END
====================================== */

function end() {

    if (!isDragging)
        return

    isDragging = false

    const diff =
        currentX - startX

    /* ======================================
       ABRIR
    ====================================== */

    if (diff < -60) {

        gsap.to(

            card.value,

            {

                x: -110,

                duration: 0.2,

                ease: 'power2.out'

            }

        )

    }

    /* ======================================
       CERRAR
    ====================================== */

    else {

        gsap.to(

            card.value,

            {

                x: 0,

                duration: 0.2,

                ease: 'power2.out'

            }

        )

    }

}

/* ======================================
   🔥 TOUCH EVENTS
====================================== */

function onTouchStart(e) {

    start(
        e.touches[0].clientX
    )

}

function onTouchMove(e) {

    move(
        e.touches[0].clientX
    )

}

function onTouchEnd() {

    end()

}

/* ======================================
   🔥 MOUSE EVENTS
====================================== */

function onMouseDown(e) {

    start(
        e.clientX
    )

}

function onMouseMove(e) {

    if (!isDragging)
        return

    move(
        e.clientX
    )

}

function onMouseUp() {

    end()

}

function onMouseLeave() {

    end()

}

</script>