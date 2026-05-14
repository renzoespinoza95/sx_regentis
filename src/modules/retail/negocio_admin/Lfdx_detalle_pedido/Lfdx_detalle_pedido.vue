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

                <FieldText label="Cliente" :value="pedido.nombres_apellidos || 'Sin nombre'" />

                <FieldText label="Celular" :value="pedido.celular || 'Sin celular'" />

                <FieldText label="Estado" :value="pedido.estado" />

                <!-- FECHA ENTREGA -->
                <div>

                    <div class="text-sm text-gray-500 mb-1">
                        Fecha entrega
                    </div>

                    <input v-model="fechaEntrega" type="date"
                        class="w-full border rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-orange-300" />

                </div>

                <!-- TRABAJADOR -->
                <div>

                    <div class="text-sm text-gray-500 mb-1">
                        Trabajador asignado
                    </div>

                    <div class="flex gap-2">

                        <input :value="trabajadorNombre" readonly placeholder="Seleccionar trabajador"
                            class="flex-1 border rounded-xl px-3 py-3 bg-gray-50 outline-none" />

                        <button @click="abrirTrabajadores" class="px-4 rounded-xl text-white font-semibold"
                            :style="{ background: mercado.topnavbar_color || '#FD7635' }">

                            <i class="fa fa-search"></i>

                        </button>

                    </div>

                </div>

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

                <BtnDespachar v-if="!eliminado" :carrito-id="pedido.carrito_id" :neg-id="pedido.neg_id"
                    :usu-id="trabajador?.usu_id || 0" :direccion="pedido.direccion" :fecha-entrega="fechaEntrega"
                    :trabajador-seleccionado="!!trabajador" @success="onDespachado" />

            </div>

        </div>

        <!-- DIALOGS -->
        <OptionsDialog ref="dialogRef" @eliminar="confirmarEliminar" @atender="abrirVentaDialog" />

        <TrabajadorDialog ref="trabajadorDialogRef" :neg-id="pedido?.neg_id" @selected="onTrabajadorSelected" />
        <AppSnackbar ref="snackbarRef" />

        <GsapToast ref="toastRef" />
        <VentaDialog ref="detalleRef" @rechazar="confirmarRechazo" @entregar="onVentaRealizada" />
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBar from './components/HeaderBar.vue'
import FieldText from './components/FieldText.vue'
import ProductoRowView from './components/ProductoRowView.vue'
import ResumenPedido from './components/ResumenPedido.vue'
import OptionsDialog from './components/OptionsDialog.vue'
import ImagenUploader from './components/ImagenUploader.vue'
import TrabajadorDialog from './components/TrabajadorDialog.vue'
import BtnDespachar from './components/BtnDespachar.vue'
import AppSnackbar from '../../../../components/layout/AppSnackbar.vue'
import GsapToast from '../../../../components/layout/GsapToast.vue'
import VentaDialog
    from '../../../../components/VentaDialog.vue'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const route = useRoute()

const { mercado } = useMercado()

const pedido = ref(null)
const productos = ref([])

const fechaEntrega = ref('')
const detalleRef = ref(null)
const trabajador = ref(null)

const trabajadorNombre = computed(() => {

    if (!trabajador.value) return ''

    return trabajador.value.nombre
})

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) return {}

    return cssToObject(
        mercado.value.patron_fondo
    )
})

const dialogRef = ref(null)
const snackbarRef = ref(null)
const toastRef = ref(null)

const eliminado = ref(false)

function openDialog() {
    dialogRef.value.open()
}

const trabajadorDialogRef = ref(null)

function abrirTrabajadores() {

    trabajadorDialogRef.value.open()
}

function onTrabajadorSelected(item) {

    trabajador.value = item
}

function onVentaRealizada(data) {

    console.log(
        'Venta realizada',
        data
    )

    toastRef.value?.show({

        text:
            'Venta realizada correctamente',

        type:
            'success'
    })

}

function confirmarRechazo(data) {

    console.log(
        'Pedido rechazado',
        data
    )

    toastRef.value?.show({

        text:
            'Pedido rechazado',

        type:
            'error'
    })

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

        pedido.value =
            r.data.pedido || null

        if (pedido.value?.fecha_entrega) {

            fechaEntrega.value =
                pedido.value.fecha_entrega.substring(0, 10)

        } else {

            fechaEntrega.value = ''
        }

        productos.value =
            (r.data.productos || []).map(p => ({

                carrito_detalle_id:
                    p.carrito_detalle_id,

                name:
                    p.name,

                cantidad:
                    Number(p.cantidad || 0),

                unidad:
                    'und',

                precio_unitario:
                    Number(p.precio_unitario || 0),

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

function onDespachado(r) {

    console.log(
        'Despachado',
        r
    )

    pedido.value.estado =
        'transito'
}

function confirmarEliminar() {

    snackbarRef.value?.open(

        '¿Deseas eliminar este pedido?',

        async () => {

            await eliminarPedido()

        }

    )

}

async function eliminarPedido() {

    try {

        await axios.post(
            `${API}/FVhB/eliminarPedido`,
            {
                carrito_id: pedido.value.carrito_id
            }
        )

        eliminado.value = true

        toastRef.value?.show({

            text: 'Pedido eliminado correctamente',

            type: 'success'

        })

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text: 'Error eliminando pedido',

            type: 'error'

        })

    }

}

function abrirVentaDialog() {

    detalleRef.value?.open({

        carrito_id:
            pedido.value.carrito_id,

        neg_id:
            pedido.value.neg_id,

        cliente:
            pedido.value.nombres_apellidos,

        celular:
            pedido.value.celular,

        productos:
            productos.value,

        total:
            productos.value.reduce((a, b) => {

                return a + (
                    b.precio * b.cantidad
                )

            }, 0)

    })

}

</script>