<template>

    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <!-- 🔥 HEADER GLOBAL -->
        <NegpresHeader />

        <!-- MENSAJES -->
        <div class="flex-1 overflow-y-auto px-4 py-3">
            <MessageList ref="messageListRef" />
        </div>

        <!-- INPUT -->
        <MessageInput :destId="usuario?.usu_id" @sent="onMensajeEnviado" />

    </div>

</template>

<script setup>

import { computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import MessageList from './components/MessageList.vue'
import MessageInput from './components/MessageInput.vue'

import { useRoute } from 'vue-router'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useUsuario } from '../../../../services/usuarioService.js'

const route = useRoute()
const chat_id = route.params.id
const API = import.meta.env.VITE_PUBLIC_URL_BASE

const { getUsuId } = useUsuario()
const usu_id = getUsuId()

const usuario = ref(null)
const messageListRef = ref(null)

function onMensajeEnviado(msg) {

    // 💬 mostrar instantáneo
    messageListRef.value?.agregarMensajeLocal(msg)

    // 🔄 luego sincronizar con backend
    setTimeout(() => {
        messageListRef.value?.cargarMensajes()
    }, 500)

}

onMounted(async () => {

    const res = await axios.get(`${API}/Z8gJ/chat/info/${usu_id}/${chat_id}`)
    usuario.value = res.data.usuario

})

// 🔥 mercado global
const { mercado } = useMercado()

// 🔥 fondo dinámico
const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) {
        return {}
    }

    return cssToObject(mercado.value.patron_fondo)

})

</script>