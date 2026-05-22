<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <!-- =========================================
🔥 HEADER FIJO
========================================= -->

        <div class="fixed top-0 left-0 right-0 z-40">

            <HeaderBar @openOptions="openDialog" />

        </div>

        <!-- ESPACIADOR -->
        <div class="h-[76px]"></div>

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

                <!-- =========================================
📅 FECHA ENTREGA PREMIUM
========================================= -->

                <div>

                    <div class="text-sm text-gray-500 mb-2">

                        Fecha entrega

                    </div>

                    <button @click="calendarRef?.open(fechaEntrega)"
                        class="w-full h-14 rounded-2xl border border-gray-200 bg-white px-4 flex items-center justify-between active:scale-[0.99] transition">

                        <!-- LEFT -->
                        <div class="flex items-center gap-3">

                            <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">

                                <i class="fa fa-calendar text-[#FD7635]"></i>

                            </div>

                            <div class="text-left">

                                <div class="text-xs text-gray-400">
                                    Fecha de entrega
                                </div>

                                <div class="text-sm font-semibold text-gray-800">

                                    {{
                                        fechaEntregaTexto
                                    }}

                                </div>

                            </div>

                        </div>

                        <!-- RIGHT -->
                        <i class="fa fa-chevron-right text-gray-300"></i>

                    </button>

                </div>

                <DialogCalendario ref="calendarRef" @selected="onFechaSeleccionada" />

                <!-- =========================================
👷 TRABAJADOR PREMIUM
========================================= -->

                <div>

                    <div class="text-sm text-gray-500 mb-2">

                        Trabajador asignado

                    </div>

                    <button @click="abrirTrabajadores"
                        class="w-full h-16 rounded-2xl border border-gray-200 bg-white px-4 flex items-center justify-between active:scale-[0.99] transition">

                        <!-- LEFT -->
                        <div class="flex items-center gap-3">

                            <!-- FOTO -->
                            <img :src="trabajador?.img || 'https://picsum.photos/100'"
                                class="w-11 h-11 rounded-full object-cover border" />

                            <!-- INFO -->
                            <div class="text-left">

                                <div class="text-xs text-gray-400">

                                    Trabajador

                                </div>

                                <div class="text-sm font-semibold text-gray-800">

                                    {{
                                        trabajador?.nombre
                                        || 'Seleccionar trabajador'
                                    }}

                                </div>

                            </div>

                        </div>

                        <!-- RIGHT -->
                        <i class="fa fa-chevron-right text-gray-300"></i>

                    </button>

                </div>

                <!-- =========================================
💸 YAPLINS
========================================= -->

                <YaplinGallery v-if="
                    yaplins.length
                " :yaplins="yaplins
                    " />



                <FieldText label="Productos" :value="String(pedido.total_productos)" />

                <!-- PRODUCTOS -->
                <div>

                    <h3 class="text-sm font-semibold mb-2">
                        Productos
                    </h3>

                    <ProductoRowView v-for="p in productos" :key="p.carrito_detalle_id" :item="p"
                        @delete="eliminarProducto" @update="actualizarCantidad" />

                </div>

                <!-- RESUMEN -->
                <ResumenPedido :items="productos" />

                <BtnDespachar v-if="

                    pedido?.estado
                    !== 'comprado'

                    &&

                    pedido?.estado
                    !== 'devolucion'

                    &&

                    pedido?.estado
                    !== 'rechazado'

                    &&

                    pedido?.estado
                    !== 'anulado'

                " :carrito-id="pedido.carrito_id" :neg-id="pedido.neg_id" :usu-id="trabajador?.usu_id || 0"
                    :direccion="pedido.direccion" :fecha-entrega="fechaEntrega" :trabajador-seleccionado="!!trabajador"
                    @success="onDespachado" />

            </div>

        </div>

        <!-- DIALOGS -->
        <OptionsDialog ref="dialogRef" :estado="pedido?.estado
            " @eliminar="confirmarEliminar" @atender="abrirVentaDialog" />

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
import DialogCalendario
    from '../../negocio_admin/PM1N_ag_pedido/components/CalendarDialog.vue'

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
import YaplinGallery
    from '../../../../components/YaplinGallery.vue'

import {
    firma
}
    from '../../../../services/security.js'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const route = useRoute()

const { mercado } = useMercado()

const pedido = ref(null)
const productos = ref([])

const fechaEntrega = ref('')
const detalleRef = ref(null)
const trabajador = ref(null)
const yaplins =
    ref([])

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

const calendarRef =
    ref(null)

const fechaEntregaTexto =
    computed(() => {

        if (!fechaEntrega.value) {

            return 'Seleccionar fecha'

        }

        return fechaEntrega.value
            .split('-')
            .reverse()
            .join('/')

    })

function onFechaSeleccionada(fecha) {

    fechaEntrega.value =
        fecha

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

        /* =========================================
        🔥 YAPLINS
        ========================================= */

        yaplins.value =
            r.data?.yaplins || []

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

function eliminarProducto(item) {

    productos.value =
        productos.value.filter(

            x =>

                x.carrito_detalle_id
                !==
                item.carrito_detalle_id

        )

}

function actualizarCantidad(data) {

    const item =
        productos.value.find(

            x =>

                x.carrito_detalle_id
                ===
                data.item.carrito_detalle_id

        )

    if (!item) return

    item.cantidad =
        data.cantidad

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