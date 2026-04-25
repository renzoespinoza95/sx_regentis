<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl bg-white rounded-2xl shadow-md p-4 space-y-3">

                <InputFecha v-model="form.fecha" />

                <!-- 🔥 CLIENTE SOLO LECTURA -->
                <InputClienteRead :value="form.cliente" />

                <ProductosTable :items="productos" />

                <ResumenPedido :items="productos" />

                <BtnGuardar />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBar from './components/HeaderBar.vue'
import InputFecha from './components/InputFecha.vue'
import InputClienteRead from './components/InputClienteRead.vue'
import ProductosTable from './components/ProductosTable.vue'
import ResumenPedido from './components/ResumenPedido.vue'
import BtnGuardar from './components/BtnGuardar.vue'
import OptionsDialog from './components/OptionsDialog.vue'

const { mercado } = useMercado()

const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})

const dialogRef = ref(null)

function openDialog() {
    dialogRef.value.open()
}

// 🔥 DATA DEMO
const form = ref({
    fecha: '2025-04-05',
    cliente: 'Bilbo bolson'
})

const productos = ref([
    { nombre: 'Palta hass', cantidad: 3, unidad: 'und', precio: 20 },
    { nombre: 'Membrillo', cantidad: 4, unidad: 'kg', precio: 10 }
])

onMounted(() => {
    // aquí luego cargas API real
})
</script>