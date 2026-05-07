<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <!-- CONTENIDO -->
        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <PedidoItem v-for="p in pedidos" :key="p.carrito_id" :item="p" />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import { useMercado } from '../../services/useMercado.js'
import { cssToObject } from '../../services/useCss.js'
import { useUsuario } from '../../services/usuarioService.js'

import HeaderBar from './components/HeaderBar.vue'
import PedidoItem from './components/PedidoItem.vue'
import OptionsDialog from './components/OptionsDialog.vue'

const API = import.meta.env.VITE_PUBLIC_URL_BASE

const { mercado } = useMercado()
const { getUsuId } = useUsuario()

const pedidos = ref([])

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) return {}

    return cssToObject(mercado.value.patron_fondo)
})

const dialogRef = ref(null)

function openDialog() {
    dialogRef.value.open()
}

/* =========================================
   CARGAR PEDIDOS
========================================= */

async function cargarPedidos() {

    try {

        const usu_id = getUsuId()

        if (!usu_id) return

        const r = await axios.post(`${API}/Ow7y/mis_pedidos`, {
            usu_id
        })

        pedidos.value = r.data.data || []

    } catch (e) {

        console.error('Error cargando pedidos', e)
    }
}

onMounted(() => {
    cargarPedidos()
})
</script>