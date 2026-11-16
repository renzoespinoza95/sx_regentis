<template>
    <div class="min-h-screen pattern-background pt-20">
        <HeaderBack />

        <div class="content-container">
            <div class="bg-white rounded-3xl p-6 shadow-md max-w-md mx-auto">
                <NegocioHeader />

                <NegocioAvatar :negocio="negocio" :previewImage="previewImage" :isUploading="isUploadingImage"
                    @select-image="selectImage" @cancel-image="cancelImage" @upload-image="uploadImage" />

                <NegocioForm :form="form" v-model:listaYape="listaYape" @invalid-yape="invalidYape" />

                <BottomActions @open-membresia="openMembresia" />

                <button @click="abrirSliders" type="button"
                    class="w-full h-16 mt-5 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg font-black shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2">
                    <i class="fa fa-sliders"></i>
                    Mis Sliders
                </button>

                <SaveButton @click="guardar" />
            </div>
        </div>

        <MembresiaDialog ref="membresiaRef" />

        <SliderTiendaDialog ref="sliderTiendaRef" @uploaded="onSliderUploaded" @deleted="onSliderDeleted" />

        <AppLoader :show="loading" text="Guardando negocio..." />

        <AppSnackbar ref="snackbarRef" />

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import HeaderBack from '../../../../components/layout/HeaderBack.vue'
import AppLoader from '../../../../components/layout/AppLoader.vue'
import AppSnackbar from '../../../../components/layout/AppSnackbar.vue'
import YaplinGallery from '../../../../components/YaplinGallery.vue'
import YaplinUploader from '../../../../components/YaplinUploader.vue'
import { firma } from '../../../../services/security'
import { useUsuario } from '../../../../services/usuarioService'
import NegocioHeader from './components/NegocioHeader.vue'
import NegocioAvatar from './components/NegocioAvatar.vue'
import NegocioForm from './components/NegocioForm.vue'
import SaveButton from './components/SaveButton.vue'
import BottomActions from './components/BottomActions.vue'
import MembresiaDialog from './components/MembresiaDialog.vue'

// 🔥 IMPORTAR EL NUEVO DIÁLOGO
import SliderTiendaDialog from './components/SliderTiendaDialog.vue'

/* =========================================
   API Y USUARIO
========================================= */
const API = import.meta.env.VITE_PUBLIC_URL_BASE
const API_FLASK = import.meta.env.VITE_PUBLIC_URL_FLASK
const { getNegId } = useUsuario()

/* =========================================
   STATE
========================================= */
const negocio = ref(null)
const loading = ref(false)
const snackbarRef = ref(null)
const fileInput = ref(null)
const previewImage = ref(null)
const selectedFile = ref(null)
const uploadedImageUrl = ref('')
const isUploadingImage = ref(false)
const membresiaRef = ref(null)
const listaYape = ref([])

// 🔥 REFERENCIA PARA MANIPULAR EL DIÁLOGO DEL SLIDER
const sliderTiendaRef = ref(null)

const form = ref({
    nombre: '',
    celular_informes: '',
    ciudad: '',
    provincia: ''
})

/* =========================================
   INIT
========================================= */
onMounted(() => {
    cargarNegocio()
})

