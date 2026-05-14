<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar :titulo="`Pedidos ${estadoActual}`" @openOptions="openDialog" />

        <!-- CONTENIDO -->
        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <!-- 🔍 SEARCH -->
                <div class="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3">

                    <i class="fa fa-search text-gray-400"></i>

                    <input v-model="search" type="text" placeholder="Buscar cliente..."
                        class="flex-1 outline-none text-sm bg-transparent" />

                    <!-- ❌ CLEAR -->
                    <button v-if="search"
                        class="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition flex items-center justify-center"
                        @click="search = ''">

                        <i class="fa fa-times text-xs text-gray-500"></i>

                    </button>

                </div>

                <!-- PEDIDOS -->
                <template v-if="pedidosFiltrados.length">

                    <PedidoItem v-for="p in pedidosFiltrados" :estado-actual="estadoActual" :key="p.carrito_id"
                        :item="p" />

                </template>

                <!-- EMPTY -->
                <EmptyLetter v-if="!pedidosFiltrados.length" :titulo="search
                        ? 'Sin resultados'
                        : `
No hay pedidos
${estadoActual}
`
                    " :texto="search
            ? `No encontramos clientes con:
${search} 🔎`
            : `
No existen pedidos
en estado
${estadoActual} 📦
`
        " />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" @select="onSelectEstado" />

    </div>

</template>

<script setup>
import {
    ref,
    computed,
    watch
}
    from 'vue'
import axios from 'axios'
import {
    firma
}
    from '../../../../services/security'
import { useMercado } from '../../../../services/useMercado.js'
import { useTienda } from '../../../../services/useTienda.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBar from './components/HeaderBar.vue'
import PedidoItem from './components/PedidoItem.vue'
import BtnAccion from './components/BtnAccion.vue'
import OptionsDialog from './components/OptionsDialog.vue'
import EmptyLetter
    from '../../../../components/layout/EmptyLetter.vue'

const { mercado } = useMercado()

const { data: tienda } = useTienda()

const pedidos = ref([])

const dialogRef = ref(null)
const estadoActual = ref(
    'enviado'
)
const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) return {}

    return cssToObject(mercado.value.patron_fondo)

})

const search = ref('')

const pedidosFiltrados = computed(() => {

    if (!search.value)
        return pedidos.value

    return pedidos.value.filter(p => {

        return String(
            p.cliente || ''
        )
            .toLowerCase()
            .includes(
                search.value.toLowerCase()
            )

    })

})

function openDialog() {
    dialogRef.value.open()
}

function onSelectEstado(
    estado
) {

    const neg_id =
        tienda.value?.negocio?.neg_id

    if (!neg_id)
        return

    cargarPedidos(
        neg_id,
        estado
    )

}

async function cargarPedidos(

    neg_id,

    estado = 'enviado'

) {

    try {

        estadoActual.value =
            estado

        const seguridad =
            firma()

        const r =
            await axios.post(

                `${import.meta.env.VITE_PUBLIC_URL_BASE}/nraz/lista_pedidos`,

                {

                    neg_id,

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
                )
                    .trim()
                    .toLowerCase()

                    ===

                    estado.toLowerCase()

            })

        pedidos.value =
            rows

    } catch (e) {

        console.error(e)

    }

}

/* ======================================
   🔥 ESPERAR TIENDA
====================================== */

/* ======================================
   🔥 ESPERAR TIENDA
====================================== */

watch(

    () => tienda.value?.negocio?.neg_id,

    (neg_id) => {

        if (!neg_id)
            return

        cargarPedidos(
            neg_id,
            estadoActual.value
        )

    },

    {
        immediate: true
    }

)
</script>