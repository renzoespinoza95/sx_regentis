<template>

    <div class="
            min-h-screen
            flex
            flex-col
            pt-20
        " :style="fondoStyle
            ">

        <HeaderBack />

        <div class="
                flex-1
                flex
                justify-center
                p-4
            ">

            <!-- =========================================
               NEGOCIOS
            ========================================== -->

            <div v-if="
                !carritoSeleccionado
            " ref="acordeonRef" class="
                    w-full
                    max-w-md
                    md:max-w-4xl
                    space-y-4
                ">

                <div v-if="
                    negocios.length
                " class="
                        space-y-4
                    ">

                    <NegocioAccordion v-for="
neg in negocios
                        " :key="neg.neg_id
                            " :negocio="neg
                                " :carrito-id-activo="carritoSeleccionado?.carrito_id
                                    " @select-carrito="
                                    seleccionarCarrito
                                " />

                </div>

                <!-- EMPTY -->
                <EmptyLetter v-else titulo="
                        Carrito vacío
                    " texto="
                        Aún no agregaste productos
                        al carrito 🛒
                    " />

            </div>

            <!-- =========================================
               DETALLE
            ========================================== -->

            <div v-if="
                carritoSeleccionado
            " ref="detalleRef" class="
                    w-full
                    max-w-md
                    md:max-w-4xl
                    space-y-4
                ">

                <PedidoDetalleHeader :carrito-id="carritoSeleccionado?.carrito_id
                    " @back="
                        volverListado
                    " />

                <div class="
                    bg-white
                    rounded-2xl
                    shadow-md
                    p-4
                    space-y-3
                ">

                    <InputFecha v-model="form.fecha
                        " />

                    <TipoPedidoPills v-model="form.tipo_pedido
                        " />

                    <ProductosTable :items="productos
                        " @edit="
                            openEdit
                        " @delete="
                            confirmDelete
                        " />

                    <ResumenPedido :items="productos
                        " />

                    <BtnGuardar />

                </div>

            </div>

        </div>

        <EditarCantidadDialog ref="editRef" @update="
            updateProducto
        " />

        <AppSnackbar ref="snackbarRef" />

        <GsapConfetti ref="confettiRef" />

    </div>

</template>
<script setup>
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import { useUsuario } from '../../../../services/usuarioService.js'
import EmptyLetter
    from '../../../../components/layout/EmptyLetter.vue'
import HeaderBack from '../../../../components/layout/HeaderBack.vue'
import InputFecha from './components/InputFecha.vue'
import ProductosTable from './components/ProductosTable.vue'
import BtnGuardar from './components/BtnGuardar.vue'
import ResumenPedido from './components/ResumenPedido.vue'
import EditarCantidadDialog from './components/EditarCantidadDialog.vue'
import AppSnackbar from '../../../../components/layout/AppSnackbar.vue'
import { useRouter } from 'vue-router'
import TipoPedidoPills
    from './components/TipoPedidoPills.vue'
import NegocioAccordion
    from './components/NegocioAccordion.vue'
import {
    firma
}
    from '../../../../services/security.js'
import {
    ref,
    computed,
    onMounted,
    provide,
    nextTick
}
    from 'vue'

import gsap
    from 'gsap'

import PedidoDetalleHeader
    from './components/PedidoDetalleHeader.vue'

const { mercado } = useMercado()
const { usuario } = useUsuario()

const router = useRouter()

const carritoId = ref(null)
const pedidoEnviado = ref(false)

const user = computed(() => usuario.value?.user || null)

const confettiRef = ref(null)
const productos = ref([])
const editRef = ref(null)
const snackbarRef = ref(null)

const negocios =
    ref([])

const carritoSeleccionado =
    ref(null)

const acordeonRef =
    ref(null)

const detalleRef =
    ref(null)

provide('finalizarPedido', finalizarPedido)
provide('pedidoEnviado', pedidoEnviado)

const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})



