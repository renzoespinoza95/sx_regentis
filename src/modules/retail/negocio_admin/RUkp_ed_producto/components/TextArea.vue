<template>
    <div>
        <label class="text-sm text-gray-600">Descripcion</label>

        <textarea v-model="model" rows="5" class="w-full mt-1 border rounded-md px-3 py-2 text-sm resize-none" />
    </div>
</template>

<script setup>
const model = defineModel()
</script>