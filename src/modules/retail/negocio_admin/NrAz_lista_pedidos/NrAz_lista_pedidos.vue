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
import { ref, computed, watchEffect } from 'vue'
import axios from 'axios'

import { useMercado } from '../../../../services/useMercado.js'
import { useTienda } from '../../../../services/useTienda.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBar from './components/HeaderBar.vue'
import PedidoItem from './components/PedidoItem.vue'
import BtnAccion from './components/BtnAccion.vue'
import OptionsDialog from './components/OptionsDialog.vue'

const { mercado } = useMercado()

const { data: tienda } = useTienda()

const pedidos = ref([])

const dialogRef = ref(null)

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) return {}

    return cssToObject(mercado.value.patron_fondo)

})

function openDialog() {
    dialogRef.value.open()
}

async function cargarPedidos(neg_id) {

    try {

        console.log('CONSULTANDO PEDIDOS NEG_ID =>', neg_id)

        const r = await axios.get(
            `${import.meta.env.VITE_PUBLIC_URL_BASE}/nraz/lista_pedidos/${neg_id}`
        )

        console.log('PEDIDOS =>', r.data)

        pedidos.value = r.data.data || []

    } catch (e) {

        console.error(e)

    }

}

/* ======================================
   🔥 ESPERAR TIENDA
====================================== */

watchEffect(() => {

    const neg_id = tienda.value?.negocio?.neg_id

    console.log('NEG_ID DETECTADO =>', neg_id)

    if (!neg_id) return

    cargarPedidos(neg_id)

})
</script>