<template>

    <div class="
        min-h-screen

        flex
        items-center
        justify-center

        px-3
        py-4
    " :style="fondoStyle">

        <div class="
    w-full
    max-w-xl
">

            <!-- MOBILE / FORM -->
            <div class="
          bg-[#f5f5f5]
          border
          border-[#d9d9d9]
          shadow-sm
          rounded-2xl
          overflow-hidden
          flex
          flex-col
          min-h-[760px]
        ">

                <TopBar />

                <div class="flex-1 px-5 py-6">

                    <NegocioForm />

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    computed
}
    from 'vue'

import {
    useMercado
}
    from '../../../../services/useMercado.js'

import {
    cssToObject
}
    from '../../../../services/useCss.js'

import TopBar
    from './components/TopBar.vue'

import NegocioForm
    from './components/NegocioForm.vue'

const { mercado } =
    useMercado()

const fondoStyle = computed(() => {

    if (
        !mercado.value?.patron_fondo
    ) {

        return {}

    }

    return cssToObject(

        mercado.value
            .patron_fondo

    )

})

</script>