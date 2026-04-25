<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <div class="flex-1 flex justify-center items-start md:items-center p-4">

            <div class="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-md p-4 space-y-3">

                <DniSearch />

                <InputText label="DNI" v-model="form.dni" />
                <InputText label="Nombres apellidos" v-model="form.nombre" />
                <InputText label="Celular" v-model="form.celular" />
                <InputText label="Direccion" v-model="form.direccion" />

                <SelectTipo v-model="form.tipo" />

                <AvatarPicker />

                <BtnGuardar @click="guardar" />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

    </div>

</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBar from './components/HeaderBar.vue'
import DniSearch from './components/DniSearch.vue'
import InputText from './components/InputText.vue'
import SelectTipo from './components/SelectTipo.vue'
import AvatarPicker from './components/AvatarPicker.vue'
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

const form = reactive({
    dni: '',
    nombre: '',
    celular: '',
    direccion: '',
    tipo: ''
})

function guardar() {
    console.log('GUARDAR', form)
}
</script>