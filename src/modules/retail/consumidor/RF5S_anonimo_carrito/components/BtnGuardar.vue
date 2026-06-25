<template>

    <button v-if="!pedidoEnviado" class="w-full py-3 text-white rounded-md font-semibold mt-3"
        :style="{ background: mercado.topnavbar_color }" @click="finalizar">
        REALIZAR PEDIDO
    </button>

</template>

<script setup>
import { useMercado } from '../../../../../services/useMercado.js'
import { inject } from 'vue'

const { mercado } = useMercado()

const finalizarPedido = inject('finalizarPedido')
const pedidoEnviado = inject('pedidoEnviado')

function finalizar() {
    finalizarPedido()
}
</script>