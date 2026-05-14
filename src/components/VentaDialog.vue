<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

        <div ref="box" class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">

            <!-- HEADER -->
            <div class="p-4 border-b flex justify-between items-start gap-3">

                <!-- INFO -->
                <div class="min-w-0">

                    <div class="font-bold text-gray-800">
                        Pedido #{{ pedido?.carrito_id }}
                    </div>

                    <div class="text-xs text-gray-500 mt-1 line-clamp-2">
                        <i>Los producto y Metodos de pagos se pueden deslizar</i>
                    </div>

                </div>

                <!-- CERRAR -->
                <button
                    class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 active:scale-95 transition"
                    @click="close">

                    <i class="fa fa-times text-gray-500"></i>

                </button>

            </div>

            <!-- PRODUCTOS -->
            <div v-if="mostrarProductos" ref="productosRef"
                class="max-h-[320px] overflow-y-auto p-4 space-y-3 custom-scroll">

                <div v-for="p in pedido?.productos || []" :key="p.carrito_detalle_id"
                    class="relative overflow-hidden rounded-2xl">

                    <!-- ACTIONS -->
                    <div class="absolute inset-y-0 right-0 flex z-0">

                        <!-- CHECK -->
                        <button class="w-16 bg-green-500 flex items-center justify-center text-white"
                            @click="marcarProducto(p, 'ok')">

                            <i class="fa fa-check text-xl"></i>

                        </button>

                        <!-- ERROR -->
                        <button class="w-16 bg-red-500 flex items-center justify-center text-white"
                            @click="marcarProducto(p, 'error')">

                            <i class="fa fa-times text-xl"></i>

                        </button>

                    </div>

                    <!-- CARD -->
                    <div class="relative z-10 flex gap-3 items-center p-2 transition-transform duration-300" :class="{

                        'translate-x-[-128px]':
                            p.openActions,

                        'bg-green-300':
                            p.estado_revision === 'ok',

                        'bg-red-300':
                            p.estado_revision === 'error',

                        'bg-white':
                            !p.estado_revision

                    }" @touchstart="touchStart($event, p)" @touchmove="touchMove($event, p)" @touchend="touchEnd(p)">

                        <!-- IMG -->
                        <img :src="p.img || 'https://picsum.photos/100'" class="w-14 h-14 rounded-xl object-cover" />

                        <!-- INFO -->
                        <div class="flex-1 min-w-0">

                            <div class="text-sm font-semibold text-gray-800 line-clamp-2">

                                {{ p.name }}

                            </div>

                            <div class="text-xs text-gray-500 mt-1">

                                x{{ p.cantidad }}

                            </div>

                        </div>

                        <!-- PRECIO -->
                        <div class="text-sm font-bold text-gray-800">

                            S/
                            {{
                                Number(
                                    p.precio_unitario || 0
                                ).toFixed(2)
                            }}

                        </div>

                    </div>

                </div>

            </div>

            <!-- ======================================
                👁 VER PRODUCTOS
            ====================================== -->

            <div v-if="!mostrarProductos" ref="btnVerRef" class="px-4 pb-3 flex justify-center">

                <button
                    class="btn-ver-productos relative overflow-hidden h-10 px-5 rounded-full text-white text-xs font-semibold active:scale-95 transition shadow-xl"
                    @click="volverProductos">

                    <span class="relative z-10">

                        👁 Ver productos

                    </span>

                    <!-- BRILLO -->
                    <span class="shine"></span>

                </button>

            </div>

            <!-- ======================================
        💳 TIPO PAGO
    ====================================== -->
            <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">

                <!-- EFECTIVO -->
                <button
                    class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                    :class="tipoPagoId == 1
                        ? 'bg-green-500 border-green-500 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 1">

                    💵 EFECTIVO

                </button>

                <!-- YAPE -->
                <button
                    class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                    :class="tipoPagoId == 2
                        ? 'bg-purple-500 border-purple-500 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 2">

                    📱 YAPE

                </button>

                <!-- PLIN -->
                <button
                    class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                    :class="tipoPagoId == 3
                        ? 'bg-fuchsia-500 border-fuchsia-500 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 3">

                    🟣 PLIN

                </button>

                <!-- TARJETA -->
                <button
                    class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                    :class="tipoPagoId == 4
                        ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 4">

                    💳 TARJETA

                </button>

                <!-- CREDITO -->
                <button
                    class="shrink-0 px-4 h-10 rounded-full border text-xs font-semibold transition-all duration-200 active:scale-95"
                    :class="tipoPagoId == 5
                        ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 5">

                    🧾 CRÉDITO

                </button>

            </div>

            <!-- ======================================
                📸 SUBIR CAPTURA
            ====================================== -->

            <div v-if="tipoPagoId == 2 || tipoPagoId == 3" class="mt-4">

                <!-- LABEL -->
                <div class="text-sm font-semibold text-gray-700 mb-3">

                    Subir captura de pago

                </div>

                <!-- PREVIEW -->
                <div v-if="previewPago"
                    class="relative w-full h-48 rounded-3xl overflow-hidden shadow-lg border border-gray-200">

                    <img :src="previewPago" class="w-full h-full object-cover" />

                    <!-- CAMBIAR -->
                    <button
                        class="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur active:scale-95 transition"
                        @click="openPicker">

                        <i class="fa fa-camera"></i>

                    </button>

                </div>

                <!-- EMPTY -->
                <button v-else
                    class="w-full h-44 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition"
                    @click="openPicker">

                    <!-- ICON -->
                    <div
                        class="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center shadow-xl">

                        <i class="fa fa-camera text-3xl"></i>

                    </div>

                    <!-- TEXT -->
                    <div class="text-sm font-semibold text-gray-700">
                        Subir captura
                    </div>

                    <div class="text-xs text-gray-400">
                        Yape o Plin
                    </div>

                </button>

                <!-- INPUT -->
                <input ref="inputPago" type="file" accept="image/*" class="hidden" @change="onFilePago" />

            </div>


            <!-- FOOTER -->
            <div class="grid grid-cols-2 gap-0 border-t">

                <!-- RECHAZAR -->
                <button class="h-14 bg-red-500 text-white font-bold active:scale-95 transition" @click="rechazar">

                    Rechazar

                </button>

                <!-- ENTREGAR -->
                <button class="h-14 bg-green-500 text-white font-bold active:scale-95 transition" @click="entregar">

                    Entregar

                </button>

            </div>

        </div>

    </div>

    <GsapToast ref="toastRef" />
    <AppSnackbar ref="snackbarRef" />
    <AppLoader :show="loadingYaplin" />

