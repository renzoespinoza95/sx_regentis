<template>
    <div class="max-w-md mx-auto">

        <AppLoader :show="loading" text="Creando negocio..." />
        <AppSnackbar ref="snackbarRef" />

        <div class="text-center mb-8 pt-4">
            <div ref="logoRef"
                class="w-[110px] h-[110px] mx-auto rounded-[32px] bg-white shadow-2xl border border-orange-100 flex items-center justify-center overflow-hidden mb-5">
                <img src="https://barsi-img.b-cdn.net/recursos/logo-regentis.png"
                    class="w-[86px] h-[86px] object-contain" />
            </div>

            <h1 class="text-[22px] font-black text-gray-800 leading-tight px-2">
                {{ tituloBienvenida }}
            </h1>
        </div>

        <div class="space-y-7">
            <div>
                <div class="text-sm font-semibold text-gray-700 mb-2">
                    Nombre del negocio
                </div>
                <input v-model="nombreNegocio" type="text" placeholder="Mi negocio"
                    class="w-full h-[52px] rounded-xl border border-gray-300 bg-white px-4 text-[#0F0F0F] outline-none focus:ring-2 focus:ring-[#FD7635]" />
            </div>

            <div>
                <div class="text-xs text-[#0F0F0F] mb-1">
                    Tu página web:
                </div>
                <div
                    class="h-[44px] rounded-xl border border-gray-200 bg-gray-50 px-4 flex items-center text-xl text-[#FB2C36]  font-semibold break-all">
                    https://ofer.lat/{{ slug }}
                </div>
            </div>

            <div>
                <div class="text-sm font-semibold text-[#0F0F0F] mb-2">
                    Celular para informes
                </div>
                <input v-model="celularYape" type="tel" maxlength="9" inputmode="numeric" placeholder="987654321"
                    @input="onInputCelular"
                    class="w-full h-[52px] rounded-xl border border-gray-300 bg-white px-4 text-[#0F0F0F] outline-none focus:ring-2 focus:ring-[#FD7635]" />
            </div>

            <ProductosTextarea v-model="productos" />

            <FooterButton v-if="!tieneNegocio" @click="crearNegocio" />
            <DialogNegocioExistente v-model="showDialog" />

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

import AppSnackbar from '../../../../../components/layout/AppSnackbar.vue'
import AppLoader from '../../../../../components/layout/AppLoader.vue'
import { firma } from '../../../../../services/security.js'
import { useUsuario } from '../../../../../services/usuarioService.js'

import ProductosTextarea from './ProductosTextarea.vue'
import FooterButton from './FooterButton.vue'
import DialogNegocioExistente from './DialogNegocioExistente.vue'
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from '../../../../../services/firebase.js'

const API_FLASK = import.meta.env.VITE_PUBLIC_URL_FLASK
const API = import.meta.env.VITE_PUBLIC_URL_BASE
const router = useRouter()

const tieneNegocio = ref(false)
const loading = ref(false)
const showDialog = ref(false)
const snackbarRef = ref(null)
const logoRef = ref(null)

const nombreNegocio = ref('')
const celularYape = ref('')
const productos = ref('')

const { getUsuId, setLoginData, usuario, isLogged } = useUsuario()

const api = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_URL_BASE
})

// 🌟 PROPIEDAD COMPUTADA PARA EL TITULO DE BIENVENIDA
const tituloBienvenida = computed(() => {
    if (isLogged.value) {
        const nombre =
            usuario.value?.user?.display_name ||
            usuario.value?.user?.name ||
            usuario.value?.user?.nombre ||
            'Emprendedor'
        return `¡Bienvenido, ${nombre}! Crea tu tienda y empieza a vender hoy mismo`
    }
    return 'Tu tienda virtual, lista en minutos'
})

const slug = computed(() => {
    return String(nombreNegocio.value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
})

function onInputCelular(e) {
    let value = e.target.value
    value = value.replace(/\D/g, '').slice(0, 9)
    celularYape.value = value
}

onMounted(async () => {
    gsap.to(logoRef.value, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    })

    const usu_id = getUsuId()
    console.log('🔥 usu_id =', usu_id)

    if (!usu_id) {
        snackbarRef.value?.open(
            'Debe registrarse primero, es gratis.',
            null,
            [
                {
                    text: 'Registrarse',
                    action: loginFirebase
                }
            ]
        )
        return
    }

    try {
        const seguridad = firma()
        const payload = {
            usu_id,
            xin: seguridad.xin,
            yuan: seguridad.yuan
        }

        const res = await axios.post(`${API}/ZYhL/detalleUsu`, payload)
        const usuarioData = res.data?.usuario

        if (usuarioData?.neg_id && usuarioData?.neg_id !== '0') {
            console.warn('⚠️ usuario ya tiene negocio')
            tieneNegocio.value = true
            showDialog.value = true
        }
    } catch (e) {
        console.error('❌ error detalleUsu', e)
    }
})

async function loginFirebase() {
    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        const idToken = await user.getIdToken()
        const res = await api.post('/coral/crearUsuarioFirebase', { token: idToken })

        if (res.data.status === 'ok') {
            setLoginData(res.data)
            snackbarRef.value?.cerrar()
        }
    } catch (e) {
        console.error(e)
    }
}

async function crearNegocio() {
    const usu_id = getUsuId()
    if (!usu_id) {
        snackbarRef.value?.open(
            'Debe registrarse primero, es gratis.',
            null,
            [{ text: 'Registrarse', action: loginFirebase }]
        )
        return
    }

    if (!celularYape.value || celularYape.value.trim() === '') {
        snackbarRef.value?.open('Debe ingresar un celular para informes')
        return
    }

    if (celularYape.value.trim().length < 9) {
        snackbarRef.value?.open('El celular debe tener 9 dígitos')
        return
    }

    try {
        loading.value = true
        const seguridad = firma()
        const payload = {
            xin: seguridad.xin,
            yuan: seguridad.yuan,
            usu_id: usu_id,
            productos: productos.value,
            nombre_negocio: nombreNegocio.value,
            slug: slug.value,
            mercado_id: 3,
            celular_yape: celularYape.value.trim()
        }

        const res = await axios.post(`${API}/EiwA/tiendaAutomatico`, payload)

        if (res.data?.status !== 'ok') {
            loading.value = false
            snackbarRef.value?.open(res.data?.msg || 'Error creando negocio')
            return
        }

        const loginRes = await axios.post(`${API}/coral/loginById`, { usu_id: getUsuId() })

        if (loginRes.data?.status === 'ok') {
            setLoginData(loginRes.data)
            loading.value = false

            // 🔥 OCULTA EL BOTÓN ENVIAR INMEDIATAMENTE AL CREAR EL NEGOCIO
            tieneNegocio.value = true

            snackbarRef.value?.open(
                '🎉 Tu tienda virtual ya está lista.',
                null,
                [
                    {
                        text: 'Emprendedor', // "Empezar"
                        action() {
                            router.replace(`/CV2K_negocio/${res.data.neg_id}`)
                        }
                    }
                ]
            )
        } else {
            loading.value = false
            snackbarRef.value?.open(loginRes.data?.msg || 'Error iniciando sesión')
        }
    } catch (e) {
        console.error('❌ error creando negocio', e)
        loading.value = false
        snackbarRef.value?.open(e?.response?.data?.msg || 'Error creando negocio')
    }
}
</script>