<template>

    <div class="divide-y">

        <ChatItem v-for="chat in chats" :key="chat.id" :chat="chat" @click="abrirChat(chat)" />

    </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatItem from './ChatItem.vue'
import { useUsuario } from '../../../../../services/usuarioService.js'
import { bus } from '../../../../../services/eventBus.js'

const router = useRouter()
const chats = ref([])

const { getUsuId } = useUsuario()
const usu_id = getUsuId()

// 🔥 formateo hora
function formatearHora(fecha) {
    if (!fecha) return ''
    const d = new Date(fecha)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 🔥 mapper central (no duplicar lógica)
function mapChats(data) {
    return data.map(c => ({
        id: c.chat_id,
        name: c.usu1_id == usu_id ? c.usuario2 : c.usuario1,
        msg: c.ultimo_mensaje || 'Sin mensajes',
        time: formatearHora(c.fecha_creacion),
        img: c.usu1_id == usu_id ? c.img_usu2 : c.img_usu1,
        unread: Number(c.no_leidos) || 0
    }))
}

// 🔥 navegación
function abrirChat(chat) {
    router.push({
        path: `/CyHh_leer_mensaje/${chat.id}`,
        query: {
            titulo: chat.name
        }
    })
}

// 🔥 handler del bus (para poder limpiar luego)
function onChatUpdate(data) {
    console.log('📡 chats desde bus:', data)
    chats.value = mapChats(data || [])
}

// 🚀 ciclo de vida
onMounted(() => {

    // 🔥 1. CARGAR CACHE (instantáneo)
    const cache = localStorage.getItem('regentis_chats_cache')

    if (cache) {
        try {
            const parsed = JSON.parse(cache)

            if (parsed?.data) {
                chats.value = mapChats(parsed.data)
                console.log('⚡ cargado desde cache')
            }

        } catch (e) {
            console.warn('⚠️ error leyendo cache')
        }
    }

    // 🔥 2. ESCUCHAR EVENTOS DEL BOTTOMNAV
    bus.on('chat:update', onChatUpdate)

})

// 🧹 limpiar listener (MUY IMPORTANTE)
onUnmounted(() => {
    bus.off('chat:update', onChatUpdate)
})
</script>