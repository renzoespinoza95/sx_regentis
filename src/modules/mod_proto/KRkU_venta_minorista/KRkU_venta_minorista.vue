<template>
    <div class="min-h-screen">

        <TopBar />

        <!-- 🎤 VISUAL CENTRAL -->
        <div class="max-w-5xl mx-auto p-4">

            <div class="flex flex-col items-center justify-center mt-6">

                <!-- 🎤 VISUAL (sin v-if duplicado) -->
                <div class="w-full mb-4">
                    <VoiceVisualizer v-show="grabando" ref="visualizer" />
                </div>

            </div>

            <!-- productos -->
            <div class="grid gap-3 mt-6">
                <ProductItem v-for="(p, i) in productos" :key="i" :item="p" />
            </div>

        </div>

        <!-- 🟠 SNACKBAR -->
        <SnackbarEnviar v-if="mostrarSnackbar" @enviar="enviarAudio" @cancelar="cancelarEnvio" />

        <!-- 🎚️ TOGGLE FIJO ABAJO -->
        <div class="fixed bottom-6 left-0 right-0 flex flex-col items-center z-20">

            <!-- TEXTO -->
            <span class="mb-2 text-sm font-medium text-gray-600">
                {{ grabando ? 'Grabando...' : 'Empezar venta' }}
            </span>

            <!-- TOGGLE -->
            <div class="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                <ToggleMic @on="iniciarGrabacion" @off="detenerGrabacion" />
            </div>

        </div>

        <!-- loading -->
        <LoadingOverlay v-if="loading" />

    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { nextTick } from 'vue'
import TopBar from './components/TopBar.vue'
import ProductItem from './components/ProductItem.vue'
import SnackbarEnviar from './components/SnackbarEnviar.vue'
import VoiceVisualizer from './components/VoiceVisualizer.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import ToggleMic from './components/ToggleMic.vue'

const productos = ref([])
const mostrarSnackbar = ref(false)
const mediaRecorder = ref(null)
const audioChunks = ref([])

const grabando = ref(false)
const loading = ref(false)

const visualizer = ref(null)

// ▶️ INICIAR
const iniciarGrabacion = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    mediaRecorder.value = new MediaRecorder(stream)
    audioChunks.value = []

    mediaRecorder.value.ondataavailable = e => {
        audioChunks.value.push(e.data)
    }

    mediaRecorder.value.start()
    grabando.value = true

    await nextTick() // 👈 espera render

    if (visualizer.value) {
        visualizer.value.start()
    }
}

// ⏹ DETENER
const detenerGrabacion = async () => {

    if (!mediaRecorder.value) return

    mediaRecorder.value.stop()
    grabando.value = false
    visualizer.value?.stop()

    mediaRecorder.value.onstop = async () => {

        console.log("🎤 Audio listo")

        // 👇 NO enviar aún
        mostrarSnackbar.value = true
    }
}

const enviarAudio = async () => {

    mostrarSnackbar.value = false
    loading.value = true

    try {

        const blob = new Blob(audioChunks.value, { type: 'audio/webm' })

        const formData = new FormData()
        formData.append('files[]', blob, 'audio.webm')

        console.log("🎤 Enviando audio...")

        const res = await axios.post(
            'http://172.28.81.231:8080/tk_venta_minorista',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        const job_id = res.data.job_id

        console.log("🧠 Procesando...")

        const resultado = await esperarResultado(job_id)

        console.log("📦 Listo:", resultado)

        const data = resultado?.resultados?.[0]?.data

        if (data?.productos) {
            productos.value = data.productos.map(p => ({
                nombre: p.producto,
                cantidad: p.cantidad,
                unidad: 'und',
                precio: 0
            }))
        }

    } catch (e) {
        console.error(e)
        alert("Error en procesamiento")
    }

    loading.value = false
}

const cancelarEnvio = () => {
    mostrarSnackbar.value = false
    audioChunks.value = []
    console.log("❌ envío cancelado")
}

const esperarResultado = async (job_id) => {

    return new Promise((resolve, reject) => {

        const interval = setInterval(async () => {
            try {

                const r = await axios.get(
                    `http://172.28.81.231:8080/jobs/result?job_id=${job_id}`
                )

                const data = r.data

                console.log("⏳ estado:", data.status)

                if (data.status === "finished") {
                    clearInterval(interval)
                    resolve(data.result)
                }

                if (data.status === "failed") {
                    clearInterval(interval)
                    reject("Job falló")
                }

            } catch (e) {
                clearInterval(interval)
                reject(e)
            }
        }, 1000)

    })
}


</script>