</template>

<script setup>

import {
    ref,
    nextTick,
    watch
} from 'vue'

import gsap from 'gsap'
import axios from 'axios'
import AppLoader
    from '../components/layout/AppLoader.vue'
import GsapToast
    from '../components/layout/GsapToast.vue'
import AppSnackbar
    from '../components/layout/AppSnackbar.vue'

const emit = defineEmits([
    'rechazar',
    'entregar'
])
const API =
    import.meta.env.VITE_PUBLIC_URL_BASE
const tipoPagoId = ref(1)

const loadingYaplin = ref(false)

const visible = ref(false)

const pedido = ref(null)

const box = ref(null)
const snackbarRef = ref(null)
const inputPago = ref(null)

const filePago = ref(null)

const previewPago = ref('')
const loading = ref(false)
const yaplinId = ref(null)
const toastRef = ref(null)

const mostrarProductos = ref(true)

const productosRef = ref(null)

const btnVerRef = ref(null)

const FLASK =
    import.meta.env.VITE_PUBLIC_URL_FLASK
let startX = 0

function openPicker() {

    inputPago.value?.click()

}

async function onFilePago(e) {

    try {

        loadingYaplin.value = true

        const file =
            e.target.files?.[0]

        if (!file) return

        /* =========================================
           🖼️ LEER IMAGEN
        ========================================= */

        const img =
            new Image()

        const reader =
            new FileReader()

        reader.onload = () => {

            img.src = reader.result

        }

        img.onload = async () => {

            /* =========================================
               📐 REDIMENSIONAR
            ========================================= */

            const canvas =
                document.createElement('canvas')

            const ctx =
                canvas.getContext('2d')

            const MAX_WIDTH = 800

            let width =
                img.width

            let height =
                img.height

            if (width > MAX_WIDTH) {

                height =
                    height * (MAX_WIDTH / width)

                width =
                    MAX_WIDTH

            }

            canvas.width = width
            canvas.height = height

            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            )

            /* =========================================
               JPG QUALITY 70
            ========================================= */

            const blob = await new Promise(resolve => {

                canvas.toBlob(

                    resolve,

                    'image/jpeg',

                    0.7

                )

            })

            /* =========================================
               PREVIEW
            ========================================= */

            previewPago.value =
                URL.createObjectURL(blob)

            /* =========================================
               FORM DATA
            ========================================= */

            const formData =
                new FormData()

            formData.append(

                'imagen',

                blob,

                'voucher.jpg'

            )

            /* =========================================
               🚀 ENVIAR A FLASK
            ========================================= */

            const r = await axios.post(

                `${FLASK}/tk_yaplin`,

                formData,

                {

                    headers: {

                        'Content-Type':
                            'multipart/form-data'

                    }

                }

            )

            /* =========================================
   🚀 RESPONSE INICIAL
========================================= */

            console.log(
                '🚀 JOB CREADO:',
                r.data
            )

            const job_id =
                r.data.job_id

            if (!job_id) {

                loadingYaplin.value = false

                /* =========================================
                   ❌ ERROR OCR
                ========================================= */

                if (
                    rr.data?.result?.ok === false
                ) {

                    toastRef.value?.show({

                        text:
                            rr.data?.result?.error
                            ||
                            'No se pudo procesar el voucher',

                        type:
                            'error'

                    })

                    return

                }

                /* =========================================
                   ✅ EXITO
                ========================================= */

                /* =========================================
                🖼️ URL FINAL
                ========================================= */

                yaplinId.value =
                    rr.data?.result?.regentis?.yaplin_id
                    || null

                toastRef.value?.show({

                    text:
                        rr.data?.result?.regentis?.msg
                        ||
                        'Voucher procesado correctamente',

                    type:
                        'success'

                })

                console.log(
                    '✅ RESULTADO FINAL',
                    rr.data
                )

                return

            }

            /* =========================================
               🔄 POLLING
            ========================================= */

            let intentos = 0

            const MAX_INTENTOS = 60

            const interval = setInterval(

                async () => {

                    try {

                        intentos++

                        console.log(
                            `🔄 Polling ${intentos}`
                        )

                        const rr = await axios.get(

                            `${FLASK}/jobs/result`,

                            {

                                params: {

                                    job_id

                                }

                            }

                        )

                        console.log(
                            '📦 POLLING RESPONSE:',
                            rr.data
                        )

                        /* =========================================
                           ⏳ AUN PROCESANDO
                        ========================================= */

                        if (
                            rr.data.status === 'queued'
                            ||
                            rr.data.status === 'started'
                        ) {

                            return

                        }

                        /* =========================================
                           ✅ TERMINADO
                        ========================================= */

                        clearInterval(interval)

                        loadingYaplin.value = false

                        /* =========================================
                           ❌ ERROR OCR
                        ========================================= */

                        if (
                            rr.data?.result?.ok === false
                        ) {

                            toastRef.value?.show({

                                text:
                                    rr.data?.result?.error
                                    ||
                                    'No se pudo procesar el voucher',

                                type:
                                    'error'

                            })

                            return

                        }

                        /* =========================================
                           ✅ EXITO
                        ========================================= */

                        /* =========================================
                        🖼️ URL FINAL
                        ========================================= */

                        yaplinId.value =
                            rr.data?.result?.regentis?.yaplin_id
                            || null

                        toastRef.value?.show({

                            text:
                                rr.data?.result?.regentis?.msg
                                ||
                                'Voucher procesado correctamente',

                            type:
                                'success'

                        })

                        console.log(
                            '✅ RESULTADO FINAL',
                            rr.data
                        )

                    } catch (e) {

                        clearInterval(interval)

                        console.error(
                            '❌ Error polling',
                            e
                        )

                        loadingYaplin.value = false

                        toastRef.value?.show({

                            text:
                                'Error obteniendo resultado',

                            type:
                                'error'

                        })

                    }

                    /* =========================================
                       ⏰ TIMEOUT
                    ========================================= */

                    if (
                        intentos >= MAX_INTENTOS
                    ) {

                        clearInterval(interval)

                        loadingYaplin.value = false

                        toastRef.value?.show({

                            text:
                                'Tiempo agotado',

                            type:
                                'error'

                        })

                    }

                },

                2000

            )

        }

        reader.readAsDataURL(file)

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                'Error procesando imagen',

            type:
                'error'

        })

    }

}

