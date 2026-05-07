<!-- =========================================
ImagenUploader.vue
========================================= -->

<template>

    <div class="mt-4 text-center space-y-3">

        <!-- TITULO -->
        <div class="text-sm font-semibold" :style="{ color: mercado.topnavbar_color || '#FD7635' }">

            Subir pantallas de pago Yaplin !

        </div>

        <!-- CONTENEDOR -->
        <div class="flex justify-center gap-6 flex-wrap">

            <!-- IMAGENES -->
            <div v-for="(img, i) in imagenes" :key="i" class="relative">

                <!-- FOTO -->
                <img :src="img" class="w-24 h-24 rounded-full object-cover border-2 shadow"
                    :style="{ borderColor: mercado.topnavbar_color || '#FD7635' }" />

                <!-- BOTON ELIMINAR -->
                <div class="absolute bottom-1 right-1 w-6 h-6 text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
                    :style="{ background: mercado.topnavbar_color || '#FD7635' }" @click="eliminarImagen(i)">

                    <i class="fa fa-times"></i>

                </div>

            </div>

            <!-- BOTON AGREGAR -->
            <div v-if="imagenes.length < 2"
                class="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer shadow text-white text-3xl"
                :style="{ background: mercado.topnavbar_color || '#FD7635' }" @click="seleccionarNuevaImagen">

                <i class="fa fa-camera"></i>

            </div>

        </div>

        <!-- INPUT -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    </div>

</template>

<script setup>
import { ref } from 'vue'
import { useMercado } from '../../../../../services/useMercado.js'

const { mercado } = useMercado()

const imagenes = ref([])

const fileInput = ref(null)

/* =========================================
   ABRIR FILE
========================================= */
function seleccionarNuevaImagen() {

    fileInput.value.click()
}

/* =========================================
   SUBIR
========================================= */
function onFileChange(e) {

    const file = e.target.files[0]

    if (!file) return

    const url = URL.createObjectURL(file)

    if (imagenes.value.length < 2) {

        imagenes.value.push(url)
    }

    // limpiar input
    e.target.value = ''
}

/* =========================================
   ELIMINAR
========================================= */
function eliminarImagen(i) {

    imagenes.value.splice(i, 1)
}
</script>