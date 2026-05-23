<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <!-- HEADER -->

        <HeaderBar :isDetalle="isDetalle" :mesa="mesaSeleccionada" @back="volverMesas" @openAdd="openAddDialog"
            @checkout="openVentaDialog" />

        <!-- ADD PRODUCT -->
        <AddProductoDialog ref="addRef" @add="onAgregarProducto" />

        <!-- ======================================
             🪑 LISTA MESAS
        ====================================== -->

        <template v-if="!isDetalle">

            <!-- GRID DONDE LISTAS LAS MESAS -->

            <div ref="mesasWrap" class="
        p-3
        grid
        grid-cols-2
        gap-3
    ">

                <MesaCard v-for="mesa in mesas" :key="mesa.mesa_id" :mesa="mesa" @click="abrirMesa" />

            </div>

        </template>

        <!-- ======================================
             🧾 DETALLE PEDIDO
        ====================================== -->

        <template v-else>

            <div ref="detalleWrap" class="flex-1 flex justify-center p-4">

                <div class="w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-md p-4 space-y-3">



                    <HistorialMesita v-if="detallesMesita.length" :detalles="detallesMesita" />

                    <ProductosTable :items="productos" @edit="openEdit" @delete="confirmDelete" />

                    <ResumenPedido :items="productos" />

                    <BtnGuardar :loading="loadingGuardar" @guardar="guardarPedidoMesa" />

                </div>

            </div>

        </template>

        <!-- DIALOGS -->
        <EditarCantidadDialog ref="editRef" @update="updateProducto" />

        <AppSnackbar ref="snackbarRef" />


        <VentaDialog ref="ventaRef" />

    </div>

</template>
<script setup>

import {
    ref,
    computed,
    onMounted,
    nextTick,
    provide
}
    from 'vue'

import axios from 'axios'
import gsap from 'gsap'

import {
    useMercado
}
    from '../../../../services/useMercado.js'

import {
    cssToObject
}
    from '../../../../services/useCss.js'

import {
    useUsuario
}
    from '../../../../services/usuarioService.js'

import {
    firma
}
    from '../../../../services/security.js'

import HeaderBar
    from './components/HeaderBar.vue'

import MesaCard
    from './components/MesaCard.vue'

import AddProductoDialog
    from './components/AddProductoDialog.vue'

import ProductosTable
    from './components/ProductosTable.vue'

import ResumenPedido
    from './components/ResumenPedido.vue'

import BtnGuardar
    from './components/BtnGuardar.vue'

import EditarCantidadDialog
    from './components/EditarCantidadDialog.vue'

import AppSnackbar
    from '../../../../components/layout/AppSnackbar.vue'

import HistorialMesita
    from './components/HistorialMesita.vue'

import {
    bus
}
    from '../../../../services/eventBus.js'

import VentaDialog
    from '../../../../components/VentaDialog.vue'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

/* ======================================
   🔥 USER
====================================== */

const {
    getNegId,
    getUsuId
}
    =
    useUsuario()

const {
    mercado
}
    =
    useMercado()

/* ======================================
   🔥 STATE
====================================== */


const detallesMesita =
    ref([])

const carritoMesita =
    ref(null)

const mesas =
    ref([])

const isDetalle =
    ref(false)

const mesaSeleccionada =
    ref(null)

const productos =
    ref([])

const categoriasGlobal =
    ref([])

const productosGlobal =
    ref([])

const pedidoEnviado =
    ref(false)

const loadingGuardar =
    ref(false)

const snackbarRef =
    ref(null)

const addRef =
    ref(null)

const editRef =
    ref(null)

const mesasWrap =
    ref(null)

const detalleWrap =
    ref(null)



const ventaRef =
    ref(null)

const form =
    ref({

        cliente:
            'PUBLICO GENERAL',

        cliente_id:
            1,

        tipo_pago:
            'EFECTIVO'

    })

/* ======================================
   🔥 PROVIDES
====================================== */

provide(
    'categoriasGlobal',
    categoriasGlobal
)

provide(
    'productosGlobal',
    productosGlobal
)

provide(
    'pedidoEnviado',
    pedidoEnviado
)

