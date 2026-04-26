<template>
    <div>
        <label class="text-sm font-medium">Negocio</label>

        <div class="mt-1 bg-gray-100 rounded-xl px-3 py-2 flex justify-between items-center cursor-pointer"
            @click="$emit('open')">
            <span class="text-gray-500 text-sm">
                {{ modelValue?.nombre || 'Elegir' }}
            </span>

            <i class="fa fa-chevron-down text-gray-400"></i>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: Object
})

defineEmits(['open'])
</script>