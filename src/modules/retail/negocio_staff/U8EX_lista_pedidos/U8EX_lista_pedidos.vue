<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <!-- CONTENIDO -->
        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">
                <PedidoItem v-for="p in pedidos" :key="p.id" :item="p" />
            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

    </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBar from './components/HeaderBar.vue'
import PedidoItem from './components/PedidoItem.vue'
import BtnAccion from './components/BtnAccion.vue'
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
const pedidos = ref([
    {
        id: 1,
        codigo: '#1002',
        cliente: 'Bilbo bolson',
        fecha: '04/05/2025',
        productos: 6,
        total: 150.60,
        estado: 'Pendiente'
    },
    {
        id: 2,
        codigo: '#1002',
        cliente: 'Bilbo bolson',
        fecha: '04/05/2025',
        productos: 6,
        total: 150.60,
        estado: 'En camino',
        repartidor: 'Juan Perez'
    }
])
</script>