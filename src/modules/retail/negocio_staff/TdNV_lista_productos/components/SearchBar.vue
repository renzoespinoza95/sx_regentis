<template>
    <div class="-mt-6">
        <div class="bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3">

            <i class="fa fa-search text-gray-400"></i>

            <input v-model="texto" @input="emitirBusqueda" type="text" placeholder="Buscar..."
                class="flex-1 outline-none text-sm" />

            <!-- ❌ LIMPIAR -->
            <i v-if="texto" @click="limpiar" class="fa fa-times text-gray-400 cursor-pointer hover:text-red-500"></i>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const texto = ref('')
const emit = defineEmits(['buscar', 'limpiar'])

function emitirBusqueda() {
    emit('buscar', texto.value)
}

function limpiar() {
    texto.value = ''
    emit('limpiar')
}
</script>