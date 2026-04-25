<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar />

        <!-- CONTENIDO -->
        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <SearchBar v-model="buscar" />

                <!-- LISTA -->
                <div class="space-y-3">

                    <WorkerItem v-for="item in filtrados" :key="item.id" :item="item" />

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBar from './components/HeaderBar.vue'
import SearchBar from './components/SearchBar.vue'
import WorkerItem from './components/WorkerItem.vue'

// 🔥 mercado
const { mercado } = useMercado()

// 🔥 fondo dinámico
const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})

// 🔥 DATA DEMO
const buscar = ref('')

const trabajadores = ref([
    {
        id: 1,
        nombre: 'Frodo Bolson',
        cel: '999000777',
        dni: '444666777',
        rol: 'Delivery'
    },
    {
        id: 2,
        nombre: 'Samwise Gamgee',
        cel: '988123456',
        dni: '111222333',
        rol: 'Delivery'
    }
])

// 🔥 FILTRO
const filtrados = computed(() => {
    if (!buscar.value) return trabajadores.value

    return trabajadores.value.filter(t =>
        t.nombre.toLowerCase().includes(buscar.value.toLowerCase())
    )
})
</script>