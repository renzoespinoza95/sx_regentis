<template>
    <div
        class="min-h-screen bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]">

        <TopBar />

        <div class="max-w-md mx-auto py-6 flex flex-col items-center gap-10">

            <ImagenCircularUpload v-model="imagenes[0]" />
            <ImagenCircularUpload v-model="imagenes[1]" />
            <ImagenCircularUpload v-model="imagenes[2]" />

            <BotonGuardar :loading="loading" @click="guardar" />

        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

import TopBar from './components/TopBar.vue'
import ImagenCircularUpload from './components/ImagenCircularUpload.vue'
import BotonGuardar from './components/BotonGuardar.vue'

const URL_FLASK = import.meta.env.VITE_PUBLIC_URL_FLASK

const imagenes = ref([null, null, null])
const loading = ref(false)


/* =========================
   🔥 REDUCIR IMAGEN
========================= */
const procesarImagen = async (file) => {
    return new Promise((resolve) => {

        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
            img.src = e.target.result
        }

        img.onload = () => {

            const canvas = document.createElement('canvas')

            const MAX_WIDTH = 1000
            const scale = MAX_WIDTH / img.width

            canvas.width = MAX_WIDTH
            canvas.height = img.height * scale

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            canvas.toBlob(
                (blob) => resolve(blob),
                'image/jpeg',
                0.7
            )
        }

        reader.readAsDataURL(file)
    })
}

/* =========================
   🔁 POLLING
========================= */
const esperarResultado = async (job_id) => {

    let intentos = 0
    const MAX_INTENTOS = 30

    while (intentos < MAX_INTENTOS) {

        try {

            const res = await axios.get(
                `${URL_FLASK}/jobs/result`,
                { params: { job_id } }
            )

            const data = res.data

            if (data.status === 'finished') {

                return {
                    url: data.result.url,
                    texto: data.result.ocr?.text || '',
                    ocr_ok: data.result.ocr?.success || false
                }
            }

            if (data.status === 'failed') {
                throw new Error('Worker falló')
            }

        } catch (err) {
            console.error(err)
        }

        await new Promise(r => setTimeout(r, 2000))
        intentos++

    }

    throw new Error('Timeout esperando resultado')
}

/* =========================
   🚀 GUARDAR
========================= */
const guardar = async () => {

    if (loading.value) return

    loading.value = true

    try {

        const rutasFinales = []

        for (let i = 0; i < imagenes.value.length; i++) {

            const file = imagenes.value[i]

            if (!file) {
                rutasFinales.push('SIN IMAGEN')
                continue
            }

            // 🔥 COMPRESIÓN CLIENTE
            const blob = await procesarImagen(file)

            const formData = new FormData()
            formData.append('file', blob, `img_${i}.jpg`)

            // 🚀 ENVÍO (CAMBIADO)
            const res = await axios.post(
                `${URL_FLASK}/tk_guardar_img`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            )

            const job_id = res.data.job_id

            // 🔁 POLLING
            const r = await esperarResultado(job_id)

            console.log(r.url) // ✅ solo URL

            rutasFinales.push(r.url)

        }

        alert('Rutas finales:\n\n' + rutasFinales.join('\n'))

    } catch (err) {

        console.error(err)
        alert('Error procesando imágenes')

    } finally {

        loading.value = false

    }

}
</script>