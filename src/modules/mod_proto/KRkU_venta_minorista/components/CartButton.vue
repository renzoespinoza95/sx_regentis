<template>
    <div @click="emit('grabar')"
        class="bg-green-600 w-14 h-14 flex items-center justify-center rounded shadow-md cursor-pointer active:scale-95 transition">
        <i class="fa fa-microphone text-white text-xl"></i>
    </div>
</template>

<script setup>
const emit = defineEmits(['grabar'])
</script>