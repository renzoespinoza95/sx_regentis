<template>

    <div class="
            max-w-md
            mx-auto
        ">

        <!-- 🔥 LOADER -->
        <AppLoader :show="loading" text="Creando negocio..." />
        <AppSnackbar ref="snackbarRef" />

        <!-- LOGO -->
        <div ref="logoRef" class="
                mb-8

                flex
                justify-center
            ">

            <div class="
                    w-[110px]
                    h-[110px]

                    rounded-[32px]

                    bg-white

                    shadow-2xl

                    border
                    border-orange-100

                    flex
                    items-center
                    justify-center

                    overflow-hidden
                ">

                <img src="https://barsi-img.b-cdn.net/recursos/sg3f.png" class="
                        w-[86px]
                        h-[86px]
                        object-contain
                    " />

            </div>

        </div>

        <div class="space-y-7">

            <!-- NOMBRE -->
            <div>

                <div class="
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                ">

                    Nombre del negocio

                </div>

                <input v-model="nombreNegocio" type="text" placeholder="Mi negocio" class="
                        w-full
                        h-[52px]

                        rounded-xl

                        border
                        border-gray-300

                        bg-white

                        px-4

                        text-gray-800

                        outline-none

                        focus:ring-2
                        focus:ring-[#FD7635]
                    " />

            </div>

            <!-- YAPE -->
            <div>

                <div class="
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                ">

                    Celular Yape/Plin

                </div>

                <input v-model="celularYape" type="text" placeholder="987654321" class="
                        w-full
                        h-[52px]

                        rounded-xl

                        border
                        border-gray-300

                        bg-white

                        px-4

                        text-gray-800

                        outline-none

                        focus:ring-2
                        focus:ring-[#FD7635]
                    " />

            </div>

            <!-- PRODUCTOS -->
            <ProductosTextarea v-model="productos" />

            <!-- BTN -->
            <FooterButton @click="crearNegocio" />
            <DialogNegocioExistente v-model="showDialog" />

        </div>

    </div>

</template>

<script setup>

import {
    ref,
    onMounted
}
    from 'vue'
import axios from 'axios'
import { useRouter }
    from 'vue-router'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'
import gsap from 'gsap'

import {
    firma
}
    from '../../../../../services/security.js'

import {
    useUsuario
}
    from '../../../../../services/usuarioService.js'

import ProductosTextarea
    from './ProductosTextarea.vue'

import FooterButton
    from './FooterButton.vue'

import AppLoader
    from '../../../../../components/layout/AppLoader.vue'
import DialogNegocioExistente
    from './DialogNegocioExistente.vue'
const API_FLASK =
    import.meta.env
        .VITE_PUBLIC_URL_FLASK

const API =
    import.meta.env
        .VITE_PUBLIC_URL_BASE

const router =
    useRouter()

const {

    getUsuId,

    setLoginData

} = useUsuario()

const logoRef = ref(null)

const loading = ref(false)
const snackbarRef = ref(null)

const nombreNegocio = ref('')

const productos = ref('')
const showDialog =
    ref(false)
const celularYape = ref('')

onMounted(async () => {

    gsap.to(

        logoRef.value,

        {

            y: -10,

            duration: 2,

            repeat: -1,

            yoyo: true,

            ease: 'sine.inOut'

        }

    )

    /* =========================================
       🔍 VALIDAR NEGOCIO
    ========================================= */

    try {

        const seguridad =
            firma()

        const payload = {

            usu_id:
                getUsuId(),

            xin:
                seguridad.xin,

            yuan:
                seguridad.yuan

        }

        console.log(
            '🔍 detalleUsu payload =>',
            payload
        )

        const res =
            await axios.post(

                `${API}/ZYhL/detalleUsu`,

                payload

            )

        console.log(
            '👤 detalleUsu =>',
            res.data
        )

        const usuario =

            res.data?.usuario

        if (

            usuario?.neg_id
            &&
            usuario?.neg_id !== '0'

        ) {

            console.warn(
                '⚠️ usuario ya tiene negocio'
            )

            showDialog.value = true

        }

    } catch (e) {

        console.error(
            '❌ error detalleUsu',
            e
        )

    }

})

/* =========================================
   🚀 CREAR NEGOCIO
========================================= */

async function crearNegocio() {

    try {

        loading.value = true

        console.log(
            '🚀 iniciando creación negocio'
        )

        const seguridad =
            firma()

        const payload = {

            xin:
                seguridad.xin,

            yuan:
                seguridad.yuan,

            usu_id:
                getUsuId(),

            productos:
                productos.value,

            nombre_negocio:
                nombreNegocio.value,

            mercado_id: 3,

            celular_yape:
                celularYape.value

        }

        console.log(
            '📦 payload =>',
            payload
        )

        /* =========================================
           🚀 REQUEST
        ========================================= */

        const res =
            await axios.post(

                `${API_FLASK}/tk_nuevo_neg`,

                payload

            )

        console.log(
            '✅ respuesta inicial =>',
            res.data
        )

        /* =========================================
           🔥 POLLING
        ========================================= */

        const job_id =
            res.data?.job_id

        if (!job_id) {

            console.warn(
                '⚠️ sin job_id'
            )

            loading.value = false

            return

        }

        console.log(
            '⏳ iniciando polling'
        )

        /* =========================================
   ⏱️ TIMEOUT
========================================= */

        const pollingStart =
            Date.now()

        const polling =
            setInterval(

                async () => {

                    try {

                        console.log(
                            '🔄 consultando job'
                        )

                        /* =========================================
   ⏱️ TIMEOUT 40s
========================================= */

                        const elapsed =

                            Date.now()
                            -
                            pollingStart

                        if (elapsed >= 40000) {

                            console.warn(
                                '⏱️ polling timeout'
                            )

                            clearInterval(
                                polling
                            )

                            loading.value = false

                            snackbarRef.value?.open(

                                'El proceso tardó demasiado'

                            )

                            return

                        }

                        const r =
                            await axios.get(

                                `${API_FLASK}/jobs/result?job_id=${job_id}`

                            )

                        console.log(
                            '📡 polling =>',
                            r.data
                        )

                        if (

                            r.data?.status
                            ===
                            'finished'

                            ||

                            r.data?.status
                            ===
                            'completed'

                        ) {

                            clearInterval(
                                polling
                            )

                            console.log(
                                '🎉 polling finalizado'
                            )

                            console.log(
                                '📦 RESULT COMPLETO =>',
                                r.data
                            )

                            /* =========================================
                               🔥 JSON GENERADO
                            ========================================= */

                            console.log(

                                '🧠 json_generado =>',

                                r.data?.result?.json_generado

                            )

                            /* =========================================
                               ❌ ERROR REGENTIS
                            ========================================= */

                            const regentisStatus =

                                r.data?.result
                                    ?.regentis
                                    ?.response
                                    ?.status

                            if (

                                regentisStatus
                                ===
                                'error'

                            ) {

                                loading.value = false

                                console.error(

                                    '❌ REGENTIS ERROR =>',

                                    r.data?.result
                                        ?.regentis

                                )

                                snackbarRef.value?.open(

                                    r.data?.result
                                        ?.regentis
                                        ?.response
                                        ?.msg

                                    ||

                                    'Error creando negocio'

                                )

                                return

                            }

                            /* =========================================
                               🔐 LOGIN
                            ========================================= */

                            try {

                                const loginRes =
                                    await axios.post(

                                        `${API}/coral/loginById`,

                                        {

                                            usu_id:
                                                getUsuId()

                                        }

                                    )

                                console.log(
                                    '🔐 login =>',
                                    loginRes.data
                                )

                                if (

                                    loginRes.data?.status
                                    ===
                                    'ok'

                                ) {

                                    setLoginData(
                                        loginRes.data
                                    )

                                    loading.value = false

                                    router.replace(
                                        '/'
                                    )

                                } else {

                                    loading.value = false

                                    snackbarRef.value?.open(

                                        loginRes.data?.msg
                                        ||

                                        'Error iniciando sesión'

                                    )

                                }

                            } catch (e) {

                                console.error(
                                    '❌ error login',
                                    e
                                )

                                loading.value = false

                                snackbarRef.value?.open(
                                    'Error iniciando sesión'
                                )

                            }

                        }

                    } catch (e) {

                        console.error(
                            '❌ polling error',
                            e
                        )

                        /* =========================================
                           🛑 DETENER POLLING
                        ========================================= */

                        clearInterval(
                            polling
                        )

                        /* =========================================
                           🔥 OCULTAR LOADER
                        ========================================= */

                        loading.value = false

                        /* =========================================
                           🔥 SNACKBAR
                        ========================================= */

                        snackbarRef.value?.open(

                            'No se pudo consultar el estado del proceso'

                        )

                    }

                },

                2500

            )

    } catch (e) {

        console.error(
            '❌ error creando negocio',
            e
        )

        loading.value = false

        snackbarRef.value?.open(

            e?.response?.data?.msg
            ||

            'Error creando negocio'

        )

    }

}

</script>