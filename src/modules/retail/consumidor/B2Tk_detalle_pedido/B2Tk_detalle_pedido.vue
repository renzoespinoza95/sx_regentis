<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBack />

        <div class="flex-1 flex justify-center p-4">

            <div v-if="pedido" class="w-full max-w-md md:max-w-3xl bg-white rounded-2xl shadow-md p-4 space-y-4">

                <!-- NEGOCIO -->
                <div class="flex items-center gap-3">

                    <img :src="pedido.neg_logo || 'https://picsum.photos/100'"
                        class="w-16 h-16 rounded-xl object-cover border" />

                    <div class="flex-1">

                        <div class="font-semibold text-gray-800">
                            {{ pedido.neg_icono || '🏪' }}
                            {{ pedido.neg_nombre }}
                        </div>

                        <div class="text-sm text-gray-500">
                            {{ pedido.neg_puesto || 'Sin puesto' }}
                        </div>

                    </div>

                </div>

                <!-- INFO -->
                <FieldText label="Pedido" :value="'#' + pedido.carrito_id" />

                <FieldText label="Estado" :value="pedido.estado" />

                <FieldText label="Fecha entrega" :value="formatFecha(
                    pedido.fecha_entrega
                )" />

                <FieldText label="Productos" :value="String(pedido.total_productos)" />

                <!-- PRODUCTOS -->
                <div>

                    <h3 class="text-sm font-semibold mb-2">
                        Productos
                    </h3>

                    <ProductoRowView v-for="p in productos" :key="p.carrito_detalle_id" :item="p" />

                </div>

                <!-- RESUMEN -->
                <ResumenPedido :items="productos" />

                <YaplinGallery :yaplins="yaplins" />

                <!-- YAPLIN -->
                <!-- 🔥 SOLO MOSTRAR SI NO HAY YAPLINS -->
                <YaplinUploader v-if="
                    String(
                        pedido?.estado || ''
                    )
                        .trim()
                        .toLowerCase()
                    ===
                    'enviado'
                    &&
                    !yaplins.length
                " @uploaded="cargarPedido" titulo="Subir pantallas de pago Yaplin !" :carrito-id="pedido?.carrito_id
                    " />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />
        <AppChatFloat v-if="pedido" :neg-id="pedido.neg_id" :texto-mensaje="`
Hola. Quisiera información sobre mi pedido #${pedido.carrito_id}.

Estado actual:
${pedido.estado}

Muchas gracias.
`" :contexto="{
    tipo: 'pedido',

    data: {

        pedido_id: pedido.carrito_id,

        estado: pedido.estado,

        total: productos.reduce((s, p) => {
            return s + (p.precio * p.cantidad)
        }, 0),

        fecha_entrega: pedido.fecha_entrega,

        url: `/B2Tk_detalle_pedido/${pedido.carrito_id}`

    }

}" />

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import AppChatFloat from '../../../../components/layout/AppChatFloat.vue'

/* =========================================
   COMPONENTES DEL MISMO MODULO
========================================= */
import HeaderBack from '../../../../components/layout/HeaderBack.vue'
import FieldText from './components/FieldText.vue'
import ProductoRowView from './components/ProductoRowView.vue'
import ResumenPedido from './components/ResumenPedido.vue'
import OptionsDialog from './components/OptionsDialog.vue'
import YaplinUploader
    from '../../../../components/YaplinUploader.vue'
import {
    firma
}
    from '../../../../services/security.js'

import YaplinGallery
    from '../../../../components/YaplinGallery.vue'

const API = import.meta.env.VITE_PUBLIC_URL_BASE

const route = useRoute()

const { mercado } = useMercado()

const pedido = ref(null)
const productos = ref([])

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) return {}

    return cssToObject(
        mercado.value.patron_fondo
    )
})

const dialogRef = ref(null)
const yaplins = ref([])


function openDialog() {
    dialogRef.value.open()
}

function formatFecha(fecha) {

    if (!fecha)
        return 'Pendiente'

    const d =
        new Date(fecha)

    const dia =
        String(
            d.getDate()
        ).padStart(2, '0')

    const mes =
        String(
            d.getMonth() + 1
        ).padStart(2, '0')

    const anio =
        d.getFullYear()

    return `${dia}/${mes}/${anio}`

}

/* =========================================
   CARGAR PEDIDO
========================================= */
async function cargarPedido() {

    try {

        /* =========================================
           🔥 FIRMA
        ========================================= */

        const seguridad =
            firma()

        /* =========================================
           🔥 CARRITO_ID
        ========================================= */

        const carrito_id =
            Number(
                route.params.id
            )

        /* =========================================
           🔥 REQUEST
        ========================================= */

        const r =
            await axios.post(

                `${API}/N5BR/detalle_pedido`,

                {

                    carrito_id,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        /* =========================================
           🔥 PEDIDO
        ========================================= */

        pedido.value =
            r.data.pedido || null

        /* =========================================
           🔥 YAPLINS
        ========================================= */

        yaplins.value =
            r.data.yaplins || []

        /* =========================================
           🔥 PRODUCTOS
        ========================================= */

        productos.value =

            (r.data.productos || [])

                .map(p => ({

                    carrito_detalle_id:
                        p.carrito_detalle_id,

                    nombre:
                        p.name,

                    cantidad:
                        Number(
                            p.cantidad || 0
                        ),

                    unidad:
                        'und',

                    precio:
                        Number(
                            p.precio_unitario || 0
                        ),

                    img:
                        p.img,

                    subtotal:
                        p.subtotal

                }))

    } catch (e) {

        console.error(
            'Error cargando detalle pedido',
            e
        )

    }

}

onMounted(() => {
    cargarPedido()
})
</script>