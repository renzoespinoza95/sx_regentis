<template>
    <div @click="emit('detener')"
        class="bg-red-600 w-16 h-16 flex items-center justify-center rounded shadow-lg cursor-pointer active:scale-95 transition">
        <i class="fa fa-stop text-white text-2xl"></i>
    </div>
</template>

<script setup>
const emit = defineEmits(['detener'])
</script>