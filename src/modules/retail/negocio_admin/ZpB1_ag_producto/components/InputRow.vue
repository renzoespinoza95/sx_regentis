<template>
    <div class="grid grid-cols-2 gap-3">

        <div>
            <label class="text-sm text-gray-600">Precio</label>
            <input v-model="precioModel" type="number" class="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
        </div>

        <div>
            <label class="text-sm text-gray-600">Stock</label>
            <input v-model="stockModel" type="number" class="w-full mt-1 border rounded-md px-3 py-2 text-sm" />
        </div>

    </div>
</template>

<script setup>
const precioModel = defineModel('precio')
const stockModel = defineModel('stock')
</script>