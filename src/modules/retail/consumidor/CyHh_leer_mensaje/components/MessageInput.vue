<template>

    <div class="fixed left-0 w-full bg-white px-3 py-2 flex items-center gap-2 border-t" style="bottom: 80px;">

        <!-- INPUT -->
        <input v-model="texto" @keydown="onKeydown" placeholder="Escribe un mensaje..."
            class="flex-1 px-3 py-2 rounded-full bg-gray-100 outline-none text-sm" />

        <!-- BOTÓN ENVIAR -->
        <button @click="enviar"
            class="bg-[#FD7635] text-white w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition">
            <i class="fa fa-send"></i>
        </button>

    </div>

</template>

<script setup>

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useUsuario } from '../../../../../services/usuarioService.js'

// 🌐 API
const API = import.meta.env.VITE_PUBLIC_URL_BASE

// 📍 route
const route = useRoute()
const chat_id = Number(route.params.id || 0)

// 👤 usuario actual
const { getUsuId } = useUsuario()
const usu_id = getUsuId()

// 📥 props (destinatario)
const props = defineProps({
    destId: {
        type: Number,
        default: 0
    }
})

// 📤 emitir evento al padre
const emit = defineEmits(['sent'])

// 🧠 destinatario final
const dest_id = computed(() => props.destId || 0)

// ✍️ texto
const texto = ref('')

// 📤 enviar mensaje
async function enviar() {

    const txt = texto.value.trim()
    if (!txt) return

    // 💥 1. mostrar instantáneo
    emit('sent', {
        text: txt,
        from: 'me',
        fecha: new Date()
    })

    texto.value = ''

    try {

        // 📡 2. guardar en backend
        await axios.post(`${API}/Z8gJ/msg/enviar`, {
            chat_id,
            rem_id: usu_id,
            dest_id: dest_id.value,
            texto: txt
        })

    } catch (e) {
        console.error('❌ Error al enviar:', e)
    }

}

// ⌨️ enviar con ENTER
function onKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault()
        enviar()
    }
}

</script>

<style scoped></style>