function getFechaHoy() {
    const d = new Date()
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

const form = ref({

    fecha:
        getFechaHoy(),

    tipo_pedido:
        'DELIVERY'

})

function animarEntrada(
    el
) {

    if (!el)
        return

    gsap.fromTo(

        el,

        {

            x: -80,
            opacity: 0

        },

        {

            x: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out'

        }

    )

}

async function seleccionarCarrito(
    carrito
) {

    carritoSeleccionado.value =
        carrito

    carritoId.value =
        carrito.carrito_id

    productos.value =

        (
            carrito.productos
            ||
            []
        )
            .map(p => ({

                carrito_detalle_id:
                    p.carrito_detalle_id,

                product_id:
                    p.product_id,

                nombre:
                    p.name,

                cantidad:
                    p.cantidad,

                unidad:
                    'und',

                precio:
                    p.precio_unitario,

                img:
                    p.img

            }))

    form.value.fecha =

        carrito.fecha_entrega
        ||

        getFechaHoy()

    form.value.tipo_pedido =

        carrito.tipo_pedido
        ||

        'DELIVERY'

    await nextTick()

    animarEntrada(
        detalleRef.value
    )

}

async function volverListado() {

    carritoSeleccionado.value =
        null

    productos.value = []

    await nextTick()

    animarEntrada(
        acordeonRef.value
    )

}

/* =========================
   🔥 LISTAR CARRITOS
========================= */
/* =========================================
   🔥 LISTAR CARRITOS (Sincronización Reactiva)
========================================= */
async function cargarCarrito() {
    const usu_id = user.value?.usu_id
    if (!usu_id) return

    const seguridad = firma()

    const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL_BASE}/M0Jk/productosCarritos`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usu_id,
                xin: seguridad.xin,
                yuan: seguridad.yuan
            })
        }
    )

    const data = await res.json()

    if (data.status === 'ok') {
        negocios.value = data.data || []

        // 🔥 CRITICAL FIX: Si hay un carrito seleccionado, refrescar sus productos en caliente
        if (carritoSeleccionado.value) {
            // Buscamos el carrito actualizado dentro de la nueva lista de negocios
            let carritoActualizado = null

            for (const neg of negocios.value) {
                const found = neg.carritos?.find(c => c.carrito_id === carritoId.value)
                if (found) {
                    carritoActualizado = found
                    break
                }
            }

            if (carritoActualizado) {
                // Actualizamos la tabla de productos vinculada al template
                productos.value = (carritoActualizado.productos || []).map(p => ({
                    carrito_detalle_id: p.carrito_detalle_id,
                    product_id: p.product_id,
                    nombre: p.name,
                    cantidad: p.cantidad,
                    unidad: 'und',
                    precio: p.precio_unitario,
                    img: p.img
                }))
            } else {
                // Si el carrito ya no existe (ej: se vació completo), regresamos al listado
                volverListado()
            }
        }
    }
}

onMounted(async () => {

    await cargarCarrito()

    await nextTick()

    animarEntrada(
        acordeonRef.value
    )

})

/* =========================
   🔥 EDITAR (NUEVO)
========================= */

function openEdit(p) {
    editRef.value.open(p)
}

async function updateProducto(updated) {
    try {
        const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL_BASE}/M0Jk/editarCantidad`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                carrito_detalle_id: updated.carrito_detalle_id,
                cantidad: updated.cantidad
            })
        })

        const data = await res.json()

        // Esperamos el refresco completo de la base de datos y el remapeo local
        await cargarCarrito()

    } catch (e) {
        console.error("Error al actualizar cantidad:", e)
    }
}

/* =========================
   🔥 ELIMINAR (NUEVO)
========================= */

function confirmDelete(p) {

    snackbarRef.value.open(
        `¿Eliminar ${p.nombre}?`,
        () => eliminarProducto(p)
    )
}

async function eliminarProducto(p) {

    await fetch(`${import.meta.env.VITE_PUBLIC_URL_BASE}/M0Jk/eliminarProductoCarrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            carrito_detalle_id: p.carrito_detalle_id // 🔥 CAMBIO
        })
    })

    cargarCarrito()
}

async function finalizarPedido() {

    if (!carritoId.value) {
        snackbarRef.value?.open('No hay carrito ❌')
        return
    }

    try {

        // 🔥 convertir dd/mm/yyyy → yyyy-mm-dd
        let fechaEntrega = null

        if (form.value.fecha) {

            const [dia, mes, anio] = form.value.fecha.split('/')

            fechaEntrega = `${anio}-${mes}-${dia}`
        }

        const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL_BASE}/VS26/finalizarPedidoCarrito`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                carrito_id:
                    carritoId.value,

                fecha_entrega:
                    fechaEntrega,

                tipo_pedido:
                    form.value.tipo_pedido

            })
        })

        const data = await res.json()

        if (data.status === 'ok') {

            pedidoEnviado.value = true

            snackbarRef.value?.open('Pedido enviado 🎉')

            // 🔥 validar confetti
            if (
                confettiRef.value &&
                typeof confettiRef.value.show === 'function'
            ) {
                confettiRef.value.show()
            }

            setTimeout(() => {
                router.push(`/B2Tk_detalle_pedido/${carritoId.value}`)
            }, 3000)

        } else {

            snackbarRef.value?.open(data.msg || 'Error ❌')

        }

    } catch (e) {

        console.error(e)

        snackbarRef.value?.open('Error de conexión ❌')

    }
}

</script>
