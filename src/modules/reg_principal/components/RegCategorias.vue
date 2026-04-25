<template>
  <div class="flex gap-2 flex-wrap">
    <span v-for="cat in categorias" :key="cat.reg_cat_neg_id" @click="seleccionar(cat)"
      class="bg-white shadow-sm px-3 py-1 rounded-full text-xs cursor-pointer hover:scale-105 transition">
      {{ cat.icono || '❔' }} {{ cat.nombre }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoriaSeleccionada } from '../../../services/useCategoria'

const categorias = ref([])

onMounted(() => {

  try {
    const raw = localStorage.getItem('regentis_principal_cache')
    const cache = raw ? JSON.parse(raw) : null

    if (cache?.categorias) {
      categorias.value = cache.categorias
    }

  } catch (e) {
    console.error('Error leyendo cache categorias', e)
  }

})

// 🔥 CLICK
function seleccionar(cat) {
  categoriaSeleccionada.value = cat
}
</script>

<style scoped></style>