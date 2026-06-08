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

                    Celular Yape/Plin (opcional)

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

    const usu_id =
        getUsuId()

    console.log(
        '🔥 usu_id =',
        usu_id
    )

    if (!usu_id) {

        snackbarRef.value?.open(
            'Debe iniciar sesión'
        )

        return
    }

    try {

        const seguridad =
            firma()

        const payload = {

            usu_id,

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

    const usu_id =
        getUsuId()

    if (!usu_id) {

        snackbarRef.value?.open(

            'Debe iniciar sesión para crear una tienda'

        )

        return

    }

    try {

        loading.value = true

        const seguridad =
            firma()

        const payload = {

            xin:
                seguridad.xin,

            yuan:
                seguridad.yuan,

            usu_id:
                usu_id,

            productos:
                productos.value,

            nombre_negocio:
                nombreNegocio.value,

            mercado_id: 3,

            celular_yape:

                celularYape.value?.trim()

                ||

                '999XXX999'

        }

        console.log(
            '📦 payload =>',
            payload
        )

        const res =
            await axios.post(

                `${API}/EiwA/tiendaAutomatico`,

                payload

            )

        console.log(
            '✅ respuesta =>',
            res.data
        )

        if (

            res.data?.status
            !==
            'ok'

        ) {

            loading.value = false

            snackbarRef.value?.open(

                res.data?.msg
                ||

                'Error creando negocio'

            )

            return

        }

        /* =========================================
           🔐 LOGIN
        ========================================= */

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

            router.replace('/')

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