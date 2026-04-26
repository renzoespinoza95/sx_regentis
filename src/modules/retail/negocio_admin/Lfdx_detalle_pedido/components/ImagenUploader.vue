<template>

    <div class="mt-4 text-center space-y-3">

        <!-- 🔥 TITULO -->
        <div class="text-sm font-semibold" :style="{ color: mercado.topnavbar_color || '#FD7635' }">
            Subir pantallas de pago Yaplin !
        </div>

        <!-- 🔥 CONTENEDOR -->
        <div class="flex justify-center gap-6 flex-wrap">

            <!-- 🔥 ITEMS -->
            <div v-for="(img, i) in imagenes" :key="i" class="relative cursor-pointer" @click="editarImagen(i)">

                <img :src="img || 'https://picsum.photos/100'"
                    class="w-24 h-24 rounded-full object-cover border-2 shadow"
                    :style="{ borderColor: mercado.topnavbar_color || '#FD7635' }" />

                <!-- BOTON CAMARA -->
                <div class="absolute bottom-1 right-1 w-6 h-6 text-white rounded-full flex items-center justify-center text-xs"
                    :style="{ background: mercado.topnavbar_color || '#FD7635' }">
                    <i class="fa fa-camera"></i>
                </div>

            </div>

            <!-- 🔥 BOTON + -->
            <div v-if="imagenes.length < 3"
                class="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer shadow text-white text-2xl"
                :style="{ background: mercado.topnavbar_color || '#FD7635' }" @click="preguntarAgregar">
                <i class="fa fa-plus"></i>
            </div>

        </div>

        <!-- INPUT -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    </div>

    <!-- 🔥 SNACKBAR -->
    <AppSnackbar ref="snackbarRef" />

</template>

<script setup>
import { ref } from 'vue'
import { useMercado } from '../../../../../services/useMercado.js'
import AppSnackbar from '../../../../../components/layout/AppSnackbar.vue'

const { mercado } = useMercado()

const imagenes = ref([null]) // inicia con 1
const fileInput = ref(null)
const snackbarRef = ref(null)

let indexActual = null

// 🔥 CLICK +
function preguntarAgregar() {
    snackbarRef.value.open(
        '¿Agregar nueva imagen?',
        () => {
            indexActual = imagenes.value.length
            fileInput.value.click()
        }
    )
}

// 🔥 EDITAR EXISTENTE
function editarImagen(i) {
    indexActual = i
    fileInput.value.click()
}

// 🔥 FILE CHANGE
function onFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)

    // 🔥 NUEVO
    if (indexActual === imagenes.value.length) {
        imagenes.value.push(url)
    } else {
        imagenes.value[indexActual] = url
    }
}
</script>