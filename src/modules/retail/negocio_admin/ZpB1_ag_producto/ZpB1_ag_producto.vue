<template>
    <div class="min-h-screen flex flex-col bg-gray-100">

        <HeaderBar />

        <!-- CONTENEDOR -->
        <div class="flex-1 flex justify-center items-start md:items-center p-4">

            <div class="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-md p-4 space-y-4">

                <!-- NOMBRE -->
                <InputText label="Nombre" v-model="form.nombre" />

                <!-- PRECIO + STOCK -->
                <InputRow v-model:precio="form.precio" v-model:stock="form.stock" />

                <!-- CATEGORIA -->
                <SelectCategoria v-model="form.categoria" />

                <!-- DESCRIPCION -->
                <TextArea v-model="form.descripcion" />

                <!-- BOTON -->
                <BtnGuardar @click="guardar" />

            </div>

        </div>

    </div>
</template>

<script setup>
import { reactive } from 'vue'

import HeaderBar from './components/HeaderBar.vue'
import InputText from './components/InputText.vue'
import InputRow from './components/InputRow.vue'
import SelectCategoria from './components/SelectCategoria.vue'
import TextArea from './components/TextArea.vue'
import BtnGuardar from './components/BtnGuardar.vue'

const form = reactive({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    descripcion: ''
})

function guardar() {
    console.log('GUARDAR', form)
}
</script>