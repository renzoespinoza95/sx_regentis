<template>

    <div ref="containerRef" class="space-y-3 pb-24">

        <DateDivider v-if="mensajes.length" text="Hoy" />

        <MessageBubble v-for="(m, i) in mensajes" :key="i" :message="m" />

    </div>

</template>
<script setup>

import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useUsuario } from '../../../../../services/usuarioService.js'

import MessageBubble from './MessageBubble.vue'
import DateDivider from './DateDivider.vue'

const API = import.meta.env.VITE_PUBLIC_URL_BASE

const route = useRoute()
const chat_id = Number(route.params.id || 0)

const { getUsuId } = useUsuario()
const usu_id = getUsuId()

const mensajes = ref([])
const containerRef = ref(null)

// 🔥 cargar desde backend
async function cargarMensajes() {

    try {

        const res = await axios.get(`${API}/Z8gJ/msg/listar/${chat_id}/${usu_id}`)

        console.log('📩 RAW:', res.data)

        const data = res.data.mensajes || []

        console.log('📦 MENSAJES:', data)

        mensajes.value = data.map(m => ({

            text: m.contenido_rem,

            from: Number(m.rem_id) === Number(usu_id)
                ? 'me'
                : 'other',

            fecha: m.fecha_creacion,

            contexto: m.contexto_json || null

        }))

        console.log('💬 transformados:', mensajes.value)

        await nextTick()
        scrollToBottom()

    } catch (e) {
        console.error('❌ Error cargando mensajes:', e)
    }

}

// 🔥 agregar mensaje inmediato
function agregarMensajeLocal(msg) {
    mensajes.value.push(msg)
    nextTick(scrollToBottom)
}

function scrollToBottom() {
    if (!containerRef.value) return
    containerRef.value.scrollTop = containerRef.value.scrollHeight
}

onMounted(cargarMensajes)

watch(() => route.params.id, cargarMensajes)

defineExpose({
    cargarMensajes,
    agregarMensajeLocal
})

</script>
