<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" @openAdd="openAddDialog" />

        <AddProductoDialog ref="addRef" />

        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-md p-4 space-y-3">

                <InputFecha v-model="form.fecha" />
                <InputCliente v-model="form.cliente" />

                <ProductosTable :items="productos" @edit="openEdit" @delete="confirmDelete" />

                <ResumenPedido :items="productos" />

                <BtnGuardar />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />
        <EditarCantidadDialog ref="editRef" @update="updateProducto" />
        <AppSnackbar ref="snackbarRef" />

    </div>


</template>

<script setup>
import { ref, computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

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

const { mercado } = useMercado()
const addRef = ref(null)

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

// 🔥 DATA DEMO
function getFechaHoy() {
    const d = new Date()

    const dia = String(d.getDate()).padStart(2, '0')
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const anio = d.getFullYear()

    return `${dia}/${mes}/${anio}`
}

const form = ref({
    fecha: getFechaHoy()
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

const productos = ref([
    { nombre: 'Palta hass', cantidad: 3, unidad: 'und', precio: 20 },
    { nombre: 'Membrillo', cantidad: 4, unidad: 'kg', precio: 10 },
    { nombre: 'Tinte cabello', cantidad: 3, unidad: 'und', precio: 16 },
    { nombre: 'Shampoo tio', cantidad: 5, unidad: 'und', precio: 18 }
])
</script>