provide(
    'loadingGuardar',
    loadingGuardar
)

provide(
    'finalizarPedido',
    finalizarPedido
)

/* ======================================
   🔥 FONDO
====================================== */

const fondoStyle =
    computed(() => {

        if (
            !mercado.value?.patron_fondo
        ) {

            return {}

        }

        return cssToObject(
            mercado.value.patron_fondo
        )

    })

/* ======================================
   🔥 GSAP
====================================== */


function animarMesas() {

    nextTick(() => {

        gsap.fromTo(

            '.mesa-card',

            {

                scale: 0,
                opacity: 0

            },

            {

                scale: 1,
                opacity: 1,

                stagger: {

                    each: 0.05

                },

                duration: 0.35,

                ease: 'power2.out',

                clearProps: 'all'

            }

        )

    })

}

function animarDetalle() {

    nextTick(() => {

        gsap.fromTo(

            detalleWrap.value,

            {
                x: 120,
                opacity: 0
            },

            {
                x: 0,
                opacity: 1,
                duration: 0.45,
                ease: 'power3.out'
            }

        )

    })

}

/* ======================================
   🔥 OPEN VENTA
====================================== */

function openVentaDialog() {

    const items = [

        /* ======================================
           🔥 HISTORIAL
        ====================================== */

        ...detallesMesita.value.map(x => ({

            carrito_detalle_id:
                x.carrito_detalle_id,

            product_id:
                x.product_id,

            name:
                x.name,

            cantidad:
                Number(
                    x.cantidad
                ),

            precio_unitario:
                Number(
                    x.precio_unitario
                ),

            img:
                x.img

        })),

        /* ======================================
           🔥 NUEVOS PRODUCTOS
        ====================================== */

        ...productos.value.map(x => ({

            product_id:
                x.product_id,

            name:
                x.nombre,

            cantidad:
                Number(
                    x.cantidad
                ),

            precio_unitario:
                Number(
                    x.precio
                ),

            img:
                x.img

        }))

    ]

    ventaRef.value?.open({

        carrito_id:
            carritoMesita.value?.carrito_id
            || null,

        neg_id:
            getNegId(),

        mesa_id:
            mesaSeleccionada.value?.mesa_id,

        tipo_pedido:
            'MESA_PEDIDO',

        cliente:
            'PUBLICO GENERAL',

        cliente_id:
            1,

        productos:
            items

    })

}

/* ======================================
   🔥 CARGAR MESAS
====================================== */

