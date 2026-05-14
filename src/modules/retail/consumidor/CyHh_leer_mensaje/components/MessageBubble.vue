<template>

    <div class="flex" :class="message.from === 'me'
        ? 'justify-end'
        : 'justify-start'">

        <div class="px-4 py-2 rounded-2xl text-sm max-w-[75%]" :class="message.from === 'me'
            ? 'bg-[#FD7635] text-white rounded-br-none'
            : 'bg-white text-gray-700 rounded-bl-none shadow'">

            <!-- TEXTO -->
            <div>
                {{ message.text }}
            </div>

            <!-- 🔥 PRODUCTO -->
            <ContextProducto v-if="message.contexto?.tipo === 'producto'" :contexto="message.contexto" />

            <!-- 🔥 PEDIDO -->
            <ContextPedido v-if="message.contexto?.tipo === 'pedido'" :contexto="message.contexto" />
            <!-- 🔥 VISOR -->
            <ContextVisorImagenes v-if="message.contexto?.tipo === 'visor_imagenes'" :contexto="message.contexto" />

        </div>

    </div>

</template>

<script setup>

import ContextProducto from './ContextProducto.vue'
import ContextPedido from './ContextPedido.vue'
import ContextVisorImagenes from './ContextVisorImagenes.vue'

defineProps({
    message: Object
})

</script>