/* =========================================
   OPEN
========================================= */

function open(item) {

    /* =========================================
    🔥 RESET UI
    ========================================= */

    previewPago.value = ''
    yaplinId.value = null
    filePago.value = null

    loadingYaplin.value = false

    tipoPagoId.value = 1

    if (inputPago.value) {

        inputPago.value.value = ''

    }

    pedido.value = {

        ...item,

        productos: (item.productos || []).map(p => ({

            ...p,

            openActions: false,

            estado_revision: null

        }))

    }

    visible.value = true

    nextTick(() => {

        gsap.fromTo(

            box.value,

            {
                scale: 0.7,
                opacity: 0
            },

            {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            }

        )

    })

}

/* =========================================
   CLOSE
========================================= */

function close() {

    gsap.to(box.value, {

        scale: 0.7,
        opacity: 0,
        duration: 0.2,

        onComplete: () => {

            visible.value = false

        }

    })

}

/* =========================================
   ACCIONES
========================================= */

function rechazar() {

    snackbarRef.value?.open(

        '¿Deseas rechazar este pedido?',

        async () => {

            try {

                loading.value = true

                const r = await axios.post(

                    `${API}/ULx3/rechazarPedido`,

                    {

                        carrito_id:
                            pedido.value.carrito_id

                    }

                )

                /* =========================================
                   🔥 TOAST
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
                   🔥 EMIT
                ========================================= */

                emit(
                    'rechazar',
                    r.data
                )

                /* =========================================
                   🔥 CLOSE
                ========================================= */

                close()

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

                loading.value = false

            }

        }

    )

}

