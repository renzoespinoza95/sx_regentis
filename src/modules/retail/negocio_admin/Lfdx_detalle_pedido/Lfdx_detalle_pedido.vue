<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-3xl bg-white rounded-2xl shadow-md p-4 space-y-4">

                <FieldText label="Fecha" :value="form.fecha" icon="calendar" />
                <FieldText label="Cliente" :value="form.cliente" icon="lock" />

                <div>
                    <h3 class="text-sm font-semibold mb-2">Productos</h3>

                    <ProductoRowView v-for="(p, i) in productos" :key="i" :item="p" />
                </div>

                <ResumenPedido :items="productos" />

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
import FieldText from './components/FieldText.vue'
import ProductoRowView from './components/ProductoRowView.vue'
import ResumenPedido from './components/ResumenPedido.vue'
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
    // futuro: cargar API
})
</script>