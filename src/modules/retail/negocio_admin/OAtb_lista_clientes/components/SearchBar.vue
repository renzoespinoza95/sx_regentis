<template>
    <div class="bg-white rounded-xl shadow-sm px-3 py-2 flex items-center gap-2">

        <i class="fa fa-search text-gray-400"></i>

        <input v-model="model" placeholder="Buscar cliente..." class="flex-1 text-sm outline-none" />

    </div>
</template>

<script setup>
const model = defineModel()
</script>