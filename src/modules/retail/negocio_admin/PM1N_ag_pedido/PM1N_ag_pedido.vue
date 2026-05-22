<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" @openAdd="openAddDialog" />

        <AddProductoDialog ref="addRef" @add="onAgregarProducto" />

        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-md p-4 space-y-3">

                <InputFecha v-model="form.fecha" />
                <InputCliente v-model="form.cliente" @select="onSelectCliente" />
                <InputTipoPago v-model="form.tipo_pago
                    " :showPorPagar="!isPublicoGeneral
                        " />

                <ProductosTable :items="productos" @edit="openEdit" @delete="confirmDelete" />

                <ResumenPedido :items="productos" />

                <BtnGuardar :loading="loadingGuardar" @guardar="guardarVenta" />

            </div>

        </div>

        <OptionsDialog ref="optionsRef" @nuevo="nuevo" @nuevo-cliente="abrirCrearCliente" />
        <EditarCantidadDialog ref="editRef" @update="updateProducto" />
        <AppSnackbar ref="snackbarRef" />
        <CrearClienteDialog ref="crearClienteRef" />

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

const productosGlobal =
    ref([])

const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})

const optionsRef =
    ref(null)

const editRef = ref(null)

const crearClienteRef =
    ref(null)

const publicoGeneralId =
    ref(1)

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

async function guardarVenta() {

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

            snackbarRef.value?.open(
                'Venta registrada correctamente ✅'
            )

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

function onSelectCliente(cliente) {

    form.value.cliente_id =
        cliente.cliente_id

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
/* ======================================
   🔥 INIT
====================================== */

cargarCategoriasInfo()
</script>