function touchStart(e, item) {

    startX =
        e.touches[0].clientX

}

function touchMove(e, item) {

    const currentX =
        e.touches[0].clientX

    const diff =
        startX - currentX

    if (diff > 40) {

        item.openActions = true

    }

    if (diff < -40) {

        item.openActions = false

    }

}

function touchEnd(item) {

}

function marcarProducto(item, estado) {

    item.estado_revision = estado

    item.openActions = false

}

async function entregar() {

    try {

        loading.value = true

        const r = await axios.post(

            `${API}/YCTK/registrarVenta`,

            {

                carrito_id:
                    pedido.value.carrito_id,

                tipo_pago_id:
                    tipoPagoId.value,

                yaplin_id:
                    yaplinId.value

            }

        )

        /* =========================================
           🔥 TOAST
        ========================================= */

        toastRef.value?.show({

            text:
                'Venta realizada correctamente',

            type:
                'success'

        })

        /* =========================================
           🔥 EMIT
        ========================================= */

        emit(
            'entregar',
            r.data
        )

        /* =========================================
           🔥 CERRAR
        ========================================= */

        close()

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                'Error registrando venta',

            type:
                'error'

        })

    } finally {

        loading.value = false

    }

}

watch(

    tipoPagoId,

    async (v) => {

        /* =========================================
           📱 YAPE / PLIN
        ========================================= */

        if (v == 2 || v == 3) {

            if (!mostrarProductos.value)
                return

            gsap.to(

                productosRef.value,

                {

                    x: 80,
                    opacity: 0,
                    duration: 0.28,
                    ease: 'power2.in',

                    onComplete: async () => {

                        mostrarProductos.value = false

                        await nextTick()

                        gsap.fromTo(

                            btnVerRef.value,

                            {
                                x: 60,
                                opacity: 0
                            },

                            {
                                x: 0,
                                opacity: 1,
                                duration: 0.35,
                                ease: 'power3.out'
                            }

                        )

                    }

                }

            )

        }

    }

)

async function volverProductos() {

    gsap.to(

        btnVerRef.value,

        {

            x: 60,
            opacity: 0,
            duration: 0.2,

            onComplete: async () => {

                mostrarProductos.value = true

                tipoPagoId.value = 1

                await nextTick()

                gsap.fromTo(

                    productosRef.value,

                    {
                        x: 80,
                        opacity: 0
                    },

                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.35,
                        ease: 'power3.out'
                    }

                )

            }

        }

    )

}

defineExpose({
    open,
    close
})

</script>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    scrollbar-width: none;
}

.custom-scroll::-webkit-scrollbar {

    width: 6px;

}

.custom-scroll::-webkit-scrollbar-thumb {

    background: rgba(0, 0, 0, 0.15);

    border-radius: 999px;

}

/* =========================================
   🔥 BOTON PREMIUM
========================================= */

.btn-ver-productos {

    background:
        linear-gradient(135deg,
            #a855f7,
            #d946ef);

}

/* =========================================
   ✨ SHINE
========================================= */

.btn-ver-productos .shine {

    position: absolute;

    top: 0;
    left: -120%;

    width: 60%;
    height: 100%;

    background:
        linear-gradient(120deg,

            transparent 0%,

            rgba(255, 255, 255, 0.15) 30%,

            rgba(255, 255, 255, 0.75) 50%,

            rgba(255, 255, 255, 0.15) 70%,

            transparent 100%);

    transform:
        skewX(-25deg);

    animation:
        shineMove 2.8s infinite;

}

/* =========================================
   ✨ ANIMACION
========================================= */

@keyframes shineMove {

    0% {

        left: -120%;

    }

    45% {

        left: 140%;

    }

    100% {

        left: 140%;

    }

}
</style>
