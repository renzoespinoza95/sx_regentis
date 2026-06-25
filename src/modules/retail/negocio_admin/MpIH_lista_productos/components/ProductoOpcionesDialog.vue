<template>

    <div v-if="visible" class="
            fixed
            inset-0

            bg-black/40

            flex
            items-center
            justify-center

            z-[999]
        ">

        <div ref="box" class="
                bg-white

                rounded-3xl

                p-5

                w-[320px]

                space-y-3
            ">

            <!-- TITULO -->
            <div class="
                    text-lg
                    font-bold
                    text-gray-800
                    mb-2
                ">

                {{ producto?.name }}

            </div>

            <!-- STOCK -->
            <button class="item-btn" @click="abrirStock">

                📦 Aumentar stock

            </button>

            <!-- OCULTAR -->
            <button class="item-btn" @click="confirmarOcultar">

                👁️ Ocultar

            </button>

            <!-- EDITAR -->
            <button class="item-btn" @click="editarProducto">

                ✏️ Editar

            </button>

            <!-- FOTO -->
            <button class="item-btn" @click="abrirFotos">

                🖼️ Foto

            </button>

            <!-- ELIMINAR -->
            <!-- ELIMINAR -->
            <button class="
    item-btn
    text-red-500
" @click="confirmarEliminar">

                🗑️ Eliminar

            </button>

            <button class="item-btn" @click="
                emit(
                    'calculadora',
                    producto
                )
                ">

                🧮 Mayorista

            </button>

            <!-- CERRAR -->
            <button class="
                    w-full
                    h-[48px]

                    rounded-2xl

                    bg-red-500

                    text-white

                    font-semibold
                " @click="close">

                Cerrar

            </button>

        </div>

    </div>

    <!-- 🔥 STOCK -->
    <CantidadProductoDialog ref="cantidadRef" boton-texto="Guardar stock" :mostrar-precios="false"
        @confirm="guardarStock" />
    <AppSnackbar ref="snackbarRef" />
    <GsapToast ref="toastRef" />
</template>

<script setup>

import {
    ref,
    nextTick
}
    from 'vue'

import GsapToast
    from '../../../../../components/layout/GsapToast.vue'

import gsap
    from 'gsap'

import axios
    from 'axios'

import {
    firma
}
    from '../../../../../services/security'

import {

    hideBottomNav,
    showBottomNav

}
    from '../../../../../services/eventBus.js'

import CantidadProductoDialog
    from '../../../../../components/layout/CantidadProductoDialog.vue'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'

const visible =
    ref(false)

const producto =
    ref(null)

const box =
    ref(null)

const cantidadRef =
    ref(null)

const emit =
    defineEmits([

        'stock-updated',

        'visible-updated',

        'deleted',

        'calculadora',

        'edit',

        'foto'

    ])

const toastRef =
    ref(null)

const snackbarRef =
    ref(null)

/* =========================================
🔥 OPEN
========================================= */

function open(item) {

    /* =========================================
    🔥 HIDE BOTTOMNAV
    ========================================= */

    hideBottomNav()

    producto.value =
        item

    visible.value =
        true

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

/* =========================================
✏️ EDITAR
========================================= */

function editarProducto() {

    const item = {
        ...producto.value
    }

    /* =========================================
    🔥 CERRAR PRIMERO
    ========================================= */

    gsap.to(

        box.value,

        {

            scale: 0.7,

            opacity: 0,

            duration: 0.2,

            onComplete: () => {

                visible.value = false

                /* =========================================
                🔥 SHOW BOTTOMNAV
                ========================================= */

                showBottomNav()

                /* =========================================
                🔥 ABRIR EDITAR
                ========================================= */

                emit(

                    'edit',

                    item

                )

            }

        }

    )

}

/* =========================================
🔥 NO DISPONIBLE
========================================= */

function noDisponible() {

    toastRef.value?.show({

        text:
            'Opción no disponible 😢',

        type:
            'error'

    })

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

                /* =========================================
                🔥 SHOW BOTTOMNAV
                ========================================= */

                showBottomNav()

            }

        }

    )

}

