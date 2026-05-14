<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" @openAdd="openAddDialog" />

        <AddProductoDialog ref="addRef" @add="onAgregarProducto" />

        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-md p-4 space-y-3">

                <InputFecha v-model="form.fecha" />
                <InputCliente v-model="form.cliente" @select="onSelectCliente" />
                <InputTipoPago v-model="form.tipo_pago_id" />

                <ProductosTable :items="productos" @edit="openEdit" @delete="confirmDelete" />

                <ResumenPedido :items="productos" />

                <BtnGuardar :loading="loadingGuardar" @guardar="guardarVenta" />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" @nuevo="nuevoPedido" />
        <EditarCantidadDialog ref="editRef" @update="updateProducto" />
        <AppSnackbar ref="snackbarRef" />

    </div>


</template>

<script setup>
import { ref, computed } from 'vue'
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

const { mercado } = useMercado()
const addRef = ref(null)
const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const {
    getNegId,
    getUsuId
} = useUsuario()

const loadingGuardar = ref(false)

const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})

const dialogRef = ref(null)

const editRef = ref(null)

function openEdit(p) {
    editRef.value.open(p)
}

function updateProducto(updated) {
    const i = productos.value.findIndex(x => x.nombre === updated.nombre)
    if (i !== -1) productos.value[i] = updated
}

function openDialog() {
    dialogRef.value.open()
}

function openAddDialog() {
    addRef.value.open()
}

function onAgregarProducto(p) {

    productos.value.push(p)

}

function nuevoPedido() {

    productos.value = []

    form.value = {

        fecha:
            getFechaHoy(),

        cliente_id:
            1,

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
           PAYLOAD
        ====================================== */

        const payload = {

            neg_id:
                getNegId(),

            usu_id:
                getUsuId(),

            cliente_id:
                form.value.cliente_id || 1,

            tipo_pago_id:
                1,

            yaplin_id:
                null,

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

            form.value.cliente_id = 1

            form.value.cliente =
                'PUBLICO GENERAL'

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
        1,

    cliente:
        'PUBLICO GENERAL'

})

const snackbarRef = ref(null)

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
</script>