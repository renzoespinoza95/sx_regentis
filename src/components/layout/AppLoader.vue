<template>
    <div v-if="show" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

        <div class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3">

            <div class="regentis-loader"></div>

            <span class="text-sm font-medium text-gray-600">
                {{ text }}
            </span>

        </div>

    </div>
</template>

<script setup>
defineProps({
    show: Boolean,
    text: {
        type: String,
        default: 'Procesando...'
    }
})
</script>