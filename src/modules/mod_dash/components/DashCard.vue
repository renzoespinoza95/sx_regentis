<template>

    <div class="bg-white rounded-2xl shadow-md p-4 flex gap-4 items-center cursor-pointer hover:scale-[1.02] transition"
        @click="go">

        <!-- IMAGEN -->
        <img :src="img" class="w-16 h-16 rounded-xl object-cover" />

        <!-- INFO -->
        <div class="flex-1">

            <div class="font-semibold text-gray-800">
                {{ screen.titulo }}
            </div>

            <div class="text-xs text-gray-500 mt-1">
                {{ screen.nombre }}
            </div>

            <div class="text-xs text-orange-500 mt-1">
                {{ screen.rubro_nombre }}
            </div>

        </div>

        <!-- FLECHA -->
        <div class="text-orange-500 text-lg">
            →
        </div>

    </div>

</template>

<script setup>

import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    screen: Object
})

const router = useRouter()

const img = computed(() => {
    return `https://picsum.photos/100?random=${props.screen.screen_id}`
})

function go() {
    router.push(props.screen.vue_route)
}

</script>