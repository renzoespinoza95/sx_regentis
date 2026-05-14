<template>

    <div class="mt-3 w-64 rounded-3xl overflow-hidden shadow-2xl border border-white/30 backdrop-blur-md" style="
        background:
            linear-gradient(
                135deg,
                rgba(255,255,255,0.92),
                rgba(245,245,245,0.82)
            );
    ">

        <!-- IMG -->
        <div class="h-32 bg-gray-100 flex items-center justify-center">

            <img src="https://barsi-img.b-cdn.net/recursos/logo-regentis.png" class="w-20 h-20 object-contain" />

        </div>

        <div class="p-3">

            <!-- TITULO -->
            <div class="text-sm font-semibold text-gray-800">
                {{ contexto.data?.titulo }}
            </div>

            <!-- DESC -->
            <div class="text-xs text-gray-500 mt-1" v-html="contexto.data?.descripcion">
            </div>

            <!-- BTN -->
            <button
                class="mt-3 w-full bg-[#FD7635] text-white py-2 rounded-full text-xs font-semibold active:scale-95 transition"
                @click="openViewer">

                {{ contexto.data?.boton_texto || 'Ver imágenes' }}

            </button>

        </div>

    </div>

    <!-- 🔥 VISOR -->
    <StoryViewer v-model="showViewer" :imagenes="contexto.data?.imagenes || []" />

</template>

<script setup>

import { ref } from 'vue'

import StoryViewer from '../../../../../components/StoryViewer.vue'

const props = defineProps({
    contexto: Object
})

const showViewer = ref(false)

function openViewer() {

    showViewer.value = true

}

</script>