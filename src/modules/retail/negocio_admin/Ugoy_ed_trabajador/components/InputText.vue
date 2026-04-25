<template>
    <div>
        <label class="text-sm text-gray-600">{{ label }}</label>
        <input v-model="model" class="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
    </div>
</template>

<script setup>
const model = defineModel()
defineProps({ label: String })
</script>