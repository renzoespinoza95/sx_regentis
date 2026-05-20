<template>
  <div class="flex gap-2 flex-wrap">
    <span v-for="cat in categorias" :key="cat.rubro_id" @click="seleccionar(cat)" :class="[

      'px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-300 border shadow-sm hover:scale-105',

      categoriaSeleccionada?.rubro_id === cat.rubro_id

        ?

        'bg-[#FD7635] text-white border-[#FD7635] shadow-lg scale-105'

        :

        'bg-white text-gray-700 border-gray-200'

    ]

      ">

      {{ cat.icono || '❔' }}
      {{ cat.nombre }}

    </span>
  </div>
</template>
<script setup>

import {
  computed
}
  from 'vue'

import {
  categoriaSeleccionada
}
  from '../../../services/useCategoria'

import {
  usePrincipal
}
  from '../../../services/usePrincipal'

const q =
  usePrincipal()

/* =========================================
🔥 CATEGORIAS
========================================= */

const categorias =
  computed(() => {

    return (

      q.data?.value?.rubros

      ||

      []

    )

  })

/* =========================================
🔥 CLICK
========================================= */

function seleccionar(cat) {

  categoriaSeleccionada.value =
    cat

}

</script>

<style scoped></style>