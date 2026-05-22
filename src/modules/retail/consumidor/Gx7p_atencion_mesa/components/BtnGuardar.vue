<!-- BtnGuardar.vue -->

<template>

    <button v-if="!pedidoEnviado" class="
            w-full
            py-3
            text-white
            rounded-md
            font-semibold
            mt-3
            active:scale-[0.98]
            transition
            shadow-md
        " :style="{
            background:
                mercado.topnavbar_color
        }" @click="finalizar">

        <template v-if="loading">

            <i class="fa fa-spinner fa-spin mr-2"></i>

            Procesando...

        </template>

        <template v-else>

            REALIZAR PEDIDO

        </template>

    </button>

</template>

<script setup>

import {
    useMercado
}
    from '../../../../../services/useMercado.js'

import {
    inject
}
    from 'vue'

const {
    mercado
} = useMercado()

const finalizarPedido =
    inject(
        'finalizarPedido'
    )

const pedidoEnviado =
    inject(
        'pedidoEnviado'
    )

const loading =
    inject(
        'loadingGuardar'
    )

function finalizar() {

    finalizarPedido()

}

</script>