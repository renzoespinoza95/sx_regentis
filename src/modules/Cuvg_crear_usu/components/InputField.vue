<template>
    <div>
        <label class="text-sm font-medium text-gray-500 mb-1 block">
            {{ label }}
        </label>

        <input :type="type || 'text'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            class="input-modern" />
    </div>
</template>

<script setup>
defineProps({
    label: String,
    type: String,
    modelValue: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-modern {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;

    background: #f3f4f6;
    /* gris suave */
    border: 1px solid #e5e7eb;

    font-size: 14px;
    outline: none;

    transition: all 0.2s ease;
}

.input-modern:focus {
    border-color: #45A29A;
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(69, 162, 154, 0.15);
}
</style>