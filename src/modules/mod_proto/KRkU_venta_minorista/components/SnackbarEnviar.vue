<template>
    <div class="fixed bottom-24 left-0 right-0 flex justify-center z-30">
        <div class="bg-orange-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-4">

            <span class="font-medium">
                enviar ventas
            </span>

            <button @click="emit('enviar')" class="bg-white text-orange-600 px-3 py-1 rounded font-semibold">
                enviar
            </button>

            <button @click="emit('cancelar')" class="border border-white px-3 py-1 rounded">
                cancelar
            </button>

        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['enviar', 'cancelar'])
</script>
