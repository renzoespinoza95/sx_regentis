<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" @openAdd="openAddDialog" />

        <AddProductoDialog ref="addRef" @add="onAgregarProducto" />

        <div class="flex-1 flex justify-center p-4">



            <div class="w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-md p-4 space-y-3">


                <PillsPedidos :pedidos="pedidos" :activoId="pedidoActivoId" @select="
                    seleccionarPedido
                " @delete="
                    confirmarEliminarPedido
                " />

                <InputCliente v-model="form.cliente" @select="onSelectCliente" />
                <InputFecha v-model="form.fecha" />

                <InputTipoPago v-model="form.tipo_pago
                    " :showPorPagar="!isPublicoGeneral
                        " />

                <ProductosTable :items="productos" @edit="openEdit" @delete="confirmDelete" />

                <ResumenPedido :items="productos" />

                <BtnGuardar :loading="loadingGuardar
                    " @guardar="
                        guardarVenta
                    " @cancelar="
                        cancelarPedido
                    " />

            </div>

        </div>

        <OptionsDialog ref="optionsRef" @nuevo="nuevo" @nuevo-cliente="abrirCrearCliente" />
        <EditarCantidadDialog ref="editRef" @update="updateProducto" />
        <AppSnackbar ref="snackbarRef" />
        <CrearClienteDialog ref="crearClienteRef" />
        <GsapToast ref="toastRef" />
        <VoucherModal ref="voucherRef" />
    </div>


</template>

<script setup>
import {
    ref,
    computed,
    provide
}
    from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import axios from 'axios'
import HeaderBar from './components/HeaderBar.vue'
import InputFecha from './components/InputFecha.vue'
import InputCliente from './components/InputCliente.vue'
import ProductosTable from './components/ProductosTable.vue'
import BtnGuardar from './components/BtnGuardar.vue'
import OptionsDialog from './components/OptionsDialog.vue'
import AddProductoDialog from './components/AddProductoDialog.vue'
import ResumenPedido from './components/ResumenPedido.vue'
import EditarCantidadDialog from './components/EditarCantidadDialog.vue'
import AppSnackbar from '../../../../components/layout/AppSnackbar.vue'
import {
    useUsuario
} from '../../../../services/usuarioService.js'
import InputTipoPago
    from './components/InputTipoPago.vue'
import CrearClienteDialog
    from './components/CrearClienteDialog.vue'
import {
    firma
}
    from '../../../../services/security.js'

import PillsPedidos
    from './components/PillsPedidos.vue'

import GsapToast
    from '../../../../components/layout/GsapToast.vue'
import VoucherModal
    from './components/VoucherModal.vue'


const { mercado } = useMercado()
const addRef = ref(null)
const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const {
    getNegId,
    getUsuId
} = useUsuario()

const loadingGuardar = ref(false)

const categoriasGlobal =
    ref([])

const voucherRef =
    ref(null)

const productosGlobal =
    ref([])

function verVoucher(
    urlPdf
) {

    voucherRef.value?.open(
        urlPdf
    )

}

const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})

const pedidos =
    ref([])

const pedidoActivoId =
    ref(0)

const optionsRef =
    ref(null)

const toastRef = ref(null)

const editRef = ref(null)

const crearClienteRef =
    ref(null)

const publicoGeneralId =
    ref(1)

const creandoBorrador =
    ref(false)

function openEdit(p) {
    editRef.value.open(p)
}

function updateProducto(updated) {
    const i = productos.value.findIndex(x => x.nombre === updated.nombre)
    if (i !== -1) productos.value[i] = updated
}

function openDialog() {

    optionsRef.value?.open()

}

function openAddDialog() {

    if (!pedidoActivoId.value) {

        snackbarRef.value?.open(
            'Seleccione un pedido primero'
        )

        return

    }

    addRef.value.open()

}

function onAgregarProducto(p) {

    /* ======================================
       🔍 BUSCAR EXISTENTE
    ====================================== */

    const existe =
        productos.value.find(x =>

            Number(x.product_id)
            ===
            Number(p.product_id)

        )

    /* ======================================
       ➕ SUMAR CANTIDAD
    ====================================== */

    if (existe) {

        existe.cantidad =

            Number(
                existe.cantidad || 0
            )

            +

            Number(
                p.cantidad || 0
            )

        return

    }

    /* ======================================
       🆕 NUEVO
    ====================================== */

    productos.value.push(p)

}

