<template>
    <div class="bg-white border border-gray-300 rounded-md p-3 shadow-sm flex justify-between items-center">

        <div class="text-sm">
            {{ item.nombre }}
        </div>

        <div class="flex items-center gap-3 text-sm">
            <span>x{{ item.cantidad }}</span>
            <span>{{ item.unidad }}</span>
            <span class="font-semibold">S/{{ item.precio }}</span>
        </div>

    </div>
</template>

<script setup>
defineProps(['item'])
</script>