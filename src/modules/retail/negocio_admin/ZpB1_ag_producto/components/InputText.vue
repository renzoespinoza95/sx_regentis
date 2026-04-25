<template>
    <div>
        <label class="text-sm text-gray-600">{{ label }}</label>

        <input v-model="model" type="text"
            class="w-full mt-1 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" />
    </div>
</template>

<script setup>
const model = defineModel()
defineProps({ label: String })
</script>