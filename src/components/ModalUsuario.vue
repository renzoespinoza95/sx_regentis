<template>

    <div v-if="modelValue" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
        @click.self="close">

        <div ref="modalRef" class="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-5">

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
            <button class="mt-5 w-full bg-green-500 text-white py-2 rounded-xl">
                Actualizar app V.{{ version }}
            </button>

            <!-- 🔥 AHORA SOLO CIERRA -->
            <button @click="close" class="mt-3 w-full bg-gray-400 text-white py-2 rounded-xl">
                Cerrar
            </button>

        </div>

    </div>

</template>

<script setup>

import { ref, watch, nextTick, computed } from 'vue'
import { gsap } from 'gsap'
import { useUsuario } from '../services/usuarioService.js'

/* =========================
   ENV
========================= */

const version = import.meta.env.VITE_PUBLIC_VERSION

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

/* =========================
   ANIMACIÓN
========================= */

watch(() => props.modelValue, (val) => {
    if (val) {
        nextTick(() => {
            gsap.fromTo(
                modalRef.value,
                { scale: 0.8, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            )
        })
    }
})

/* =========================
   METHODS
========================= */

function close() {
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

    window.location.href = '/principal'

}

</script>