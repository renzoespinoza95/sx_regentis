<template>

    <!-- 🔥 FONDO DINÁMICO -->
    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar />

        <!-- 🔥 CONTENIDO CENTRADO -->
        <div class="flex-1 flex justify-center items-start md:items-center p-4">

            <div class="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-md p-4 space-y-4">

                <InputText label="Nombre" v-model="form.nombre" />

                <InputPrecio v-model="form.precio" />

                <SelectCategoria v-model="form.categoria" />

                <TextArea v-model="form.descripcion" />

                <BtnGuardar @click="guardar" />

            </div>

        </div>

    </div>

</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 🔥 servicios
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

// 🔥 componentes
import HeaderBar from './components/HeaderBar.vue'
import InputText from './components/InputText.vue'
import InputPrecio from './components/InputPrecio.vue'
import SelectCategoria from './components/SelectCategoria.vue'
import TextArea from './components/TextArea.vue'
import BtnGuardar from './components/BtnGuardar.vue'

const router = useRouter()
const { mercado } = useMercado()

// 🔥 fondo dinámico
const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})

// 🔥 DATA DEMO
const form = reactive({
    nombre: '',
    precio: '',
    categoria: '',
    descripcion: ''
})

onMounted(() => {
    form.nombre = 'Hamburguesa Clásica'
    form.precio = 15.90
    form.categoria = 'Comida'
    form.descripcion = 'Pan suave, carne jugosa y papas crocantes'
})

function guardar() {
    console.log('ACTUALIZAR', form)
}
</script>