<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <div class="flex-1 flex justify-center items-start md:items-center p-4">

            <div class="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-md p-4 space-y-3">

                <InputText label="DNI" v-model="form.dni" />
                <InputText label="Nombre" v-model="form.nombre" />
                <InputText label="Direccion" v-model="form.direccion" />
                <InputText label="Puesto" v-model="form.puesto" />
                <InputText label="Celular" v-model="form.celular" />

                <BtnGuardar />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'


import HeaderBar from './components/HeaderBar.vue'
import InputText from './components/InputText.vue'
import BtnGuardar from './components/BtnGuardar.vue'
import OptionsDialog from './components/OptionsDialog.vue'

const { mercado } = useMercado()

const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})

const dialogRef = ref(null)

function openDialog() {
    dialogRef.value.open()
}

// 🔥 DATA DEMO
const form = ref({
    dni: '',
    nombre: '',
    direccion: '',
    puesto: '',
    celular: ''
})

onMounted(() => {
    form.value = {
        dni: '12345678',
        nombre: 'Frodo Bolson',
        direccion: 'Av. Alondras 2023',
        puesto: 'Cliente VIP',
        celular: '999000777'
    }
})
</script>