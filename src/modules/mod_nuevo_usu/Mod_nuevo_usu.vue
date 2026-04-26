<template>
    <div class="min-h-screen pattern-background flex flex-col">

        <HeaderBar />

        <AppToast v-model:show="showToast" :message="toastMessage" :type="toastType" />

        <AppLoader :show="loading" text="Guardando..." />

        <CredencialesDialog :show="showCredencialesDialog" :datos="credencialesGuardadas"
            @close="cerrarDialogYRedirigir" @copied="mostrarCopiado" />

        <div class="flex-1 flex items-center justify-center px-4 pb-24">

            <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-5 space-y-4">

                <InputField label="DNI" v-model="form.dni" />

                <InputField label="Celular" v-model="form.celular" />

                <InputField label="Nombres apellidos" v-model="form.nombre" />

                <InputField label="Sobrenombre" v-model="form.sobrenombre" />

                <RandomInput label="Clave" v-model="form.clave" @random="form.clave = generarClave4Digitos()" />

                <GuardarButton :disabled="!formCompleto || loading" @click="guardarUsuario" />

            </div>

        </div>

    </div>
</template>

<script setup>
import HeaderBar from './components/HeaderBar.vue'
import InputField from './components/InputField.vue'
import RandomInput from './components/RandomInput.vue'
import GuardarButton from './components/GuardarButton.vue'
import AppToast from './components/AppToast.vue'
import CredencialesDialog from './components/CredencialesDialog.vue'
import AppLoader from '../../components/layout/AppLoader.vue'

import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const loading = ref(false)

const showCredencialesDialog = ref(false)

const credencialesGuardadas = ref({
    dni: '',
    celular: '',
    nombre: '',
    sobrenombre: '',
    clave: ''
})

const form = reactive({
    dni: '',
    celular: '',
    nombre: '',
    sobrenombre: '',
    clave: ''
})

const formCompleto = computed(() => {
    return [
        form.dni,
        form.celular,
        form.nombre,
        form.sobrenombre,
        form.clave
    ].every(v => String(v).trim() !== '')
})

function generarClave4Digitos() {
    return Math.floor(1000 + Math.random() * 9000).toString()
}

function guardarUsuario() {
    if (!formCompleto.value || loading.value) return

    loading.value = true

    const payload = {
        dni: form.dni,
        celular: form.celular,
        sobrenombre: form.sobrenombre,
        nombres_apellidos: form.nombre,
        clavel: form.clave,
        img_perfil: 'https://barsi-img.b-cdn.net/recursos/perfil_usuario02.avif',
        provincia: 'lima',
        fecha_nacimiento: '1990-01-01',
        tipoxusu_id: 1,
        is_activo: 1,
        is_premium: 0,
        fecha_fin_premium: '1990-01-01'
    }

    axios.post('/Cuvg/usu/crear', payload)
        .then(r => {
            if (r.data.success) {
                credencialesGuardadas.value = {
                    dni: form.dni,
                    celular: form.celular,
                    nombre: form.nombre,
                    sobrenombre: form.sobrenombre,
                    clave: form.clave
                }

                showCredencialesDialog.value = true
            } else {
                toastMessage.value = 'No se pudo guardar 😢'
                toastType.value = 'error'
                showToast.value = true
            }
        })
        .catch(err => {
            console.error(err)

            toastMessage.value = 'Error al guardar 😢'
            toastType.value = 'error'
            showToast.value = true
        })
        .finally(() => {
            loading.value = false
        })
}

function mostrarCopiado() {
    toastMessage.value = 'Copiado al portapapeles 💚'
    toastType.value = 'success'
    showToast.value = true
}
function cerrarDialogYRedirigir() {
    showCredencialesDialog.value = false
    router.push('/principal')
}
</script>

<style scoped>
.pattern-background {
    background-color: #e5f7f6;

    background-image:
        linear-gradient(135deg, #45A29A 25%, transparent 25%),
        linear-gradient(225deg, #45A29A 25%, transparent 25%),
        linear-gradient(45deg, #45A29A 25%, transparent 25%),
        linear-gradient(315deg, #45A29A 25%, #e5f7f6 25%);

    background-position: 10px 0, 10px 0, 0 0, 0 0;
    background-size: 20px 20px;
    background-repeat: repeat;
}
</style>