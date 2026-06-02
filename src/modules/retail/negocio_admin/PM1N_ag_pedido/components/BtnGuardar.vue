<template>

    <div class="flex gap-2 mt-3">

        <!-- ======================================
             ❌ CANCELAR
        ====================================== -->

        <button class="
                flex-1
                py-3
                rounded-md
                font-semibold
                text-white
                bg-red-500
                active:scale-[0.98]
                transition
            " @click="$emit('cancelar')">

            CANCELAR

        </button>

        <!-- ======================================
             💾 GUARDAR
        ====================================== -->

        <button class="
                flex-1
                py-3
                text-white
                rounded-md
                font-semibold
                active:scale-[0.98]
                transition
            " :style="{
                background:
                    mercado.topnavbar_color
            }" @click="$emit('guardar')">

            <span v-if="loading">

                Guardando...

            </span>

            <span v-else>

                GUARDAR

            </span>

        </button>

    </div>

</template>

<script setup>

import {
    useMercado
}
    from '../../../../../services/useMercado.js'

defineProps({

    loading:
        Boolean

})

defineEmits([

    'guardar',

    'cancelar'

])

const {
    mercado
}
    =
    useMercado()

</script>
