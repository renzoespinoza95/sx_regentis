<template>

    <!-- 🔥 FLOAT -->
    <div v-if="isLogged && mercado" class="fixed bottom-24 right-5 z-50 cursor-pointer active:scale-90 transition"
        @click="openDialog">

        <!-- 🔥 BURBUJA VERDE -->
        <div class="w-14 h-14 rounded-full shadow-lg flex items-center justify-center" style="background:#25D366">

            <i class="fa fa-comment text-white text-xl"></i>

        </div>

    </div>

    <!-- 🔥 DIALOG -->
    <div v-if="visible" class="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">

        <div ref="box"
            class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

            <!-- 🔥 HEADER -->
            <div class="px-4 py-3 text-white flex items-center justify-between"
                :style="{ background: mercado.topnavbar_color || '#FD7635' }">

                <div class="font-semibold">
                    Contactar negocio
                </div>

                <button @click="closeDialog">
                    <i class="fa fa-times"></i>
                </button>

            </div>

            <!-- 🔥 LOADING -->
            <div v-if="loading" class="p-6 text-center text-sm text-gray-500">

                Cargando contactos...

            </div>

            <!-- 🔥 LISTA -->
            <div v-else class="overflow-y-auto">

                <div v-for="u in usuarios" :key="u.usu_id"
                    class="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition"
                    @click="seleccionarUsuario(u)">

                    <!-- 🔥 AVATAR -->
                    <img :src="u.img_perfil || 'https://picsum.photos/80'"
                        class="w-12 h-12 rounded-full object-cover border border-gray-200" />

                    <!-- 🔥 INFO -->
                    <div class="flex-1">

                        <div class="font-medium text-sm text-gray-800">
                            {{ u.nombres_apellidos || u.sobrenombre }}
                        </div>

                        <div class="text-xs text-gray-500 mt-1">
                            {{ u.tipo_usuario || 'Usuario' }}
                        </div>

                    </div>

                    <!-- 🔥 ICON -->
                    <div class="text-gray-400">
                        <i class="fa fa-chevron-right"></i>
                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import { useMercado } from '../../services/useMercado.js'
import { useUsuario } from '../../services/usuarioService.js'

import gsap from 'gsap'

/* =========================
   🔥 PROPS
========================= */

const props = defineProps({

    // 🔥 mensaje personalizado
    textoMensaje: {
        type: String,
        default: 'Buenos días. Me gustaría recibir información.'
    },

    // 🔥 negocio destino
    negId: {
        type: Number,
        default: null
    },

    // 🔥 contexto dinámico
    contexto: {
        type: Object,
        default: null
    }

})

/* =========================
   🔥 ROUTER
========================= */

const router = useRouter()

/* =========================
   🔥 GLOBALS
========================= */

const { mercado } = useMercado()

const {
    isLogged,
    getUsuId
} = useUsuario()

/* =========================
   🔥 STATE
========================= */

const visible = ref(false)
const loading = ref(false)

const usuarios = ref([])

const box = ref(null)

/* =========================
   🔥 OPEN DIALOG
========================= */

async function openDialog() {

    // 🔥 validar
    if (!props.negId) {
        console.error('negId requerido')
        return
    }

    visible.value = true
    loading.value = true

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

    try {

        const res = await fetch(
            `${import.meta.env.VITE_PUBLIC_URL_BASE}/N3GT/contactosNeg`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    neg_id: props.negId
                })
            }
        )

        const data = await res.json()

        if (data.status === 'ok') {

            usuarios.value = (data.data || []).filter(u => {

                return Number(u.usu_id) !== Number(getUsuId())

            })

        } else {

            console.error(data.msg)

        }

    } catch (e) {

        console.error(e)

    } finally {

        loading.value = false

    }

}

/* =========================
   🔥 CLOSE DIALOG
========================= */

function closeDialog() {

    gsap.to(box.value, {

        scale: 0.7,
        opacity: 0,
        duration: 0.2,

        onComplete: () => {
            visible.value = false
        }

    })

}

/* =========================
   🔥 ENVIAR MENSAJE
========================= */

async function seleccionarUsuario(usuario) {

    try {

        const texto = props.textoMensaje

        const res = await fetch(
            `${import.meta.env.VITE_PUBLIC_URL_BASE}/Baat/msg/enviarDirecto`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    rem_id: getUsuId(),

                    dest_id: usuario.usu_id,

                    texto,

                    // 🔥 CONTEXTO
                    contexto: props.contexto

                })
            }
        )

        const data = await res.json()

        if (data.status === 'ok') {

            closeDialog()

            // 🔥 ir al chat
            setTimeout(() => {

                router.push(`/CyHh_leer_mensaje/${data.chat_id}`)

            }, 250)

        } else {

            alert(data.msg || 'Error enviando mensaje')

        }

    } catch (e) {

        console.error(e)

        alert('Error de conexión')

    }

}

</script>