const pedidoActivo =
    computed(() => {

        return pedidos.value.find(

            x =>

                Number(
                    x.venta_borrador_id
                )

                ===

                Number(
                    pedidoActivoId.value
                )

        )

    })

async function nuevo() {

    try {

        toastRef.value?.show({

            text:
                'Guardando por seguridad...',

            type:
                'info'

        })

        await guardarBorradorActual()

        await crearNuevoBorrador()

        toastRef.value?.show({

            text:
                'Nuevo pedido creado',

            type:
                'success'

        })

    }
    catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                'Error creando pedido',

            type:
                'error'

        })

    }

}

async function guardarBorradorActual() {

    try {

        const seguridad =
            firma()

        await axios.post(

            `${API}/P7DX/draftGuardar`,

            {

                venta_borrador_id:

                    pedidoActivo.value
                        ?.venta_borrador_id

                    ||

                    0,

                neg_id:
                    getNegId(),

                usu_id_vendedor:
                    getUsuId(),

                cliente_id:

                    form.value
                        ?.cliente_id

                    ||

                    1,

                cliente_nombre:

                    form.value
                        ?.cliente

                    ||

                    'PUBLICO GENERAL',

                fecha:

                    form.value
                        ?.fecha

                    ||

                    getFechaHoy(),

                tipo_pago:

                    form.value
                        ?.tipo_pago

                    ||

                    'EFECTIVO',

                items:
                    productos.value,

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

        const pedido =
            pedidos.value.find(
                x =>
                    x.venta_borrador_id
                    ==
                    pedidoActivoId.value
            )

        if (pedido) {

            pedido.cliente_nombre =
                form.value.cliente

        }

    }
    catch (e) {

        console.error(

            'ERROR GUARDAR BORRADOR',

            e

        )

        throw e

    }

}

async function crearNuevoBorrador() {

    creandoBorrador.value =
        true

    const seguridad =
        firma()

    const r =
        await axios.post(

            `${API}/P7DX/draftGuardar`,

            {

                venta_borrador_id: 0,

                neg_id:
                    getNegId(),

                usu_id_vendedor:
                    getUsuId(),

                cliente_id:
                    publicoGeneralId.value,

                cliente_nombre:
                    'PUBLICO GENERAL',

                fecha:
                    getFechaHoy(),

                tipo_pago:
                    'EFECTIVO',

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

    const nuevoId =
        r.data
            ?.venta_borrador_id

    await cargarBorradores()

    pedidoActivoId.value =
        nuevoId

    form.value = {

        fecha:
            getFechaHoy(),

        cliente_id:
            publicoGeneralId.value,

        cliente:
            'PUBLICO GENERAL',

        tipo_pago:
            'EFECTIVO'

    }

    productos.value = []

    await seleccionarPedido({

        venta_borrador_id:
            nuevoId

    })

    creandoBorrador.value =
        false

}

async function cargarBorradores() {

    try {

        const seguridad =
            firma()

        const r =
            await axios.post(

                `${API}/H9KD/draftListar`,

                {

                    neg_id:
                        getNegId(),

                    usu_id_vendedor:
                        getUsuId(),

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (
            r.data.status === 'ok'
        ) {

            pedidos.value =
                r.data.data || []

            if (

                !pedidoActivoId.value
                &&
                pedidos.value.length

            ) {

                pedidoActivoId.value =

                    pedidos.value[0]
                        .venta_borrador_id

            }

        }

    }
    catch (e) {

        console.error(e)

    }

}

function nuevoPedido() {

    productos.value = []

    form.value = {

        fecha:
            getFechaHoy(),

        cliente_id:
            publicoGeneralId.value,

        cliente:
            'PUBLICO GENERAL',

        tipo_pago_id:
            1

    }

    snackbarRef.value?.open(
        'Nuevo pedido ✨'
    )

}

function abrirVoucher(url) {

    if (!url) {

        snackbarRef.value?.open(
            'No existe voucher'
        )

        return

    }

    window.open(

        `/voucher-viewer?pdf=` +

        encodeURIComponent(url),

        '_blank'

    )

}



async function guardarVenta() {

    if (!pedidoActivoId.value) {

        snackbarRef.value?.open(
            'Seleccione un pedido'
        )

        return

    }


    try {

        /* ======================================
           VALIDAR
        ====================================== */

        if (!productos.value.length) {

            snackbarRef.value?.open(
                'Debes agregar productos'
            )

            return

        }

        loadingGuardar.value = true

        /* ======================================
           🔐 FIRMA
        ====================================== */

        const seguridad =
            firma()

        /* ======================================
           PAYLOAD
        ====================================== */

        const payload = {

            neg_id:
                getNegId(),

            usu_id_vendedor:
                getUsuId(),

            cliente_id:
                form.value.cliente_id || 1,

            modo_order:
                'PAGO_DIRECTO',

            tipo_pago:
                form.value.tipo_pago || 'EFECTIVO',

            yaplin_id:
                null,

            xin:
                seguridad.xin,

            yuan:
                seguridad.yuan,

            items:
                productos.value.map(p => ({

                    product_id:
                        p.product_id,

                    cantidad:
                        p.cantidad,

                    precio:
                        p.precio

                }))

        }

        /* ======================================
           REQUEST
        ====================================== */

        const r = await axios.post(

            `${API}/BnyQ/ventaDirecta`,

            payload

        )

        /* ======================================
           OK
        ====================================== */

        if (r.data.status === 'ok') {

            const urlPdf = r.data.url_pdf || ''

            snackbarRef.value?.open(

                'Venta registrada correctamente ✅',

                null,

                [

                    {

                        text: 'Voucher',

                        action: () => {

                            verVoucher(
                                r.data.url_pdf
                            )

                        }

                    },

                    {

                        text: 'Cerrar',

                        action: () => {

                            snackbarRef.value?.cerrar?.()

                        }

                    }

                ]

            )

            const borradorId =

                pedidoActivoId.value

            const seguridad =
                firma()

            await axios.post(

                `${API}/W8LP/draftEliminar`,

                {

                    venta_borrador_id:
                        borradorId,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

            await cargarBorradores()

            pedidoActivoId.value = 0

            productos.value = []

            form.value = {

                fecha:
                    getFechaHoy(),

                cliente_id:
                    null,

                cliente:
                    '',

                tipo_pago:
                    'EFECTIVO'

            }

            // 🔥 LIMPIAR
            productos.value = []

            form.value = {

                fecha:
                    getFechaHoy(),

                cliente_id:
                    publicoGeneralId.value,

                cliente:
                    'PUBLICO GENERAL',

                tipo_pago:
                    'EFECTIVO'

            }

        } else {

            snackbarRef.value?.open(
                r.data.msg || 'Error'
            )

        }

    } catch (e) {

        console.error(e)

        snackbarRef.value?.open(
            'Error al guardar venta'
        )

    } finally {

        loadingGuardar.value = false

    }

}

/* ======================================
   🔥 PROVIDE
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

    'publicoGeneralId',

    publicoGeneralId

)

function abrirCrearCliente() {

    crearClienteRef.value?.open()

}

async function onSelectCliente(cliente) {

    form.value.cliente_id =
        cliente.cliente_id

    form.value.cliente =
        cliente.nombre

    const pedido =
        pedidos.value.find(

            x =>

                Number(
                    x.venta_borrador_id
                )

                ===

                Number(
                    pedidoActivoId.value
                )

        )

    if (pedido) {

        pedido.cliente_nombre =
            cliente.nombre

        pedido.cliente_id =
            cliente.cliente_id

        pedidos.value = [
            ...pedidos.value
        ]

    }

    await guardarBorradorActual()

}

// 🔥 DATA DEMO
function getFechaHoy() {
    const d = new Date()

    const dia = String(d.getDate()).padStart(2, '0')
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const anio = d.getFullYear()

    return `${dia}/${mes}/${anio}`
}

const form = ref({

    fecha:
        getFechaHoy(),

    cliente_id:
        null,

    cliente:
        'PUBLICO GENERAL',

    tipo_pago:
        'EFECTIVO'

})

/* ======================================
   🔥 PUBLICO GENERAL
====================================== */

const isPublicoGeneral =
    computed(() => {

        return Number(
            form.value?.cliente_id
        )

            ===

            Number(
                publicoGeneralId.value
            )

    })

const snackbarRef = ref(null)

/* ======================================
   🔥 CARGAR CATEGORIAS
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

            /* ======================================
               🔥 IDS
            ====================================== */

            publicoGeneralId.value =

                Number(

                    r.data
                        ?.publico_general_id

                    ||

                    1

                )

            /* ======================================
               🔥 DEFAULT CLIENTE
            ====================================== */

            if (
                !form.value.cliente_id
            ) {

                form.value.cliente_id =

                    publicoGeneralId.value

            }

            /* ======================================
               🔥 CATEGORIAS
            ====================================== */

            categoriasGlobal.value =
                r.data.data || []

            /* ======================================
               🔥 PRODUCTOS
            ====================================== */

            const productosMap =
                new Map()

                ; (
                    r.data.data || []
                ).forEach(cat => {

                    ; (
                        cat.productos || []
                    ).forEach(p => {

                        if (

                            !productosMap.has(
                                p.product_id
                            )

                        ) {

                            productosMap.set(

                                p.product_id,

                                {

                                    ...p,

                                    categories_ids: [

                                        Number(
                                            cat.category_id
                                        )

                                    ]

                                }

                            )

                        }

                        else {

                            productosMap
                                .get(
                                    p.product_id
                                )
                                .categories_ids
                                .push(

                                    Number(
                                        cat.category_id
                                    )

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

        console.error(
            'ERROR CATEGORIAS INFO',
            e
        )

    }

}



function confirmDelete(p) {
    console.log('SNACKBAR OPEN', p)
    snackbarRef.value.open(
        `¿Eliminar ${p.nombre}?`,
        () => eliminarProducto(p)
    )
}

function eliminarProducto(p) {
    productos.value = productos.value.filter(x => x !== p)
}

const productos = ref([])

async function seleccionarPedido(
    pedido
) {

    try {

        if (

            !creandoBorrador.value

            &&

            pedidoActivoId.value

            &&

            Number(
                pedidoActivoId.value
            )

            !==

            Number(
                pedido.venta_borrador_id
            )

        ) {

            await guardarBorradorActual()

        }

    }
    catch (e) {

        console.error(
            'ERROR GUARDANDO BORRADOR',
            e
        )

    }

    pedidoActivoId.value =

        pedido.venta_borrador_id

    const seguridad =
        firma()

    const r =
        await axios.post(

            `${API}/Q2ZA/draftDetalle`,

            {

                venta_borrador_id:

                    pedido
                        .venta_borrador_id,

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

    if (
        r.data.status === 'ok'
    ) {

        const data =
            r.data.data

        form.value = {

            fecha:
                data.fecha,

            cliente_id:
                data.cliente_id,

            cliente:
                data.cliente_nombre,

            tipo_pago:
                data.tipo_pago

        }

        productos.value =
            data.items || []

    }

}

async function eliminarPedido(
    pedido
) {

    try {

        const seguridad =
            firma()

        await axios.post(

            `${API}/W8LP/draftEliminar`,

            {

                venta_borrador_id:

                    pedido
                        .venta_borrador_id,

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

        await cargarBorradores()

        /* =====================
           NO QUEDAN PEDIDOS
        ===================== */

        if (
            !pedidos.value.length
        ) {

            await crearNuevoBorrador()

            return

        }

        /* =====================
           ÚLTIMO PEDIDO
        ===================== */

        const ultimo =

            pedidos.value[0]

        await seleccionarPedido({

            venta_borrador_id:

                ultimo
                    .venta_borrador_id

        })

        toastRef.value?.show({

            text:
                'Pedido eliminado',

            type:
                'success'

        })

    }
    catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                'Error eliminando pedido',

            type:
                'error'

        })

    }

}

async function cancelarPedido() {

    if (
        !pedidoActivo.value
    ) {
        return
    }

    snackbarRef.value.open(

        '¿Deseas cancelar este pedido?',

        async () => {

            await eliminarPedido(
                pedidoActivo.value
            )

        }

    )

}

function confirmarEliminarPedido(
    pedido
) {

    snackbarRef.value.open(

        `¿Eliminar ${pedido.cliente_nombre
        ||
        'este pedido'
        }?`,

        async () => {

            await eliminarPedido(
                pedido
            )

        }

    )

}

/* ======================================
   🔥 INIT
====================================== */

async function init() {

    await cargarCategoriasInfo()

    await cargarBorradores()

    if (!pedidos.value.length) {

        await crearNuevoBorrador()

        return

    }

    await seleccionarPedido({

        venta_borrador_id:
            pedidos.value[0]
                .venta_borrador_id

    })

}

init()
</script>