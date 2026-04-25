<template>
    <div @click="toggle" class="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition"
        :class="activo ? 'bg-green-500' : 'bg-gray-400'">
        <div class="bg-white w-6 h-6 rounded-full shadow-md transform transition"
            :class="activo ? 'translate-x-8' : 'translate-x-0'"></div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['on', 'off'])

const activo = ref(false)

const toggle = () => {
    activo.value = !activo.value
}

watch(activo, (v) => {
    if (v) emit('on')
    else emit('off')
})
</script>
