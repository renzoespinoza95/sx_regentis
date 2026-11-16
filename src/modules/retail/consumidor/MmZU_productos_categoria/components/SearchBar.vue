<template>
    <div class="relative w-full">
        <div class="bg-white rounded-2xl shadow px-4 py-2 flex items-center gap-2">
            <i class="fa fa-search text-gray-400"></i>
            <input v-model="searchQuery" class="flex-1 outline-none text-sm" placeholder="Buscar productos..." />
            <button v-if="searchQuery" @click="searchQuery = ''" class="text-gray-400 hover:text-gray-600 text-xs px-1">
                ✕
            </button>
        </div>

        <SearchSuggestions :query="searchQuery" :productos="todosLosProductos" @clear="searchQuery = ''" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTienda } from '../../../../../services/useTienda.js'
import SearchSuggestions from './SearchSuggestions.vue'

const searchQuery = ref('')
const { data: tiendaData } = useTienda()

// Aplanamos todos los productos de todas las categorías de la tienda
const todosLosProductos = computed(() => {
    if (!tiendaData.value?.categorias) return []

    return tiendaData.value.categorias.flatMap(cat => cat.productos || [])
})
</script>