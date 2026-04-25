<template>
    <div class="flex gap-2">

        <div class="flex-1 flex items-center bg-white border rounded-md px-2">
            <i class="fa fa-search text-gray-400 mr-2"></i>
            <input placeholder="Ingresar DNI" class="w-full py-2 outline-none text-sm" />
        </div>

        <button class="px-4 text-white rounded-md" :style="{ background: mercado.topnavbar_color }">
            buscar
        </button>

    </div>
</template>

<script setup>
import { useMercado } from '../../../../../services/useMercado.js'
const { mercado } = useMercado()
</script>