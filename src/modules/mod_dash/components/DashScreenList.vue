<template>

    <div class="mt-6">

        <div class="text-lg font-semibold mb-4">
            {{ titulo }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <DashCard v-for="scr in screens" :key="scr.screen_id" :screen="scr" />

        </div>

    </div>

</template>

<script setup>

import DashCard from './DashCard.vue'

defineProps({
    screens: Array,
    titulo: {
        type: String,
        default: 'Tus módulos'
    }
})

</script>