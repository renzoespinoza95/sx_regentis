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
import {
    useAnonimo
}
    from '../../../../services/anonimoService.js'
import {
    useTienda
}
    from '../../../../services/useTienda.js'

const { mercado } = useMercado()
const { usuario } = useUsuario()

const router = useRouter()

const {
    data
} = useTienda()

const {

    anonimo,

    updateCantidad,

    removeProducto

} = useAnonimo()

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
async function cargarCarrito() {

    const productosAnonimos =

        anonimo.value?.productos

        ||

        []

    if (

        !productosAnonimos.length

    ) {

        negocios.value = []

        return

    }

    negocios.value = [

        {

            neg_id:

                anonimo.value.neg_id,

            nombre:

                'Mi carrito',

            puesto:

                `${productosAnonimos.length} productos`,

            img_logo:

                null,

            carritos: [

                {

                    carrito_id:
                        1,

                    estado:
                        'BORRADOR',

                    tipo_pedido:
                        'DELIVERY',

                    productos:

                        productosAnonimos.map(

                            p => ({

                                carrito_detalle_id:

                                    p.product_id,

                                product_id:

                                    p.product_id,

                                name:

                                    p.nombre,

                                cantidad:

                                    p.cantidad,

                                precio_unitario:

                                    p.precio,

                                img:

                                    p.img

                            })

                        )

                }

            ]

        }

    ]

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

    updateCantidad(

        updated.product_id,

        updated.cantidad

    )

    await cargarCarrito()

    if (

        carritoSeleccionado.value

    ) {

        await seleccionarCarrito(

            negocios.value[0]
                .carritos[0]

        )

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

    removeProducto(

        p.product_id

    )

    await cargarCarrito()

    if (

        !anonimo.value.productos
            ?.length

    ) {

        carritoSeleccionado.value =
            null

        productos.value = []

        return

    }

    if (

        carritoSeleccionado.value

    ) {

        await seleccionarCarrito(

            negocios.value[0]
                .carritos[0]

        )

    }

}

async function finalizarPedido() {

    const telefono =

        data.value?.negocio?.celular_informes

    if (!telefono) {

        snackbarRef.value?.open(
            'No existe celular de contacto ❌'
        )

        return
    }

    if (!productos.value?.length) {

        snackbarRef.value?.open(
            'Carrito vacío ❌'
        )

        return
    }

    let mensaje =

        `Buenos días

Deseo los siguientes productos:

`

    let total = 0

    productos.value.forEach(p => {

        const subtotal =

            Number(p.precio)
            *
            Number(p.cantidad)

        total += subtotal

        mensaje +=

            `${p.nombre}
S/.${Number(p.precio).toFixed(2)} x ${p.cantidad} und
S/.${subtotal.toFixed(2)}

`

    })

    mensaje +=

        `--------------------
TOTAL
S/.${total.toFixed(2)}
`

    const url =

        `https://wa.me/51${telefono}?text=${encodeURIComponent(mensaje)}`

    window.open(
        url,
        '_blank'
    )

}
</script>
