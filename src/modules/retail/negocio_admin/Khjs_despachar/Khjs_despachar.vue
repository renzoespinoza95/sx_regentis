<template>

    <HeaderBar @openOptions="openDialog" />

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

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
                <FieldText label="Cliente" :value="pedido.nombres_apellidos
                    ||
                    pedido.sobrenombre
                    ||
                    'Sin nombre'
                    " />

                <FieldText label="Estado" :value="pedido.estado" />

                <FieldText label="Fecha entrega" :value="formatFecha(
                    pedido.fecha_entrega
                )" />

                <FieldText label="Productos" :value="String(
                    pedido.total_productos
                )" />

                <!-- PRODUCTOS -->
                <div>

                    <h3 class="text-sm font-semibold mb-2">

                        Productos

                    </h3>

                    <ProductoRowView v-for="p in productos" :key="p.carrito_detalle_id" :item="p" />

                </div>

                <!-- RESUMEN -->
                <ResumenPedido :items="productos" />

                <TipoPagoSelector v-model="tipoPagoId" />

                <!-- YAPLINS -->
                <YaplinGallery :yaplins="yaplins" />

                <!-- SUBIR -->
                <YaplinUploader v-if="
                    String(
                        pedido?.estado || ''
                    )
                        .trim()
                        .toLowerCase()
                    ===
                    'transito'
                " titulo="Subir pantallas de pago Yaplin !" :carrito-id="pedido?.carrito_id
                    " />

                <FooterAcciones @rechazar="rechazar" @entregar="entregar" />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

        <GsapToast ref="toastRef" />

        <AppSnackbar ref="snackbarRef" />

        <AppLoader :show="loading || loadingYaplin" />

    </div>

</template>
<script setup>

import AppLoader
    from '../../../../components/layout/AppLoader.vue'

import GsapToast
    from '../../../../components/layout/GsapToast.vue'

import AppSnackbar
    from '../../../../components/layout/AppSnackbar.vue'

import {
    ref,
    computed,
    onMounted
}
    from 'vue'

import axios
    from 'axios'

import {
    useRoute,
    useRouter
}
    from 'vue-router'

import {
    useMercado
}
    from '../../../../services/useMercado.js'

import {
    cssToObject
}
    from '../../../../services/useCss.js'

import {
    firma
}
    from '../../../../services/security.js'

import {
    useUsuario
}
    from '../../../../services/usuarioService.js'

/* =========================================
   COMPONENTES
========================================= */

import TipoPagoSelector
    from './components/TipoPagoSelector.vue'

import FooterAcciones
    from './components/FooterAcciones.vue'

import HeaderBar
    from './components/HeaderBar.vue'

import FieldText
    from './components/FieldText.vue'

import ProductoRowView
    from './components/ProductoRowView.vue'

import ResumenPedido
    from './components/ResumenPedido.vue'

import OptionsDialog
    from './components/OptionsDialog.vue'

import YaplinUploader
    from '../../../../components/YaplinUploader.vue'

import YaplinGallery
    from './components/YaplinGallery.vue'

/* =========================================
   API
========================================= */

const API =
    import.meta.env
        .VITE_PUBLIC_URL_BASE

/* =========================================
   ROUTER
========================================= */

const route =
    useRoute()

const router =
    useRouter()

const carrito_id =
    Number(
        route.params.carrito_id
    )

/* =========================================
   SERVICIOS
========================================= */

const {
    mercado
} =
    useMercado()

const {
    getUsuId
} =
    useUsuario()

/* =========================================
   STATE
========================================= */

const tipoPagoId =
    ref('EFECTIVO')

const snackbarRef =
    ref(null)

const toastRef =
    ref(null)

const loading =
    ref(false)

const loadingYaplin =
    ref(false)

const yaplinId =
    ref(null)

const pedido =
    ref(null)

const productos =
    ref([])

const yaplins =
    ref([])

const dialogRef =
    ref(null)

const filePago =
    ref(null)

/* =========================================
   FONDO
========================================= */

const fondoStyle =
    computed(() => {

        if (

            !mercado.value
                ?.patron_fondo

        ) {

            return {}

        }

        return cssToObject(

            mercado.value
                .patron_fondo

        )

    })