/* =========================================
📦 STOCK
========================================= */

function abrirStock() {

    cantidadRef.value?.open(

        {

            ...producto.value,

            stock_mode: true,

            cantidad_inicial:
                producto.value.stock

        }

    )

}

/* =========================================
💾 GUARDAR STOCK
========================================= */

async function guardarStock(payload) {

    try {

        const seguridad =
            firma()

        const res =
            await axios.post(

                '/VG0a/productoStock',

                {

                    product_id:
                        producto.value.product_id,

                    stock:
                        payload.cantidad,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        console.log(
            '📦 stock actualizado',
            res.data
        )

        /* =========================================
        🔥 UPDATE LOCAL
        ========================================= */

        if (

            res.data?.status === 'ok'

        ) {

            const nuevoStock =

                Number(

                    res.data
                        ?.data
                        ?.stock_actual

                )

            producto.value.stock =
                nuevoStock

            emit(

                'stock-updated',

                {

                    product_id:
                        producto.value.product_id,

                    stock:
                        nuevoStock

                }

            )

        }

    } catch (e) {

        console.error(e)

    }

}

/* =========================================
👁️ CONFIRMAR OCULTAR
========================================= */

function confirmarOcultar() {

    snackbarRef.value?.open(

        '¿Ocultar/mostrar producto? 👁️',

        () => {

            toggleVisible()

        }

    )

}

/* =========================================
🗑️ CONFIRMAR ELIMINAR
========================================= */

function confirmarEliminar() {

    snackbarRef.value?.open(

        '¿Eliminar producto? 🗑️',

        () => {

            eliminarProducto()

        }

    )

}

/* =========================================
🔥 FOTOS
========================================= */

function abrirFotos() {

    emit(

        'foto',

        producto.value

    )

    close()

}

/* =========================================
🗑️ ELIMINAR PRODUCTO
========================================= */

async function eliminarProducto() {

    try {

        const seguridad =
            firma()

        const res =
            await axios.post(

                '/ZnO3/eliminarProducto',

                {

                    product_id:
                        producto.value.product_id,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        console.log(
            '🗑️ producto eliminado',
            res.data
        )

        if (

            res.data?.status === 'ok'

        ) {

            toastRef.value?.show({

                text:
                    'Producto eliminado ✨',

                type:
                    'success'

            })

            /* =========================================
            🔥 EMIT
            ========================================= */

            emit(

                'deleted',

                {

                    product_id:
                        producto.value.product_id

                }

            )

            close()

        }

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                'Error eliminando producto 😢',

            type:
                'error'

        })

    }

}

/* =========================================
🔥 TOGGLE VISIBLE
========================================= */

async function toggleVisible() {

    try {

        const seguridad =
            firma()

        const nuevoEstado =

            Number(
                producto.value.is_visible
            ) === 1

                ?

                0

                :

                1

        const res =
            await axios.post(

                '/CF3a/productoVisible',

                {

                    product_id:
                        producto.value.product_id,

                    is_visible:
                        nuevoEstado,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        console.log(
            '👁️ visible update',
            res.data
        )

        if (

            res.data?.status === 'ok'

        ) {

            producto.value.is_visible =
                nuevoEstado

            emit(

                'visible-updated',

                {

                    product_id:
                        producto.value.product_id,

                    is_visible:
                        nuevoEstado

                }

            )

        }

    } catch (e) {

        console.error(e)

    }

}

defineExpose({

    open

})

</script>

<style scoped>
.item-btn {

    width: 100%;

    height: 48px;

    border-radius: 18px;

    background: #f8f8f8;

    font-size: 14px;

    font-weight: 600;

    transition: all 0.2s ease;

}

.item-btn:active {

    transform: scale(0.97);

}
</style>
