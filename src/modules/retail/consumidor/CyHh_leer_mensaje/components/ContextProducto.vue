<template>

    <div class="mt-3 w-64 bg-white rounded-2xl overflow-hidden shadow-lg">

        <!-- IMG -->
        <img v-if="contexto.data?.imagen" :src="contexto.data.imagen" class="w-full h-28 object-cover" />

        <div class="p-3">

            <!-- NOMBRE -->
            <div class="text-sm font-semibold text-gray-800 line-clamp-2">
                {{ contexto.data?.nombre }}
            </div>

            <!-- PRECIO -->
            <div class="text-xs text-[#FD7635] font-bold mt-1">
                S/ {{ contexto.data?.precio }}
            </div>

            <!-- BTN -->
            <button
                class="mt-3 w-full bg-[#FD7635] text-white py-2 rounded-full text-xs font-semibold active:scale-95 transition"
                @click="ver">

                Ver producto

            </button>

        </div>

    </div>

</template>

<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    contexto: Object
})

function ver() {

    const url = props.contexto?.data?.url

    if (!url) return

    router.push(url)

}

</script>
