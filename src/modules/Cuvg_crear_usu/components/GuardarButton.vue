<template>
    <button @click="$emit('click')" :disabled="disabled"
        class="w-full py-3 rounded-xl shadow-lg font-semibold transition" :class="disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#FD7635] text-white hover:scale-[1.02]'">
        Guardar
    </button>
</template>

<script setup>
defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
})

defineEmits(['click'])
</script>