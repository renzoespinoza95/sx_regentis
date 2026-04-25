<template>
    <div>
        <label class="text-sm text-gray-600">Categoria</label>

        <div class="relative mt-1">
            <select v-model="model" class="w-full border rounded-md px-3 py-2 text-sm appearance-none">
                <option value="">Seleccionar</option>
                <option>Comida</option>
                <option>Bebidas</option>
                <option>Snacks</option>
            </select>

            <i class="fa fa-chevron-down absolute right-3 top-3 text-gray-400"></i>
        </div>
    </div>
</template>

<script setup>
const model = defineModel()
</script>