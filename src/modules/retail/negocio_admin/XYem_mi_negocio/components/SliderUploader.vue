<template>
    <div class="
            rounded-3xl
            border-2
            border-dashed
            border-[#FD7635]
            bg-[#fff4ee]
            p-5
        ">

        <!-- EMPTY -->
        <div v-if="!previews.length" class="text-center">
            <div class="text-5xl mb-3">🖼️</div>
            <div class="font-bold text-gray-700">Subir imágenes para el Slider</div>
            <div class="text-sm text-gray-500 mt-1">Puedes seleccionar varias imágenes</div>
        </div>

        <!-- PREVIEW -->
        <div v-if="previews.length" class="grid grid-cols-4 gap-3">
            <div v-for="(img, index) in previews" :key="index" class="relative">
                <img :src="img" class="
                    w-full
                    aspect-[3/4]
                    object-cover
                    rounded-2xl
                    border
                ">
                <button class="
                    absolute
                    -top-2
                    -right-2
                    w-7
                    h-7
                    rounded-full
                    bg-red-500
                    text-white
                    text-xs
                    shadow-lg
                    active:scale-90
                " @click="eliminarPreview(index)">
                    ✕
                </button>
            </div>
        </div>

        <!-- INPUT -->
        <input ref="fileRef" type="file" accept="image/*" multiple class="hidden" @change="onFile">

        <!-- BUTTONS -->
        <div class="flex gap-3 mt-5">
            <button class="
                    flex-1
                    h-[52px]
                    rounded-2xl
                    bg-[#FD7635]
                    text-white
                    font-semibold
                    active:scale-95
                    transition
                " @click="fileRef?.click()">
                Seleccionar imágenes
            </button>

            <button v-if="previews.length" :disabled="subiendo" class="
                    flex-1
                    h-[52px]
                    rounded-2xl
                    bg-green-500
                    text-white
                    font-semibold
                    active:scale-95
                    transition
                    disabled:opacity-50
                " @click="subirImagen">
                {{ subiendo ? 'Subiendo...' : 'Subir imagenes' }}
            </button>
        </div>
    </div>

    <GsapToast ref="toastRef" />

    <AppLoader :show="loading" :local="true" text="Subiendo slider..." />
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { firma } from '../../../../../services/security'
import { useUsuario } from '../../../../../services/usuarioService.js'
import AppLoader from '../../../../../components/layout/AppLoader.vue'
import GsapToast from '../../../../../components/layout/GsapToast.vue'

/* =========================================
🔥 CONSTANTES DE BUNNY CDN (Desde .env)
========================================= */
const BUNNY_ZONE = import.meta.env.VITE_PUBLIC_BUNNY_STORAGE_ZONE
const BUNNY_KEY = import.meta.env.VITE_PUBLIC_BUNNY_STORAGE_ACCESSKEY
const BUNNY_HOST = import.meta.env.VITE_PUBLIC_BUNNY_STORAGE_HOST
const BUNNY_CDN_BASE = import.meta.env.VITE_PUBLIC_BUNNY_CDN_BASE

const props = defineProps({
    producto: Object
})

const emit = defineEmits(['uploaded'])

const fileRef = ref(null)
const files = ref([])
const previews = ref([])
const subiendo = ref(false)
const toastRef = ref(null)
const loading = ref(false)

const { getNegIdTienda } = useUsuario()

/* =========================================
🔥 FILE SELECTION & PREVIEWS
========================================= */
function onFile(e) {
    const lista = Array.from(e.target.files || [])
    if (!lista.length) return

    files.value.push(...lista)
    previews.value.push(...lista.map(x => URL.createObjectURL(x)))

    if (fileRef.value) {
        fileRef.value.value = ''
    }
}

function eliminarPreview(index) {
    URL.revokeObjectURL(previews.value[index])
    previews.value.splice(index, 1)
    files.value.splice(index, 1)
}

/* =========================================
🔥 SUBIR SLIDER A BUNNY CDN STORAGE
========================================= */
async function subirImagen() {
    try {
        if (!files.value.length) return

        subiendo.value = true
        loading.value = true

        // 1. Obtener neg_id y formatear a 4 dígitos (Ej: 51 -> "0051")
        const rawNegId = getNegIdTienda() || props.producto?.neg_id || 0
        const folderName = String(rawNegId).padStart(4, '0')

        // 2. Procesar y subir cada archivo a Bunny
        for (const archivoOriginal of files.value) {
            const archivoReducido = await reducirImagen(archivoOriginal)

            // Nombre único para evitar colisiones en CDN
            const hashUnico = Math.random().toString(36).substring(2, 10)
            const fileName = `slider_${Date.now()}_${hashUnico}.jpg`

            const uploadUrl = `https://${BUNNY_HOST}/${BUNNY_ZONE}/${folderName}/${fileName}`

            // Petición PUT directa al Storage de Bunny CDN
            await axios.put(uploadUrl, archivoReducido, {
                headers: {
                    'AccessKey': BUNNY_KEY,
                    'Content-Type': 'application/octet-stream'
                }
            })

            // 3. Construir la URL pública e insertar el slider en la base de datos
            const urlPublicaCDN = `${BUNNY_CDN_BASE}/${folderName}/${fileName}`
            await guardarSlider(urlPublicaCDN, rawNegId)
        }

        // Limpiar estado local
        previews.value.forEach(x => URL.revokeObjectURL(x))
        previews.value = []
        files.value = []

        if (fileRef.value) {
            fileRef.value.value = ''
        }

        toastRef.value?.show({
            text: 'Sliders subidos a Bunny CDN correctamente ✨',
            type: 'success'
        })

    } catch (e) {
        console.error("Error al subir el slider a Bunny CDN:", e)
        toastRef.value?.show({
            text: 'Error al subir la imagen del slider ❌',
            type: 'error'
        })
    } finally {
        loading.value = false
        subiendo.value = false
    }
}

/* =========================================
🔥 REDUCIR IMAGEN EN CANVAS
========================================= */
async function reducirImagen(fileOriginal) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = e => {
            img.src = e.target.result
        }
        reader.onerror = reject

        img.onload = () => {
            const maxWidth = 1200
            let width = img.width
            let height = img.height

            if (width > maxWidth) {
                height = height * (maxWidth / width)
                width = maxWidth
            }

            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
                blob => {
                    if (!blob) {
                        reject()
                        return
                    }

                    const nuevoFile = new File(
                        [blob],
                        'slider.jpg',
                        { type: 'image/jpeg' }
                    )
                    resolve(nuevoFile)
                },
                'image/jpeg',
                0.9
            )
        }

        img.onerror = reject
        reader.readAsDataURL(fileOriginal)
    })
}

/* =========================================
🔥 GUARDAR SLIDER EN BASE DE DATOS
========================================= */
async function guardarSlider(url, negId) {
    const seguridad = firma()

    const r = await axios.post(
        '/Ceve/slider/crear',
        {
            neg_id: negId,
            img: url,
            orden: 0,
            is_visible: 1,
            titulo_superior: '',
            xin: seguridad.xin,
            yuan: seguridad.yuan
        }
    )

    const nuevoSlider = r.data

    if (nuevoSlider?.status === 'ok') {
        emit('uploaded', {
            slider_id: nuevoSlider.slider_id,
            img: url,
            orden: 0,
            is_visible: 1,
            titulo_superior: '',
            neg_id: negId
        })
    }
}
</script>