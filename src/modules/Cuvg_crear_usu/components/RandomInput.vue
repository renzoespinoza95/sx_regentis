<template>
    <div>
        <label class="text-sm font-medium text-gray-500 mb-1 block">
            {{ label }}
        </label>

        <div class="flex gap-2">

            <!-- INPUT -->
            <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                class="input-modern flex-1" />

            <!-- BOTÓN RANDOM -->
            <button @click="$emit('random')" class="btn-random">
                🎲
            </button>

        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    modelValue: String
})

defineEmits(['update:modelValue', 'random'])
</script>

<style scoped>
/* INPUT (igual que InputField) */
.input-modern {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;

    background: #f3f4f6;
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

/* BOTÓN 🎲 */
.btn-random {
    background: #45A29A;
    color: white;

    padding: 0 14px;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 16px;

    transition: 0.2s;
}

.btn-random:hover {
    transform: scale(1.05);
}
</style>