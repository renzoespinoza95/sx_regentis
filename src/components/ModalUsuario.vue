<template>

    <div v-if="modelValue" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
        @click.self="close">

        <div ref="modalRef" class="relative bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-5 overflow-hidden">

            <!-- 🔥 CERRAR -->
            <div class="absolute top-3 right-3 z-10">

                <button @click="close"
                    class="w-8 h-8 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition">

                    <i class="fa fa-times text-sm"></i>

                </button>

            </div>
            <!-- HEADER -->
            <div class="text-center mb-4">

                <img :src="user?.img_perfil || 'https://picsum.photos/80'"
                    class="w-20 h-20 rounded-full mx-auto mb-2" />

                <div class="font-semibold text-lg">
                    {{ user?.nombres_apellidos }}
                </div>

                <div class="text-sm text-gray-500">
                    {{ user?.email }}
                </div>

                <!-- 🔥 BOTÓN PEQUEÑO CERRAR SESIÓN -->
                <button @click="logout" class="mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded-full shadow">
                    Cerrar sesión
                </button>

            </div>

            <!-- INFO USUARIO -->
            <div class="text-sm space-y-2 mb-4">

                <!-- Línea 1 -->
                <div class="flex justify-between">
                    <div><b>Usuario:</b> {{ user?.sobrenombre }}</div>
                    <div><b>Código:</b> {{ user?.cod_usu }}</div>
                </div>

                <!-- Línea 2 -->
                <div class="flex justify-between">
                    <div><b>Rol:</b> {{ user?.rol_nombre }}</div>
                    <div><b>Tipo Usuario:</b> {{ user?.tipoxusu_descripcion }}</div>
                </div>

            </div>

            <!-- INFO NEGOCIO -->
            <div class="bg-gray-50 rounded-xl p-3 mb-4">

                <div class="font-semibold mb-2">Negocio</div>

                <div class="text-sm space-y-1">
                    <div><b>Nombre:</b> {{ user?.negocio_nombre }}</div>
                    <div><b>Dirección:</b> {{ user?.negocio_direccion }}</div>
                    <div><b>Ciudad:</b> {{ user?.negocio_ciudad }}</div>
                </div>

            </div>

            <!-- SCREENS -->
            <div class="mt-4">
                <div class="font-semibold mb-2">Pantallas</div>

                <div class="flex flex-wrap gap-2">
                    <span v-for="s in screens" :key="s.screen_id" class="bg-gray-100 px-2 py-1 rounded text-xs">
                        {{ s.titulo || s.nombre }}
                    </span>
                </div>
            </div>

            <!-- BOTONES -->
            <button @click="actualizarApp" :disabled="!necesitaActualizar"
                class="mt-5 w-full text-white py-2 rounded-xl transition" :class="necesitaActualizar
                    ? 'bg-green-500 hover:scale-[1.02]'
                    : 'bg-gray-400 cursor-not-allowed'
                    ">

                <template v-if="necesitaActualizar">

                    Actualizar app V.{{ versionPrincipal }}

                </template>

                <template v-else>

                    Al día

                </template>

            </button>

        </div>

    </div>

</template>

<script setup>

import { ref, watch, nextTick, computed } from 'vue'
import { gsap } from 'gsap'
import { useUsuario } from '../services/usuarioService.js'
import { usePrincipal } from '../services/usePrincipal.js'
import { bus } from '../services/eventBus.js'

/* =========================
   ENV
========================= */

const version = import.meta.env.VITE_PUBLIC_VERSION

const principal =
    usePrincipal()

/* =========================
   PROPS / EMITS
========================= */

const props = defineProps({
    modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

/* =========================
   STATE
========================= */

const modalRef = ref(null)

const { usuario, clearUsuario } = useUsuario()

const user = computed(() => usuario.value?.user || null)
const screens = computed(() => usuario.value?.screens || [])

const versionPrincipal = computed(() => {

    try {

        const cache = JSON.parse(
            localStorage.getItem(
                'regentis_principal_cache'
            ) || '{}'
        )

        return cache.version || '0'

    } catch (e) {

        return '0'

    }

})

const playstoreUrl = computed(() => {

    try {

        const cache = JSON.parse(
            localStorage.getItem(
                'regentis_principal_cache'
            ) || '{}'
        )

        return cache.playstore || ''

    } catch (e) {

        return ''

    }

})

const necesitaActualizar = computed(() => {

    const local =
        String(version || '0')
            .split('.')
            .map(Number)

    const remoto =
        String(versionPrincipal.value || '0')
            .split('.')
            .map(Number)

    for (let i = 0; i < Math.max(local.length, remoto.length); i++) {

        const l = local[i] || 0
        const r = remoto[i] || 0

        if (r > l) return true

        if (r < l) return false

    }

    return false

})

function actualizarApp() {

    if (!playstoreUrl.value) {

        return

    }

    window.open(
        playstoreUrl.value,
        '_blank'
    )

}

/* =========================
   ANIMACIÓN
========================= */

watch(() => props.modelValue, (val) => {

    if (val) {

        bus.emit(
            'bottomnav:toggle',
            true
        )

        nextTick(() => {

            gsap.fromTo(

                modalRef.value,

                {
                    scale: 0.8,
                    opacity: 0,
                    y: 40
                },

                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power3.out'
                }

            )

        })

    } else {

        bus.emit(
            'bottomnav:toggle',
            false
        )

    }

})

/* =========================
   METHODS
========================= */

function close() {

    bus.emit(
        'bottomnav:toggle',
        false
    )

    gsap.to(modalRef.value, {
        scale: 0.8,
        opacity: 0,
        y: 40,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
            emit('update:modelValue', false)
        }
    })
}

function logout() {

    clearUsuario()

    localStorage.removeItem('screens')
    localStorage.removeItem('login_data')

    const mercadoId = parseInt(import.meta.env.VITE_PUBLIC_MERCADO_ID || '0')

    if (mercadoId === 0) {
        window.location.href = '/'
    } else {
        window.location.href = '/principal'
    }

}

</script>