/* =========================================
   DETALLE
========================================= */
async function cargarNegocio() {
    try {
        loading.value = true
        const seguridad = firma()
        const r = await axios.post(`${API}/XQzQ/detalleNeg`, {
            neg_id: getNegId(),
            xin: seguridad.xin,
            yuan: seguridad.yuan
        })

        if (r.data.res === 'ok') {
            negocio.value = r.data.data
            form.value = {
                nombre: r.data.data.nombre || '',
                celular_informes: r.data.data.celular_informes || '',
                ciudad: r.data.data.ciudad || '',
                provincia: r.data.data.provincia || ''
            }
            try {
                listaYape.value = JSON.parse(r.data.data.lista_yape || '[]')
            } catch {
                listaYape.value = []
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

/* =========================================
   🔥 LÓGICA DE DETALLE Y APERTURA DE SLIDERS
========================================= */
/* =========================================
   🔥 LÓGICA DE DETALLE Y APERTURA DE SLIDERS (ACTUALIZADO A POST)
========================================= */
async function abrirSliders() {
    try {
        loading.value = true

        // 1. Generar los hashes de seguridad para la firma
        const seguridad = firma()

        // 2. Construir el cuerpo (payload) requerido por el nuevo endpoint POST
        const payload = {
            neg_id: getNegId(),
            xin: seguridad.xin,
            yuan: seguridad.yuan
        }

        // 3. Consumir el endpoint usando axios.post enviando el payload
        const r = await axios.post(`${API}/Ceve/slider/listar`, payload)

        if (r.data.status === 'ok') {
            // Mapeo para compatibilidad de identificadores de ID con SliderGallery [cite: 48, 52]
            const imagenesMapeadas = (r.data.data || []).map(img => ({
                ...img,
                slider_image_id: img.slider_id
            }))

            // Estructura de objeto simulada para el diálogo [cite: 49, 51]
            const payloadDialogo = {
                neg_id: getNegId(),
                name: form.value.nombre || 'Mi Tienda',
                imagenes: imagenesMapeadas
            }

            // Desplegar el modal [cite: 51]
            sliderTiendaRef.value?.open(payloadDialogo)
        } else {
            snackbarRef.value?.open('No se pudieron cargar los sliders')
        }
    } catch (e) {
        console.error(e)
        snackbarRef.value?.open('Error conectando con el servidor de sliders')
    } finally {
        loading.value = false
    }
}

// Escuchador disparado al subir imágenes con éxito desde el sub-componente
function onSliderUploaded(nuevaImagen) {
    // Forzar consistencia de IDs en memoria reactiva local
    if (nuevaImagen && !nuevaImagen.slider_image_id) {
        nuevaImagen.slider_image_id = nuevaImagen.slider_id
    }
    snackbarRef.value?.open('Imagen añadida al slider')
}

// Escuchador disparado al remover imágenes desde el sub-componente
function onSliderDeleted(data) {
    snackbarRef.value?.open('Foto eliminada del slider')
}

/* =========================================
   MÉTODOS PREEXISTENTES (SIN CAMBIOS)
========================================= */
function invalidYape() {
    snackbarRef.value?.open('El número debe tener 9 dígitos')
}

function selectImage() { fileInput.value?.click() }

function cancelImage() {
    previewImage.value = null
    selectedFile.value = null
    uploadedImageUrl.value = ''
}

function onFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
}

function optimizeImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                let width = img.width
                let height = img.height
                const MAX = 600
                if (width > height) {
                    if (width > MAX) {
                        height = height * (MAX / width)
                        width = MAX
                    }
                } else {
                    if (height > MAX) {
                        width = width * (MAX / height)
                        height = MAX
                    }
                }
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                canvas.toBlob((blob) => {
                    const optimized = new File([blob], 'logo.jpg', { type: 'image/jpeg' })
                    resolve(optimized)
                }, 'image/jpeg', 0.7)
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    })
}

async function uploadImage() {
    try {
        if (!selectedFile.value) return
        isUploadingImage.value = true
        const optimized = await optimizeImage(selectedFile.value)
        const fd = new FormData()
        fd.append('file', optimized)

        const r = await axios.post(`${API_FLASK}/tk_guardar_img`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        await pollJob(r.data.job_id)
    } catch (e) {
        console.error(e)
        snackbarRef.value?.open('Error subiendo imagen')
    } finally {
        isUploadingImage.value = false
    }
}

async function pollJob(job_id) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            try {
                const r = await axios.get(`${API_FLASK}/jobs/result`, { params: { job_id } })
                if (r.data.status === 'finished') {
                    clearInterval(interval)
                    uploadedImageUrl.value = r.data.result.url
                    previewImage.value = r.data.result.url
                    snackbarRef.value?.open('Imagen subida')
                    resolve()
                }
            } catch (e) {
                clearInterval(interval)
                reject(e)
            }
        }, 2000)
    })
}

async function guardar() {
    try {
        const celular = String(form.value.celular_informes || '').trim()
        if (!/^\d{9}$/.test(celular)) {
            snackbarRef.value?.open('Complete celular informes (9 dígitos)')
            return
        }

        loading.value = true
        const seguridad = firma()
        const payload = {
            neg_id: getNegId(),
            nombre: form.value.nombre,
            celular_informes: form.value.celular_informes,
            ciudad: form.value.ciudad,
            provincia: form.value.provincia,
            img_logo: uploadedImageUrl.value || negocio.value?.img_logo || '',
            lista_yape: listaYape.value,
            xin: seguridad.xin,
            yuan: seguridad.yuan
        }

        const r = await axios.post(`${API}/Fw7L/editarMiNeg`, payload)
        snackbarRef.value?.open(r.data.msg || 'Negocio actualizado')
    } catch (e) {
        console.error(e)
        snackbarRef.value?.open('Error guardando negocio')
    } finally {
        loading.value = false
    }
}

function openMembresia() { membresiaRef.value?.open() }
</script>

<style scoped>
.pattern-background {
    background-color: #eefcf9;
    opacity: 0.95;
    background-image:
        linear-gradient(135deg, #c7f3eb 25%, transparent 25%),
        linear-gradient(225deg, #c7f3eb 25%, transparent 25%),
        linear-gradient(45deg, #c7f3eb 25%, transparent 25%),
        linear-gradient(315deg, #c7f3eb 25%, #eefcf9 25%);
    background-position: 10px 0, 10px 0, 0 0, 0 0;
    background-size: 10px 10px;
    background-repeat: repeat;
}

.content-container {
    padding: 20px;
}
</style>