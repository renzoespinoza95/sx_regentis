<template>

    <button class="w-full py-3 text-white rounded-md font-semibold mt-3" :style="{
        background: mercado.topnavbar_color
    }" @click="$emit('guardar')">

        <span v-if="loading">

            Guardando...

        </span>

        <span v-else>

            GUARDAR

        </span>

    </button>

</template>

<script setup>

import {
    useMercado
} from '../../../../../services/useMercado.js'

defineProps({

    loading: Boolean

})

defineEmits([
    'guardar'
])

const {
    mercado
} = useMercado()

</script>