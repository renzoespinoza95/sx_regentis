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

            <div class="
    mt-2

    text-xs

    text-gray-500
">

                Tu página web:

            </div>

            <div class="
    mt-1

    h-[44px]

    rounded-xl

    border
    border-gray-200

    bg-gray-50

    px-4

    flex
    items-center

    text-sm

    text-[#FD7635]

    font-semibold

    break-all
">

                https://ofer.lat/{{ slug }}

            </div>

            <!-- YAPE -->
            <div>

                <div class="
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                ">

                    Celular para informes

                </div>

                <input v-model="celularYape" type="tel" maxlength="9" inputmode="numeric" placeholder="987654321"
                    @input="onInputCelular" class="
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
    onMounted,
    computed
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

const slug = computed(() => {

    return String(

        nombreNegocio.value || ''

    )

        .normalize('NFD')

        .replace(/[\u0300-\u036f]/g, '')

        .toLowerCase()

        .trim()

        .replace(/[^a-z0-9\s-]/g, '')

        .replace(/\s+/g, '-')

        .replace(/-+/g, '-')

})

function onInputCelular(e) {

    let value =

        e.target.value

    value = value

        .replace(/\D/g, '')

        .slice(0, 9)

    celularYape.value =

        value

}

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

    if (

        !celularYape.value

        ||

        celularYape.value.trim() === ''

    ) {

        snackbarRef.value?.open(

            'Debe ingresar un celular para informes'

        )

        return

    }

    if (

        celularYape.value.trim().length < 9

    ) {

        snackbarRef.value?.open(

            'El celular debe tener 9 dígitos'

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

            slug:
                slug.value,

            mercado_id: 3,

            celular_yape:

                celularYape.value.trim()

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