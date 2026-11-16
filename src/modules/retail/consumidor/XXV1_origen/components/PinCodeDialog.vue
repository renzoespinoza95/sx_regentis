<template>
    <transition name="fade">
        <div v-if="modelValue" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
            @click.self="cerrar">
            <div class="relative bg-white rounded-[24px] p-5 w-[92%] max-w-[380px]">

                <!-- BOTÓN CIRCULAR DE CERRAR (X) -->
                <button @click="cerrar" type="button"
                    class="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FD7635] text-white flex items-center justify-center shadow-md hover:opacity-90 active:scale-95 transition-all z-10">
                    <i class="fa fa-times text-sm"></i>
                </button>

                <!-- TÍTULO CON COLOR DE TEXTO EXPLÍCITO -->
                <div class="text-center font-bold text-lg mb-4 text-gray-900 pt-1">
                    🔑 Código PIN
                </div>

                <!-- INPUT CON FONDO Y TEXTO VISIBLE -->
                <input v-model="pinCode" maxlength="6" placeholder="Ingrese PIN"
                    class="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl p-3 text-center text-xl font-semibold mb-4 focus:outline-none focus:ring-2 focus:ring-[#FD7635]">

                <button @click="ingresar" :disabled="loading"
                    class="w-full bg-[#FD7635] text-white py-3 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50">
                    {{ loading ? 'Procesando...' : 'Ingresar' }}
                </button>

            </div>
        </div>
    </transition>

    <AppSnackbar ref="snackbarRef" />
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUsuario } from '../../../../../services/usuarioService.js'
import AppSnackbar from '../../../../../components/layout/AppSnackbar.vue'

const props = defineProps({
    modelValue: Boolean
})

const emit = defineEmits([
    'update:modelValue'
])

const router = useRouter()
const { setLoginData } = useUsuario()

const pinCode = ref('')
const loading = ref(false)
const snackbarRef = ref(null)

function cerrar() {
    emit('update:modelValue', false)
}

async function ingresar() {
    try {
        if (!pinCode.value) {
            snackbarRef.value?.open('Debe ingresar un PIN')
            return
        }

        loading.value = true

        const r = await axios.post(
            `${import.meta.env.VITE_PUBLIC_URL_BASE}/K5jX/ingresarConPinCode`,
            { pin_code: pinCode.value }
        )

        if (r.data.status !== 'ok') {
            snackbarRef.value?.open(r.data.msg || 'PIN inválido')
            return
        }

        setLoginData(r.data)
        cerrar()
        router.replace('/dash')

    } catch (e) {
        console.error(e)
        snackbarRef.value?.open(
            e?.response?.data?.msg || 'PIN inválido o expirado'
        )
    } finally {
        loading.value = false
    }
}
</script>