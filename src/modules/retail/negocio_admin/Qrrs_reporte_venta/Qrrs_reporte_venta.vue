<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar :titulo="tituloHeader" @openOptions="openDialog" />

        <!-- CONTENIDO -->
        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <FiltroFechaPills v-if="esVentas" v-model="filtroFecha" />

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

                <!-- 💳 TIPOS PAGO -->
                <TipoPagoPills v-if="esVentas" v-model="tipoPagoSeleccionado" />

                <!-- PEDIDOS -->
                <template v-if="pedidosFiltrados.length">

                    <template v-for="p in pedidosFiltrados" :key="esVentas
                        ? p.product_order_id
                        : p.carrito_id
                        ">

                        <!-- DELIVERY -->
                        <PedidoItem v-if="!esVentas" :estado-actual="estadoActual" :item="p" />

                        <!-- VENTAS -->
                        <VentaItem v-else :item="p" @detalle="openVentaDetalle" />

                    </template>

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

        <button class="
        fixed
        bottom-[90px]
        right-5
        z-40
        w-14
        h-14
        rounded-full
        bg-green-500
        text-white
        shadow-xl
        flex
        items-center
        justify-center
        active:scale-95
    " @click="scrollTop">

            <i class="
            fa
            fa-arrow-up
            text-xl
        "></i>

        </button>

        <OptionsDialog ref="dialogRef" @select="onSelectEstado" />
        <VentaDetalleDialog ref="ventaDetalleDialogRef" />
        <ResumenVentasDialog ref="resumenDialogRef" />
        <PdfVentasDialog ref="pdfDialogRef" />

    </div>

</template>

<script setup>
import {
    ref,
    computed,
    onMounted,
    watch
}
    from 'vue'
import axios from 'axios'
import VentaItem
    from './components/VentaItem.vue'
import {
    firma
}
    from '../../../../services/security'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import VentaDetalleDialog
    from './components/VentaDetalleDialog.vue'

import HeaderBar from './components/HeaderBar.vue'
import PedidoItem from './components/PedidoItem.vue'
import {
    useUsuario
}
    from '../../../../services/usuarioService.js'
import OptionsDialog from './components/OptionsDialog.vue'
import EmptyLetter
    from '../../../../components/layout/EmptyLetter.vue'

import TipoPagoPills
    from './components/TipoPagoPills.vue'

import FiltroFechaPills
    from './components/FiltroFechaPills.vue'

import ResumenVentasDialog
    from './components/ResumenVentasDialog.vue'

import PdfVentasDialog
    from './components/PdfVentasDialog.vue'

const { mercado } = useMercado()

const pedidos = ref([])

const dialogRef = ref(null)

const filtroFecha =
    ref('HOY')

const resumenDialogRef =
    ref(null)

const pdfDialogRef =
    ref(null)

function formatDate(
    fecha
) {

    const y =
        fecha.getFullYear()

    const m =
        String(
            fecha.getMonth() + 1
        ).padStart(2, '0')

    const d =
        String(
            fecha.getDate()
        ).padStart(2, '0')

    return `${y}-${m}-${d}`

}

function obtenerRangoFechas() {

    const hoy =
        new Date()

    let inicio =
        new Date()

    let fin =
        new Date()

    switch (
    filtroFecha.value
    ) {

        case 'AYER':

            inicio.setDate(
                hoy.getDate() - 1
            )

            fin.setDate(
                hoy.getDate() - 1
            )

            break

        case '7DIAS':

            inicio.setDate(
                hoy.getDate() - 6
            )

            break

        case 'MES':

            inicio =
                new Date(
                    hoy.getFullYear(),
                    hoy.getMonth(),
                    1
                )

            fin =
                new Date(
                    hoy.getFullYear(),
                    hoy.getMonth() + 1,
                    0
                )

            break

    }

    return {

        fecha_inicio:
            formatDate(inicio),

        fecha_termino:
            formatDate(fin)

    }

}

