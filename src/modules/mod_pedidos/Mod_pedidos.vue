<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar :titulo="tituloActual" @openOptions="openDialog" />

        <!-- CONTENIDO -->
        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl">

                <!-- 🔥 VACÍO -->
                <EmptyLetter v-if="!pedidos.length" :titulo="`No hay pedidos ${estadoActual}`" :texto="`
No existen pedidos en estado
${estadoActual} 📦
`" />

                <!-- 🔥 LISTA -->
                <div v-else class="space-y-3">

                    <PedidoItem v-for="p in pedidos" :estado-actual="estadoActual" :key="p.carrito_id" :item="p"
                        :modo="modo" />

                </div>

            </div>

        </div>

        <OptionsDialog ref="dialogRef" @select="cargarPedidos" />

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import { useMercado } from '../../services/useMercado.js'
import { cssToObject } from '../../services/useCss.js'
import { useUsuario } from '../../services/usuarioService.js'
import EmptyLetter from '../../components/layout/EmptyLetter.vue'
import {
    firma
}
    from '../../services/security'
import HeaderBar from './components/HeaderBar.vue'
import PedidoItem from './components/PedidoItem.vue'
import OptionsDialog from './components/OptionsDialog.vue'

const API = import.meta.env.VITE_PUBLIC_URL_BASE

const { mercado } = useMercado()
const { getUsuId } = useUsuario()

const pedidos = ref([])

const estadoActual = ref('enviado')

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) return {}

    return cssToObject(mercado.value.patron_fondo)
})

const dialogRef = ref(null)

function openDialog() {
    dialogRef.value.open()
}

const tituloActual = computed(() => {

    const map = {

        enviado:
            'Pedidos enviados',

        transito:
            'Pedidos en tránsito',

        comprado:
            'Pedidos comprados',

        devolucion:
            'Pedidos en devolución',

        rechazado:
            'Pedidos rechazados',

        anulado:
            'Pedidos anulados'

    }

    return map[
        estadoActual.value
    ] || 'Pedidos'

})

/* =========================================
   CARGAR PEDIDOS
========================================= */

/* =========================================
   CARGAR PEDIDOS
========================================= */

async function cargarPedidos(
    estado = 'enviado'
) {

    try {

        estadoActual.value =
            estado

        const usu_id =
            getUsuId()

        if (!usu_id)
            return

        const seguridad =
            firma()

        const r =
            await axios.post(

                `${API}/Ow7y/mis_pedidos`,

                {

                    usu_id,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        let rows =
            r.data.data || []

        rows =
            rows.filter(x => {

                return String(
                    x.estado || ''
                ).trim().toLowerCase()

                    ===

                    estado.toLowerCase()

            })

        pedidos.value =
            rows

    } catch (e) {

        console.error(
            'Error cargando pedidos',
            e
        )

    }

}



onMounted(() => {

    cargarPedidos(
        'enviado'
    )

})
</script>