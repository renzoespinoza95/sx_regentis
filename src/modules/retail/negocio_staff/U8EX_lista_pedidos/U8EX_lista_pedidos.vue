<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <!-- CONTENIDO -->
        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <!-- ======================================
     📦 LISTA
====================================== -->

                <template v-if="pedidos.length">

                    <PedidoItem v-for="item in pedidos" :key="item.carrito_id" :item="item" modo="transito"
                        @clickPedido="openPedido" />

                </template>

                <!-- ======================================
                    📭 EMPTY
                ====================================== -->
                <EmptyLetter v-else titulo="No hay pedidos" texto="Cuando lleguen nuevos pedidos aparecerán aquí 😏" />


            </div>

        </div>

        <OptionsDialog ref="dialogRef" />
        <VentaDialog ref="detalleRef" @rechazar="confirmarRechazo" @entregar="onVentaRealizada" />

        <AppSnackbar ref="snackbarRef" />

    </div>

</template>

<script setup>

import {
    ref,
    computed,
    onMounted
} from 'vue'

import axios from 'axios'

import {
    useMercado
} from '../../../../services/useMercado.js'

import {
    cssToObject
} from '../../../../services/useCss.js'

import {
    useUsuario
} from '../../../../services/usuarioService.js'

import HeaderBar
    from './components/HeaderBar.vue'

import PedidoItem
    from './components/PedidoItem.vue'

import OptionsDialog
    from './components/OptionsDialog.vue'

import VentaDialog
    from '../../../../components/VentaDialog.vue'

import AppSnackbar
    from '../../../../components/layout/AppSnackbar.vue'

import EmptyLetter
    from '../../../../components/layout/EmptyLetter.vue'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const {
    mercado
} = useMercado()

const {
    getUsuId
} = useUsuario()

const pedidos = ref([])

const detalleRef = ref(null)
const snackbarRef = ref(null)

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo)
        return {}

    return cssToObject(
        mercado.value.patron_fondo
    )

})

const dialogRef = ref(null)

function openDialog() {

    dialogRef.value.open()

}

function confirmarRechazo(item) {

    snackbarRef.value?.open(

        `¿Rechazar pedido #${item.carrito_id}?`,

        async () => {

            console.log('rechazado')

        }

    )

}

function openPedido(item) {

    detalleRef.value?.open(item)

}

async function onVentaRealizada() {

    await cargarPedidos()

}

/* =========================================
   🚚 PEDIDOS DELIVERY
========================================= */

async function cargarPedidos() {

    try {

        const trab_usu_id =
            getUsuId()

        if (!trab_usu_id)
            return

        const r = await axios.post(

            `${API}/QFeC/pedidosDelivery`,

            {
                trab_usu_id
            }

        )

        pedidos.value =
            r.data.data || []

    } catch (e) {

        console.error(
            'Error cargando pedidos delivery',
            e
        )

    }

}

onMounted(() => {

    cargarPedidos()

})

</script>
<style scoped>
.letter-wrapper {

    position: relative;

    width: 100%;

    height: 340px;

    display: flex;

    justify-content: center;

    align-items: center;

}

/* =========================================
   ✉️ CARTA
========================================= */

.letter-image {

    position: relative;

    width: 200px;

    height: 200px;

}

/* =========================================
   ✉️ ANIMATED MAIL
========================================= */

.animated-mail {

    position: absolute;

    height: 150px;

    width: 200px;

    transition: .4s;

    animation:
        floatMail 3s ease-in-out infinite;

}

/* =========================================
   ✉️ BODY
========================================= */

.body {

    position: absolute;

    bottom: 0;

    width: 0;

    height: 0;

    border-style: solid;

    border-width: 0 0 100px 200px;

    border-color:
        transparent transparent #e95f55 transparent;

    z-index: 2;

}

/* =========================================
   ✉️ TOP
========================================= */

.top-fold {

    position: absolute;

    top: 50px;

    width: 0;

    height: 0;

    border-style: solid;

    border-width: 50px 100px 0 100px;

    transform-origin: 50% 0%;

    border-color:
        #cf4a43 transparent transparent transparent;

    z-index: 2;

    animation:
        openFold 5s infinite;

}

/* =========================================
   ✉️ BACK
========================================= */

.back-fold {

    position: absolute;

    bottom: 0;

    width: 200px;

    height: 100px;

    background: #cf4a43;

    z-index: 0;

}

/* =========================================
   ✉️ LEFT
========================================= */

.left-fold {

    position: absolute;

    bottom: 0;

    width: 0;

    height: 0;

    border-style: solid;

    border-width: 50px 0 50px 100px;

    border-color:
        transparent transparent transparent #e15349;

    z-index: 2;

}

/* =========================================
   ✉️ LETTER
========================================= */

.letter {

    left: 20px;

    bottom: 0;

    position: absolute;

    width: 160px;

    height: 60px;

    background: white;

    z-index: 1;

    overflow: hidden;

    border-radius: 10px;

    transition: .4s .2s;

    animation:
        openLetter 5s infinite;

}

/* =========================================
   ✉️ BORDER
========================================= */

.letter-border {

    height: 10px;

    width: 100%;

    background:
        repeating-linear-gradient(-45deg,

            #cb5a5e,
            #cb5a5e 8px,

            transparent 8px,
            transparent 18px);

}

/* =========================================
   💌 MENSAJE
========================================= */

.mensaje-box {

    padding: 14px;

    display: flex;

    flex-direction: column;

    align-items: center;

    text-align: center;

}

.emoji {

    font-size: 34px;

    margin-bottom: 8px;

}

.titulo {

    font-size: 14px;

    font-weight: 700;

    color: #374151;

}

.texto {

    margin-top: 8px;

    font-size: 11px;

    line-height: 1.4;

    color: #6b7280;

}

/* =========================================
   🌑 SHADOW
========================================= */

.shadow {

    position: absolute;

    top: 200px;

    left: 50%;

    width: 220px;

    height: 30px;

    transform: translateX(-50%);

    border-radius: 100%;

    background:
        radial-gradient(rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0));

    animation:
        shadowMove 3s ease-in-out infinite;

}

/* =========================================
   ✨ FLOAT
========================================= */

@keyframes floatMail {

    0%,
    100% {

        transform:
            translateY(0px);

    }

    50% {

        transform:
            translateY(10px);

    }

}

/* =========================================
   ✨ OPEN LETTER
========================================= */

@keyframes openLetter {

    0%,
    20% {

        height: 60px;

    }

    30%,
    70% {

        height: 180px;

    }

    100% {

        height: 60px;

    }

}

/* =========================================
   ✨ OPEN FOLD
========================================= */

@keyframes openFold {

    0%,
    20% {

        transform:
            rotateX(0deg);

        z-index: 2;

    }

    30%,
    70% {

        transform:
            rotateX(180deg);

        z-index: 0;

    }

    100% {

        transform:
            rotateX(0deg);

        z-index: 2;

    }

}

/* =========================================
   ✨ SHADOW MOVE
========================================= */

@keyframes shadowMove {

    0%,
    100% {

        transform:
            translateX(-50%) scale(1);

    }

    50% {

        transform:
            translateX(-50%) scale(0.9);

    }

}
</style>