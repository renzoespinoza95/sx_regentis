<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

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

                <FieldText label="Fecha entrega" :value="pedido.fecha_entrega || 'Pendiente'" />

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

                <!-- YAPLIN -->
                <ImagenUploader />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

/* =========================================
   COMPONENTES DEL MISMO MODULO
========================================= */
import HeaderBar from './components/HeaderBar.vue'
import FieldText from './components/FieldText.vue'
import ProductoRowView from './components/ProductoRowView.vue'
import ResumenPedido from './components/ResumenPedido.vue'
import OptionsDialog from './components/OptionsDialog.vue'
import ImagenUploader from './components/ImagenUploader.vue'

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

function openDialog() {
    dialogRef.value.open()
}

/* =========================================
   CARGAR PEDIDO
========================================= */
async function cargarPedido() {

    try {

        const carrito_id_encriptado =
            route.params.id

        const r = await axios.get(
            `${API}/N5BR/detalle_pedido/${encodeURIComponent(carrito_id_encriptado)}`
        )

        pedido.value = r.data.pedido || null

        productos.value = (r.data.productos || []).map(p => ({
            carrito_detalle_id: p.carrito_detalle_id,
            nombre: p.name,
            cantidad: Number(p.cantidad || 0),
            unidad: 'und',
            precio: Number(p.precio_unitario || 0),
            img: p.img,
            subtotal: p.subtotal
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