async function cargarMesas() {

    try {

        const seguridad =
            firma()

        const r =
            await axios.post(

                `${API}/BAJc/mesasNegocio`,

                {

                    neg_id:
                        getNegId(),

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (
            r.data.status === 'ok'
        ) {

            mesas.value =
                r.data.data || []

            animarMesas()

        }

    } catch (e) {

        console.error(e)

    }

}

/* ======================================
   🔥 ABRIR MESA
====================================== */


async function abrirMesa(mesa) {

    mesaSeleccionada.value =
        mesa

    isDetalle.value =
        true

    detallesMesita.value = []

    carritoMesita.value =
        null

    productos.value = []

    animarDetalle()

    /* ======================================
       🔥 SI ESTA OCUPADA
    ====================================== */

    if (
        mesa.estado === 'OCUPADA'
    ) {

        try {

            const seguridad =
                firma()

            const r =
                await axios.post(

                    `${API}/b3by/miMesita`,

                    {

                        xin:
                            seguridad.xin,

                        yuan:
                            seguridad.yuan,

                        mesa_id:
                            mesa.mesa_id,

                        neg_id:
                            getNegId()

                    }

                )

            if (
                r.data.status === 'ok'
            ) {

                carritoMesita.value =
                    r.data.carrito

                detallesMesita.value =
                    r.data.detalles || []

                /* ======================================
                   🔥 CARGAR AL CARRITO VISUAL
                ====================================== */


                /* ======================================
                   🔥 PRODUCTOS NUEVOS VACIOS
                ====================================== */

                productos.value = []

            }

        } catch (e) {

            console.error(e)

        }

    }

}

/* ======================================
   🔥 VOLVER
====================================== */

function volverMesas() {

    isDetalle.value =
        false

    mesaSeleccionada.value =
        null

    animarMesas()

}

/* ======================================
   🔥 ADD PRODUCT
====================================== */

function openAddDialog() {

    addRef.value?.open()

}

function onAgregarProducto(p) {

    const existe =
        productos.value.find(x =>

            Number(x.product_id)
            ===
            Number(p.product_id)

        )

    if (existe) {

        existe.cantidad +=
            Number(p.cantidad)

        return

    }

    productos.value.push({

        ...p,

        img:
            p.img
            ||
            'https://picsum.photos/300'

    })

}

/* ======================================
   🔥 EDIT PRODUCTO
====================================== */

function openEdit(p) {

    editRef.value.open(p)

}



function openEditHistorial(item) {

    editRef.value.open({

        product_id:
            item.product_id,

        nombre:
            item.name,

        precio:
            item.precio_unitario,

        cantidad:
            item.cantidad,

        unidad:
            'und',

        img:
            item.img,

        fromHistorial:
            true,

        carrito_detalle_id:
            item.carrito_detalle_id

    })

}


function updateProducto(updated) {

    /* ======================================
       🔥 HISTORIAL
    ====================================== */

    if (
        updated.fromHistorial
    ) {

        const i =
            detallesMesita.value.findIndex(x =>

                x.carrito_detalle_id
                ===
                updated.carrito_detalle_id

            )

        if (i !== -1) {

            detallesMesita.value[i].cantidad =
                updated.cantidad

        }

        return

    }

    /* ======================================
       🔥 PRODUCTOS NUEVOS
    ====================================== */

    const i =
        productos.value.findIndex(x =>

            x.product_id
            ===
            updated.product_id

        )

    if (i !== -1) {

        productos.value[i] =
            updated

    }

}



function confirmDeleteHistorial(item) {

    snackbarRef.value?.open({

        text:
            `¿Eliminar ${item.name}? 🗑️`,

        color:
            'red',

        duration:
            5000,

        actionText:
            'Eliminar',

        onAction: () => {

            detallesMesita.value =
                detallesMesita.value.filter(x =>

                    x.carrito_detalle_id
                    !==
                    item.carrito_detalle_id

                )

            snackbarRef.value?.open(
                'Producto eliminado'
            )

        }

    })

}

/* ======================================
   🔥 DELETE PRODUCTO
====================================== */


function confirmDelete(item) {

    snackbarRef.value?.open({

        text:
            `¿Eliminar ${item.nombre}? 🗑️`,

        color:
            'red',

        duration:
            5000,

        actionText:
            'Eliminar',

        onAction: () => {

            productos.value =
                productos.value.filter(x =>

                    x !== item

                )

            snackbarRef.value?.open(
                'Producto eliminado'
            )

        }

    })

}

/* ======================================
   🔥 CLIENTE
====================================== */

function onSelectCliente(cliente) {

    form.value.cliente =
        cliente.nombre

    form.value.cliente_id =
        cliente.cliente_id

}

/* ======================================
   🔥 GUARDAR PEDIDO
====================================== */

async function guardarPedidoMesa() {

    snackbarRef.value?.open(
        'Pedido de mesa guardado 🍽️'
    )

}

/* ======================================
   🔥 FINALIZAR PEDIDO
====================================== */

async function finalizarPedido() {

    try {

        /* ======================================
           VALIDAR MESA
        ====================================== */

        if (
            !mesaSeleccionada.value
        ) {

            snackbarRef.value?.open(
                'Selecciona una mesa'
            )

            return

        }

        /* ======================================
           VALIDAR PRODUCTOS
        ====================================== */

        if (
            !productos.value.length
        ) {

            snackbarRef.value?.open(
                'Agrega productos'
            )

            return

        }

        loadingGuardar.value =
            true

        /* ======================================
           FIRMA
        ====================================== */

        const seguridad =
            firma()

        /* ======================================
           PAYLOAD
        ====================================== */

        const payload = {

            xin:
                seguridad.xin,

            yuan:
                seguridad.yuan,

            neg_id:
                getNegId(),

            usu_id_vendedor:
                getUsuId(),

            mesa_id:
                mesaSeleccionada.value.mesa_id,

            productos:
                productos.value.map(p => ({

                    product_id:
                        p.product_id,

                    cantidad:
                        p.cantidad,

                    precio:
                        p.precio,

                    nombre:
                        p.nombre,

                    unidad:
                        p.unidad

                }))

        }

        /* ======================================
           REQUEST
        ====================================== */

        const r =
            await axios.post(

                `${API}/b3by/atenderMesita`,

                payload

            )



        /* ======================================
           OK
        ====================================== */

        if (
            r.data.status === 'ok'
        ) {

            /* ======================================
               🔥 CAMBIAR ESTADO MESA
            ====================================== */

            const mesaIndex =
                mesas.value.findIndex(m =>

                    Number(m.mesa_id)
                    ===
                    Number(
                        r.data.mesa_id
                    )

                )

            if (mesaIndex !== -1) {

                mesas.value[mesaIndex].estado =
                    r.data.mesa_estado

            }

            /* ======================================
               🔥 CAMBIAR MESA ACTUAL
            ====================================== */

            if (
                mesaSeleccionada.value
            ) {

                mesaSeleccionada.value.estado =
                    r.data.mesa_estado

            }

            pedidoEnviado.value =
                true

            snackbarRef.value?.open(
                'Pedido enviado 🍽️'
            )

            productos.value = []

            setTimeout(() => {

                volverMesas()

                pedidoEnviado.value =
                    false

            }, 1200)

        }

        /* ======================================
           ERROR RESPONSE
        ====================================== */

        else {

            snackbarRef.value?.open(

                r.data.msg
                ||
                'Error al enviar'

            )

        }

    } catch (e) {

        console.error(e)

        snackbarRef.value?.open(
            'Error del servidor'
        )

    } finally {

        loadingGuardar.value =
            false

    }

}

/* ======================================
   🔥 CARGAR PRODUCTOS
====================================== */

async function cargarCategoriasInfo() {

    try {

        const seguridad =
            firma()

        const r =
            await axios.post(

                `${API}/MylW/listar_categorias`,

                {

                    neg_id:
                        getNegId(),

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (
            r.data.status === 'ok'
        ) {

            categoriasGlobal.value =
                r.data.data || []

            const productosMap =
                new Map()

                ; (
                    r.data.data || []
                ).forEach(cat => {

                    ; (
                        cat.productos || []
                    ).forEach(p => {

                        const img =
                            p.imagenes?.[0]?.img
                            ||
                            'https://picsum.photos/300'

                        /* ======================================
                           🔥 YA EXISTE
                        ====================================== */

                        if (
                            productosMap.has(
                                p.product_id
                            )
                        ) {

                            const old =
                                productosMap.get(
                                    p.product_id
                                )

                            const cats =
                                old.categories_ids || []

                            if (
                                !cats.includes(
                                    Number(
                                        cat.category_id
                                    )
                                )
                            ) {

                                cats.push(

                                    Number(
                                        cat.category_id
                                    )

                                )

                            }

                            productosMap.set(

                                p.product_id,

                                {

                                    ...old,

                                    categories_ids:
                                        cats

                                }

                            )

                        }

                        /* ======================================
                           🔥 NUEVO
                        ====================================== */

                        else {

                            productosMap.set(

                                p.product_id,

                                {

                                    ...p,

                                    img,

                                    categories_ids: [

                                        Number(
                                            cat.category_id
                                        )

                                    ]

                                }

                            )

                        }

                    })

                })

            productosGlobal.value =
                Array.from(
                    productosMap.values()
                )

        }

    } catch (e) {

        console.error(e)

    }

}

/* ======================================
   🔥 MOUNT
====================================== */

onMounted(() => {



    /* ======================================
       🔥 LISTENER MESAS
    ====================================== */
    bus.on(

        'mesas:update',

        (lista) => {

            if (
                !Array.isArray(lista)
            ) {
                return
            }

            mesas.value =
                lista.map(x => ({

                    ...x

                }))

            animarMesas()

        }

    )

    cargarMesas()
    cargarCategoriasInfo()

})

</script>