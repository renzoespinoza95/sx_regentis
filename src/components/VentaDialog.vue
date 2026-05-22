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

                </div>

                <!-- CERRAR -->
                <div class="absolute top-4 right-4 z-20">

                    <button
                        class="w-10 h-10 rounded-full bg-red-500 shadow-md flex items-center justify-center active:scale-95 transition"
                        @click="close">

                        <i class="fa fa-times text-white text-sm"></i>

                    </button>

                </div>

            </div>

            <!-- PRODUCTOS -->
            <div v-if="mostrarProductos" class="max-h-[320px] overflow-y-auto p-4 space-y-3 custom-scroll">

                <div v-for="p in pedido?.productos || []" :key="p.carrito_detalle_id"
                    class="bg-white border border-gray-100 rounded-2xl shadow-sm p-2">

                    <div class="flex gap-3 items-center">

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
💳 TIPO PAGO
====================================== -->

            <div class="p-4 pt-0">

                <div class="space-y-4">

                    <!-- LABEL -->
                    <div class="text-sm font-semibold text-gray-700">

                        Tipo de pago

                    </div>

                    <!-- SCROLL -->
                    <div class="
            flex
            gap-2
            overflow-x-auto
            pb-1
            no-scrollbar
        ">

                        <!-- EFECTIVO -->
                        <button class="
                    shrink-0
                    px-4
                    h-10
                    rounded-full
                    border
                    text-xs
                    font-semibold
                    transition-all
                    duration-200
                    active:scale-95
                " :class="tipoPagoId === 'EFECTIVO'
                    ? 'bg-green-500 border-green-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 'EFECTIVO'">

                            💵 EFECTIVO

                        </button>

                        <!-- YAPE -->
                        <button class="
                    shrink-0
                    px-4
                    h-10
                    rounded-full
                    border
                    text-xs
                    font-semibold
                    transition-all
                    duration-200
                    active:scale-95
                " :class="tipoPagoId === 'YAPE'
                    ? 'bg-purple-500 border-purple-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 'YAPE'">

                            📱 YAPE

                        </button>

                        <!-- PLIN -->
                        <button class="
                    shrink-0
                    px-4
                    h-10
                    rounded-full
                    border
                    text-xs
                    font-semibold
                    transition-all
                    duration-200
                    active:scale-95
                " :class="tipoPagoId === 'PLIN'
                    ? 'bg-fuchsia-500 border-fuchsia-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 'PLIN'">

                            🟣 PLIN

                        </button>

                        <!-- POR PAGAR -->
                        <button class="
                    shrink-0
                    px-4
                    h-10
                    rounded-full
                    border
                    text-xs
                    font-semibold
                    transition-all
                    duration-200
                    active:scale-95
                " :class="tipoPagoId === 'POR_PAGAR'
                    ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700'" @click="tipoPagoId = 'POR_PAGAR'">

                            🧾 POR PAGAR

                        </button>

                    </div>

                </div>

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
import {
    bus
}
    from '../services/eventBus.js'

import AppLoader
    from '../components/layout/AppLoader.vue'

import GsapToast
    from '../components/layout/GsapToast.vue'

import AppSnackbar
    from '../components/layout/AppSnackbar.vue'
import {
    firma
}
    from '../services/security.js'

import {
    useUsuario
}
    from '../services/usuarioService.js'


const emit = defineEmits([
    'rechazar',
    'entregar'
])

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const FLASK =
    import.meta.env.VITE_PUBLIC_URL_FLASK

const tipoPagoId =
    ref('EFECTIVO')

const loadingYaplin =
    ref(false)

const visible =
    ref(false)

const {
    getUsuId
} =
    useUsuario()

const pedido =
    ref(null)

const box =
    ref(null)

const snackbarRef =
    ref(null)

const inputPago =
    ref(null)

const filePago =
    ref(null)

const previewPago =
    ref('')

const loading =
    ref(false)

const yaplinId =
    ref(null)

const toastRef =
    ref(null)

const mostrarProductos =
    ref(true)

const btnVerRef =
    ref(null)

