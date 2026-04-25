<template>
    <button class="w-full py-3 text-white rounded-md font-semibold mt-4"
        :style="{ background: mercado.topnavbar_color }">
        GUARDAR
    </button>
</template>

<script setup>
import { useMercado } from '../../../../../services/useMercado.js'
const { mercado } = useMercado()
</script>