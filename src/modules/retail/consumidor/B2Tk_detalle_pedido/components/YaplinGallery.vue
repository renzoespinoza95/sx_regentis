<template>

    <div v-if="yaplins.length" class="mt-5">

        <!-- TITULO -->
        <div class="text-sm font-semibold text-gray-700 mb-3">

            Capturas Yaplin

        </div>

        <!-- GRID -->
        <div class="grid grid-cols-3 gap-3">

            <div v-for="(y, i) in yaplins" :key="y.yaplin_id"
                class="relative rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-white active:scale-95 transition cursor-pointer"
                @click="openViewer(i)">

                <!-- IMG -->
                <img :src="y.imagen_url" class="w-full h-28 object-cover" />

                <!-- OVERLAY -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                </div>

                <!-- BADGE -->
                <div class="absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg backdrop-blur"
                    :class="badgeClass(y.estado)">

                    <template v-if="isOk(y.estado)">

                        <i class="fa fa-check mr-1"></i>

                    </template>

                    <template v-else>

                        <i class="fa fa-times mr-1"></i>

                    </template>

                    {{ y.estado }}

                </div>

            </div>

        </div>

    </div>

    <!-- 🔥 STORY -->
    <StoryViewer v-model="showViewer" :imagenes="imagenesViewer" />

</template>

<script setup>

import {
    ref,
    computed
}
    from 'vue'

import StoryViewer
    from '../../../../../components/StoryViewer.vue'

const props = defineProps({

    yaplins: {

        type: Array,

        default: () => []

    }

})

const showViewer = ref(false)

const imagenIndex = ref(0)

const imagenesViewer = computed(() => {

    return props.yaplins.map(
        y => y.imagen_url
    )

})

function openViewer(i) {

    imagenIndex.value = i

    showViewer.value = true

}

function isOk(estado) {

    estado =
        String(estado || '')
            .toLowerCase()

    return [

        'procesado',
        'pendiente'

    ].includes(estado)

}

function badgeClass(estado) {

    estado =
        String(estado || '')
            .toLowerCase()

    if (

        estado === 'procesado'

    ) {

        return `
            bg-emerald-500/90
            text-white
        `
    }

    if (

        estado === 'pendiente'

    ) {

        return `
            bg-yellow-400/90
            text-black
        `
    }

    return `
        bg-red-500/90
        text-white
    `

}

</script>