/* =========================================
   DIALOG
========================================= */

function openDialog() {

    dialogRef.value?.open()

}

/* =========================================
   FECHA
========================================= */

function formatFecha(fecha) {

    if (!fecha) {

        return 'Pendiente'

    }

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

    return `
        ${dia}/${mes}/${anio}
    `

}

/* =========================================
   FILE PAGO
========================================= */

function onFilePago(file) {

    filePago.value = file

}

/* =========================================
   RECHAZAR
========================================= */

function rechazar() {

    snackbarRef.value?.open(

        '¿Deseas rechazar este pedido?',

        async () => {

            try {

                loading.value =
                    true

                /* =========================================
                   FIRMA
                ========================================= */

                const seguridad =
                    firma()

                /* =========================================
                   REQUEST
                ========================================= */

                const r =
                    await axios.post(

                        `${API}/ULx3/rechazarPedido`,

                        {

                            carrito_id:
                                pedido.value.carrito_id,

                            xin:
                                seguridad.xin,

                            yuan:
                                seguridad.yuan

                        }

                    )

                /* =========================================
                   ESTADO LOCAL
                ========================================= */

                if (
                    pedido.value
                ) {

                    pedido.value.estado =
                        'rechazado'

                }

                /* =========================================
                   TOAST
                ========================================= */

                toastRef.value?.show({

                    text:
                        r.data?.msg
                        ||
                        'Pedido rechazado',

                    type:
                        'success'

                })

                /* =========================================
                   REDIRECT
                ========================================= */

                setTimeout(() => {

                    router.push(
                        '/nraz_lista_pedidos'
                    )

                }, 3000)

            } catch (e) {

                console.error(e)

                toastRef.value?.show({

                    text:
                        e?.response?.data?.msg
                        ||
                        'Error rechazando pedido',

                    type:
                        'error'

                })

            } finally {

                loading.value =
                    false

            }

        }

    )

}

/* =========================================
   ENTREGAR
========================================= */

async function entregar() {

    try {

        loading.value =
            true

        /* =========================================
           FIRMA
        ========================================= */

        const seguridad =
            firma()

        /* =========================================
           REQUEST
        ========================================= */

        const r =
            await axios.post(

                `${API}/YCTK/registrarVenta`,

                {

                    carrito_id:
                        pedido.value.carrito_id,

                    tipo_pago:
                        tipoPagoId.value,

                    usu_id_vendedor:
                        getUsuId(),

                    yaplin_id:
                        yaplinId.value,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        /* =========================================
           ESTADO LOCAL
        ========================================= */

        if (
            pedido.value
        ) {

            pedido.value.estado =
                'comprado'

        }

        /* =========================================
           TOAST
        ========================================= */

        toastRef.value?.show({

            text:
                r.data?.msg
                ||
                'Venta realizada correctamente',

            type:
                'success'

        })

        /* =========================================
           REDIRECT
        ========================================= */

        setTimeout(() => {

            router.push(
                '/u8ex_lista_pedidos'
            )

        }, 3000)

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                e?.response?.data?.msg
                ||
                'Error registrando venta',

            type:
                'error'

        })

    } finally {

        loading.value =
            false

    }

}

/* =========================================
   CARGAR PEDIDO
========================================= */

async function cargarPedido() {

    try {

        loading.value =
            true

        /* =========================================
           FIRMA
        ========================================= */

        const seguridad =
            firma()

        /* =========================================
           REQUEST
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
           PEDIDO
        ========================================= */

        pedido.value =
            r.data?.pedido || null

        /* =========================================
           YAPLINS
        ========================================= */

        yaplins.value =
            r.data?.yaplins || []

        /* =========================================
           PRODUCTOS
        ========================================= */

        productos.value =

            (
                r.data?.productos || []
            )

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
            'Error cargando pedido',
            e
        )

        toastRef.value?.show({

            text:
                'Error cargando pedido',

            type:
                'error'

        })

    } finally {

        loading.value =
            false

    }

}

/* =========================================
   INIT
========================================= */

onMounted(async () => {

    await cargarPedido()

})

</script>