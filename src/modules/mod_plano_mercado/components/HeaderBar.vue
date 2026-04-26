<template>

    <div class="px-4 py-3 flex justify-between items-center"
        :style="{ background: mercado.topnavbar_color || '#FD7635' }">

        <!-- LEFT -->
        <div class="flex items-center gap-2 cursor-pointer" @click="goBack">
            <div class="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                <i class="fa fa-arrow-left text-sm" :style="{ color: mercado.topnavbar_color }"></i>
            </div>

            <span class="text-white font-semibold">
                Plano del Mercado
            </span>
        </div>

        <!-- RIGHT -->
        <div class="flex gap-2">

            <!-- 🔍 NUEVO BOTON -->
            <div class="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer"
                @click="abrirBusqueda">
                <i class="fa fa-search text-sm" :style="{ color: mercado.topnavbar_color }"></i>
            </div>

            <div class="w-9 h-9 bg-white rounded-full flex items-center justify-center" @click="$emit('openOptions')">
                <i class="fa fa-ellipsis-v text-sm" :style="{ color: mercado.topnavbar_color }"></i>
            </div>

        </div>

    </div>

    <!-- 🔥 MODAL BUSQUEDA -->
    <SearchPuestosModal :open="showSearchModal" @close="showSearchModal = false" @select="seleccionarPuesto" />

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMercado } from '../../../services/useMercado.js'
import SearchPuestosModal from './SearchPuestosModal.vue'

const router = useRouter()
const { mercado } = useMercado()

const showSearchModal = ref(false)

const emit = defineEmits(['selectPuesto'])

function goBack() {
    if (window.history.length > 1) router.back()
    else router.push('/')
}

function abrirBusqueda() {
    showSearchModal.value = true
}

function seleccionarPuesto(n) {
    emit('selectPuesto', n)
    showSearchModal.value = false
}
</script>
