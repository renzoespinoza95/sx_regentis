<template>

    <div class="mt-4">



        <!-- =========================================
            💜 LISTA YAPE
        ========================================= -->

        <div v-if="listaYape.length" class="mb-4">

            <div class="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">

                Números Yape disponibles

            </div>

            <div class="flex flex-wrap gap-2">

                <div v-for="(num, i) in listaYape" :key="i" class="px-4 py-2 rounded-2xl
                   bg-gradient-to-r
                   from-purple-500
                   via-fuchsia-500
                   to-pink-500
                   text-white
                   text-sm
                   font-semibold
                   shadow-lg
                   border border-white/20
                   backdrop-blur">

                    <i class="fa fa-mobile mr-2"></i>

                    {{ num }}

                </div>

            </div>

        </div>

        <!-- LABEL -->
        <div class="text-sm font-semibold text-gray-700 mb-3">

            {{ titulo }}

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

    <GsapToast ref="toastRef" />

    <AppLoader :show="loadingYaplin" text="Procesando voucher..." />

</template>

<script setup>

import {
    ref,
    defineExpose,
    computed
}
    from 'vue'
import axios from 'axios'

import {
    useTienda
}
    from '../services/useTienda.js'

import AppLoader
    from './layout/AppLoader.vue'

import GsapToast
    from './layout/GsapToast.vue'
import {
    firma
}
    from '../services/security.js'

/* =========================================
   PROPS
========================================= */
const props = defineProps({

    titulo: {

        type: String,

        default:
            'Subir captura de pago'

    },

    carritoId: {

        type: [String, Number],

        default: null

    }

})

/* =========================================
   ENV
========================================= */

const FLASK =
    import.meta.env.VITE_PUBLIC_URL_FLASK

const { data } =
    useTienda()

const listaYape = computed(() => {

    try {

        const raw =
            data.value?.negocio?.lista_yape

        if (!raw) return []

        const arr =
            JSON.parse(raw)

        return Array.isArray(arr)
            ? arr
            : []

    } catch (e) {

        return []

    }

})

/* =========================================
   STATE
========================================= */

const loadingYaplin = ref(false)

const inputPago = ref(null)

const previewPago = ref('')

const yaplinId = ref(null)

const toastRef = ref(null)

/* =========================================
   PICKER
========================================= */

function openPicker() {

    inputPago.value?.click()

}

/* =========================================
   FILE
========================================= */

async function onFilePago(e) {

    try {

        loadingYaplin.value = true

        const file =
            e.target.files?.[0]

        if (!file) {

            loadingYaplin.value = false

            return
        }

        /* =========================================
           IMAGE
        ========================================= */

        const img =
            new Image()

        const reader =
            new FileReader()

        reader.onload = () => {

            img.src =
                reader.result

        }

        img.onload = async () => {

            /* =========================================
               RESIZE
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
                    height * (
                        MAX_WIDTH / width
                    )

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

            /* =========================================
               JPG
            ========================================= */

            const blob =
                await new Promise(resolve => {

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

            const seguridad =
                firma()

            /* =========================================
               FORM
            ========================================= */

            const formData =
                new FormData()

            formData.append(

                'imagen',

                blob,

                'voucher.jpg'

            )

            if (props.carritoId) {

                formData.append(

                    'carrito_id',

                    props.carritoId

                )

            }

            formData.append(

                'xin',

                seguridad.xin

            )

            formData.append(

                'yuan',

                seguridad.yuan

            )

            /* =========================================
               UPLOAD
            ========================================= */

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

                toastRef.value?.show({

                    text:
                        'No se recibió job_id',

                    type:
                        'error'

                })

                return
            }

            /* =========================================
               POLLING
            ========================================= */

            let intentos = 0

            const MAX_INTENTOS = 60

            const interval =
                setInterval(

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

                            /* =========================================
                               ERROR
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
                               SUCCESS
                            ========================================= */

                            yaplinId.value =

                                rr.data?.result?.regentis?.yaplin_id
                                ||

                                null

                            toastRef.value?.show({

                                text:

                                    rr.data?.result?.regentis?.msg
                                    ||

                                    'Voucher procesado correctamente',

                                type:
                                    'success'

                            })

                        } catch (err) {

                            clearInterval(interval)

                            loadingYaplin.value = false

                            console.error(err)

                            toastRef.value?.show({

                                text:
                                    'Error obteniendo resultado',

                                type:
                                    'error'

                            })

                        }

                        /* =========================================
                           TIMEOUT
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

        loadingYaplin.value = false

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
   EXPOSE
========================================= */

defineExpose({

    yaplinId,

    previewPago,

    openPicker

})

</script>
