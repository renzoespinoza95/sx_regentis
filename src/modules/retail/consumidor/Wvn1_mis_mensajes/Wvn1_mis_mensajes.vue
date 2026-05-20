<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <!-- 🔥 HEADER REAL -->
        <HeaderBack />

        <!-- BUSCADOR -->
        <SearchBar />

        <!-- LISTA FULL -->
        <div class="
        flex-1
        overflow-y-auto
        pb-6

        chat-bg
    ">
            <ChatList />
        </div>

    </div>

</template>

<script setup>

import { computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import HeaderBack from '../../../../components/layout/HeaderBack.vue'
import SearchBar from './components/SearchBar.vue'
import ChatList from './components/ChatList.vue'
import { useUsuario } from '../../../../services/usuarioService.js'

// 🔥 mercado global
const { mercado } = useMercado()
const { getUsuId } = useUsuario()
const usu_id = getUsuId()

// 🔥 fondo dinámico
const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) {
        return {}
    }

    return cssToObject(mercado.value.patron_fondo)

})

</script>
<style scoped>
.chat-bg {

    background-color: #95D3DA;

    opacity: 0.8;

    background:

        radial-gradient(circle,
            transparent 20%,
            #95D3DA 20%,
            #95D3DA 80%,
            transparent 80%,
            transparent),

        radial-gradient(circle,
            transparent 20%,
            #95D3DA 20%,
            #95D3DA 80%,
            transparent 80%,
            transparent) 25px 25px,

        linear-gradient(rgba(255, 255, 255, 0.9) 2px,
            transparent 2px) 0 -1px,

        linear-gradient(90deg,
            rgba(255, 255, 255, 0.9) 2px,
            #95D3DA 2px) -1px 0;

    background-size:
        50px 50px,
        50px 50px,
        25px 25px,
        25px 25px;

}
</style>