const tituloHeader =
    computed(() => {

        const estado =

            String(
                estadoActual.value || ''
            )

                .toLowerCase()

        if (
            estado === 'enviado'
        ) {

            return '📦 Pedidos'

        }

        if (
            estado === 'transito'
        ) {

            return '🚚 Tránsito'

        }

        if (
            estado === 'comprado'
        ) {

            return '🛒 Ventas'

        }

        if (
            estado === 'devolucion'
        ) {

            return '↩️ Devoluciones'

        }

        if (
            estado === 'rechazado'
        ) {

            return '❌ Rechazados'

        }

        if (
            estado === 'anulado'
        ) {

            return '🚫 Anulados'

        }

        return 'Pedidos'

    })

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) return {}

    return cssToObject(mercado.value.patron_fondo)

})

const {

    getNegId,
    getTipoxusuId

} = useUsuario()


const ventaDetalleDialogRef =
    ref(null)
const search = ref('')
const esVentas =
    ref(false)

const tipoPagoSeleccionado =
    ref(null)

const pedidosFiltrados =
    computed(() => {

        let rows =
            [...pedidos.value]

        /* ======================================
           🔎 SEARCH
        ====================================== */

        if (search.value) {

            rows =
                rows.filter(p => {

                    return String(

                        p.cliente
                        ||
                        p.cliente_nombre
                        ||
                        ''

                    )

                        .toLowerCase()

                        .includes(

                            search.value.toLowerCase()

                        )

                })

        }

        /* ======================================
           💳 TIPO PAGO
        ====================================== */

        if (
            esVentas.value
            &&
            tipoPagoSeleccionado.value
        ) {

            rows =
                rows.filter(p => {

                    return String(

                        p.tipo_pago
                        || ''

                    )

                        .trim()

                        .toUpperCase()

                        ===

                        tipoPagoSeleccionado.value

                })

        }

        return rows

    })

const esDelivery =
    computed(() => {

        return Number(
            getTipoxusuId()
        ) === 4

    })

const estadoActual = ref(
    'comprado'
)



function openDialog() {
    dialogRef.value.open()
}

watch(

    filtroFecha,

    () => {

        const neg_id =
            getNegId()

        if (!neg_id) {

            return

        }

        if (
            esVentas.value
        ) {

            cargarVentas(
                neg_id
            )

        }

    }

)

function openVentaDetalle(
    venta
) {

    ventaDetalleDialogRef.value?.open(
        venta
    )

}

function scrollTop() {

    window.scrollTo({

        top: 0,

        behavior: 'smooth'

    })

}

tipoPagoSeleccionado.value =
    null

function onSelectEstado(
    estado
) {

    const neg_id =
        getNegId()

    if (!neg_id) {

        return

    }

    if (
        estado === 'resumen'
    ) {

        resumenDialogRef
            .value
            ?.open(
                neg_id
            )

        return

    }

    if (
        estado === 'pdf'
    ) {

        pdfDialogRef
            .value
            ?.open()

        return

    }

}

/* ======================================
   💰 VENTAS
====================================== */

async function cargarVentas(
    neg_id
) {

    try {

        esVentas.value =
            true

        estadoActual.value =
            'comprado'

        const seguridad =
            firma()

        const rango =
            obtenerRangoFechas()

        const r =
            await axios.post(

                `${import.meta.env.VITE_PUBLIC_URL_BASE}/HOGO/listaVentas`,

                {

                    neg_id,

                    fecha_inicio:
                        rango.fecha_inicio,

                    fecha_termino:
                        rango.fecha_termino,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        pedidos.value =
            r.data.ventas || []

    } catch (e) {

        console.error(e)

    }

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

onMounted(() => {

    /* ======================================
       🏪 NEGOCIO
    ====================================== */

    const neg_id =
        getNegId()

    if (!neg_id) {

        console.warn(
            'No existe neg_id'
        )

        return

    }

    /* ======================================
       🚀 CARGAR
    ====================================== */

    cargarVentas(
        neg_id
    )

})

</script>