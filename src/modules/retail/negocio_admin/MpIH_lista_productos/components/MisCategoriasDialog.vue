<template>

    <div v-if="visible" class="
        fixed
        inset-0
        z-[999]
        bg-black/40
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
                px-5
                pt-5
                pb-4
                text-white
                flex
                items-center
                justify-between
            " style="
                background:
                linear-gradient(
                    135deg,
                    #FD7635 0%,
                    #ff995e 100%
                );
            ">

                <div class="
                    text-2xl
                    font-black
                ">

                    Mis categorías

                </div>

                <button class="
                        w-10
                        h-10
                        rounded-full
                        bg-white/20
                        text-white
                    " @click="close">

                    <i class="fa fa-times"></i>

                </button>

            </div>

            <!-- BODY -->
            <div class="
                p-4
                max-h-[70vh]
                overflow-y-auto
                space-y-3
            ">

                <div v-for="c in categorias" :key="c.category_id" class="
                        relative
                        overflow-hidden
                        rounded-2xl
                    ">

                    <!-- ACTIONS -->
                    <!-- ACTIONS -->
                    <div class="
    absolute
    right-0
    top-0
    h-full
    flex
">

                        <!-- EDIT -->
                        <button class="
            w-16
            bg-green-500
            text-white
            flex
            items-center
            justify-center
        " @click="editarCategoria(c)">

                            <i class="fa fa-pencil"></i>

                        </button>

                        <!-- OJITO -->
                        <button class="
            w-16
            text-white
            flex
            items-center
            justify-center
        " :class="Number(c.is_activo) === 1

            ?

            'bg-blue-500'

            :

            'bg-gray-500'
            " @click="confirmarVisible(c)">

                            <i class="fa" :class="Number(c.is_activo) === 1

                                ?

                                'fa-eye'

                                :

                                'fa-eye-slash'
                                ">
                            </i>

                        </button>

                        <!-- DELETE -->
                        <button class="
            w-16
            bg-red-500
            text-white
            flex
            items-center
            justify-center
        " @click="confirmarEliminar(c)">

                            <i class="fa fa-trash"></i>

                        </button>

                    </div>

                    <!-- ITEM -->
                    <div class="
        relative
        z-10
        bg-[#fff4ee]
        rounded-2xl
        px-4
        py-4
        flex
        items-center
        gap-3
        transition
        select-none
        cursor-grab
        active:cursor-grabbing
    " @touchstart="startTouch($event)" @touchmove="moveTouch($event, c)" @touchend="endTouch"
                        @mousedown="startTouch($event)" @mousemove="moveTouch($event, c)" @mouseup="endTouch"
                        @mouseleave="endTouch" :style="{
                            transform:
                                c.open
                                    ? 'translateX(-192px)'
                                    : 'translateX(0px)'
                        }">

                        <div class="text-2xl">

                            {{

                                Number(
                                    c.is_activo
                                ) === 0

                                    ?

                                    '🚫'

                                    :

                                    (c.icon || '📦')

                            }}

                        </div>

                        <div class="
                            font-semibold
                            text-gray-700
                        ">

                            {{ c.descripcion }}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

    <AppSnackbar ref="snackbarRef" />

</template>

<script setup>

import {
    ref,
    nextTick
}
    from 'vue'

import axios
    from 'axios'

import gsap
    from 'gsap'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'

import {
    firma
}
    from '../../../../../services/security'

import {
    hideBottomNav,
    showBottomNav
}
    from '../../../../../services/eventBus.js'

const emit =
    defineEmits([

        'edit',

        'deleted'

    ])

const visible =
    ref(false)

const box =
    ref(null)

const categorias =
    ref([])

const snackbarRef =
    ref(null)

let startX = 0
let isMouseDown = false

/* =========================================
🔥 OPEN
========================================= */

async function open(data = []) {

    hideBottomNav()

    categorias.value =

        data.map(c => ({

            ...c,

            open: false

        }))

    visible.value = true

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
            duration: 0.25,
            ease: 'power2.out'
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

                visible.value = false

                showBottomNav()

            }

        }

    )

}

/* =========================================
🔥 TOUCH / MOUSE START
========================================= */

function startTouch(e) {

    isMouseDown = true

    startX =

        e.touches

            ?

            e.touches[0].clientX

            :

            e.clientX

}

/* =========================================
🔥 TOUCH / MOUSE MOVE
========================================= */

function moveTouch(e, item) {

    if (!isMouseDown) {
        return
    }

    const currentX =

        e.touches

            ?

            e.touches[0].clientX

            :

            e.clientX

    const diff =
        startX - currentX

    /* =========================================
       🔥 ABRIR
    ========================================= */

    if (diff > 40) {

        categorias.value.forEach(c => {

            c.open = false

        })

        item.open = true

    }

    /* =========================================
       🔥 CERRAR
    ========================================= */

    if (diff < -40) {

        item.open = false

    }

}

/* =========================================
🔥 CONFIRMAR VISIBLE
========================================= */

function confirmarVisible(categoria) {

    snackbarRef.value?.open(

        Number(
            categoria.is_activo
        ) === 1

            ?

            '¿Ocultar esta categoría? 👁️'

            :

            '¿Mostrar esta categoría? 👁️',

        () => {

            toggleVisible(
                categoria
            )

        }

    )

}

/* =========================================
🔥 TOGGLE VISIBLE
========================================= */

async function toggleVisible(categoria) {

    try {

        const seguridad =
            firma()

        const res =
            await axios.post(

                '/KgOS/ocultarCategoria',

                {

                    category_id:
                        categoria.category_id,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (

            res.data?.status === 'ok'

        ) {

            categoria.is_activo =

                Number(
                    res.data.is_activo
                )

            emit(
                'deleted'
            )

        }

    } catch (e) {

        console.error(e)

    }

}

/* =========================================
🔥 END
========================================= */

function endTouch() {

    isMouseDown = false

}
/* =========================================
🔥 ELIMINAR
========================================= */

function confirmarEliminar(categoria) {

    snackbarRef.value?.open(

        '¿Eliminar categoría y todos sus productos? 🗑️',

        () => {

            eliminarCategoria(
                categoria
            )

        }

    )

}

async function eliminarCategoria(categoria) {

    try {

        const seguridad =
            firma()

        await axios.post(

            '/IlY2/eliminarCategoria',

            {

                category_id:
                    categoria.category_id,

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

        emit(
            'deleted'
        )

    } catch (e) {

        console.error(e)

    }

}

/* =========================================
🔥 EDITAR
========================================= */

function editarCategoria(categoria) {

    emit(
        'edit',
        categoria
    )

}

defineExpose({

    open,

    close

})

</script>
