<template>
    <div>
        <label class="text-sm text-gray-600">Precio</label>

        <input v-model="model" type="number"
            class="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
    </div>
</template>

<script setup>
const model = defineModel()
</script>