<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <!-- 🔥 HEADER REAL -->
        <NegpresHeader />

        <!-- BUSCADOR -->
        <SearchBar />

        <!-- LISTA FULL -->
        <div class="flex-1 overflow-y-auto bg-white/80 backdrop-blur-sm">
            <ChatList />
        </div>

    </div>

</template>

<script setup>

import { computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
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