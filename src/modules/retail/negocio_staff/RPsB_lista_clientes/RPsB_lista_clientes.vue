<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <SearchBar v-model="buscar" />

                <ClienteItem v-for="c in filtrados" :key="c.id" :item="c" />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

    </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBar from './components/HeaderBar.vue'
import SearchBar from './components/SearchBar.vue'
import ClienteItem from './components/ClienteItem.vue'
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
const buscar = ref('')

const clientes = ref([
    {
        id: 1,
        nombre: 'Frodo bolson',
        direccion: 'Av. Alondras 2023',
        codigo: 'A201',
        dni: '444666777'
    },
    {
        id: 2,
        nombre: 'Samwise Gamgee',
        direccion: 'Av. Siempre viva 123',
        codigo: 'A202',
        dni: '111222333'
    }
])

const filtrados = computed(() => {
    if (!buscar.value) return clientes.value

    return clientes.value.filter(c =>
        c.nombre.toLowerCase().includes(buscar.value.toLowerCase())
    )
})
</script>