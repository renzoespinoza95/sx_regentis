<template>
    <button
        class="w-full bg-orange-700 text-black font-semibold py-3 rounded shadow-md hover:opacity-90 transition flex items-center justify-center gap-3"
        :disabled="loading">
        <span v-if="!loading">GUARDAR</span>

        <span v-else class="flex items-center gap-2">
            <div class="regentis-loader small"></div>
            Procesando...
        </span>
    </button>
</template>

<script setup>
defineProps({
    loading: Boolean
})
</script>

<style scoped>
button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.regentis-loader.small {
    width: 20px;
    height: 20px;
}
</style>