/* =========================================
   OPEN PICKER
========================================= */

function openPicker() {

    inputPago.value?.click()

}

/* =========================================
   SUBIR IMAGEN
========================================= */

async function onFilePago(e) {

    try {

        loadingYaplin.value = true

        const file =
            e.target.files?.[0]

        if (!file) return

        const img =
            new Image()

        const reader =
            new FileReader()

        reader.onload = () => {

            img.src =
                reader.result

        }

        img.onload = async () => {

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

            canvas.width =
                width

            canvas.height =
                height

            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            )

            const blob =
                await new Promise(resolve => {

                    canvas.toBlob(

                        resolve,

                        'image/jpeg',

                        0.7

                    )

                })

            previewPago.value =
                URL.createObjectURL(blob)

            const formData =
                new FormData()

            formData.append(
                'imagen',
                blob,
                'voucher.jpg'
            )

            const r =
                await axios.post(

                    `${FLASK}/tk_yaplin`,

                    formData,

                    {

                        headers: {

                            'Content-Type':
                                'multipart/form-data'

                        }

                    }

                )

            const job_id =
                r.data.job_id

            if (!job_id) {

                loadingYaplin.value = false

                return

            }

            let intentos = 0

            const MAX_INTENTOS = 60

            const interval = setInterval(

                async () => {

                    try {

                        intentos++

                        const rr =
                            await axios.get(

                                `${FLASK}/jobs/result`,

                                {

                                    params: {

                                        job_id

                                    }

                                }

                            )

                        if (
                            rr.data.status === 'queued'
                            ||
                            rr.data.status === 'started'
                        ) {

                            return

                        }

                        clearInterval(interval)

                        loadingYaplin.value = false

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

                    } catch (e) {

                        clearInterval(interval)

                        loadingYaplin.value = false

                        toastRef.value?.show({

                            text:
                                'Error obteniendo resultado',

                            type:
                                'error'

                        })

                    }

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
       🔥 HIDE BOTTOMNAV
    ========================================= */

    bus.emit(
        'bottomnav:toggle',
        true
    )

    previewPago.value = ''
    yaplinId.value = null
    filePago.value = null

    loadingYaplin.value = false

    tipoPagoId.value =
        'EFECTIVO'

    if (inputPago.value) {

        inputPago.value.value = ''

    }

    pedido.value = {

        ...item

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

    /* =========================================
       🔥 SHOW BOTTOMNAV
    ========================================= */

    bus.emit(
        'bottomnav:toggle',
        false
    )

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
   RECHAZAR
========================================= */

function rechazar() {

    snackbarRef.value?.open(

        '¿Deseas rechazar este pedido?',

        async () => {

            try {

                loading.value = true

                /* =========================================
   🔐 FIRMA
========================================= */

                const seguridad =
                    firma()

                const r =
                    await axios.post(

                        `${API}/YCOr/rechazarPedidoDirecto`,

                        {

                            carrito_id:
                                pedido.value.carrito_id,

                            xin:
                                seguridad.xin,

                            yuan:
                                seguridad.yuan

                        }

                    )

                toastRef.value?.show({

                    text:
                        r.data?.msg
                        ||
                        'Pedido rechazado',

                    type:
                        'success'

                })

                emit(
                    'rechazar',
                    r.data
                )

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

/* =========================================
   ENTREGAR
========================================= */

async function entregar() {

    /* =========================================
   🔐 FIRMA
========================================= */

    const seguridad =
        firma()

    try {

        loading.value = true

        const r =
            await axios.post(

                `${API}/YCTK/registrarVenta`,

                {

                    carrito_id:
                        pedido.value.carrito_id,

                    usu_id_vendedor:
                        getUsuId(),

                    tipo_pago:
                        tipoPagoId.value,

                    yaplin_id:
                        yaplinId.value,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        toastRef.value?.show({

            text:
                'Venta realizada correctamente',

            type:
                'success'

        })

        emit(
            'entregar',
            r.data
        )

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

async function volverProductos() {

    mostrarProductos.value = true

    tipoPagoId.value =
        'EFECTIVO'

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