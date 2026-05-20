<template>

    <div class="grid grid-cols-2 gap-3 pt-4">

        <!-- RECHAZAR -->
        <button class="h-14 rounded-2xl bg-red-500 text-white font-bold active:scale-95 transition shadow-lg"
            @click="$emit('rechazar')">

            Rechazar

        </button>

        <!-- ENTREGAR -->
        <button class="h-14 rounded-2xl bg-green-500 text-white font-bold active:scale-95 transition shadow-lg"
            @click="$emit('entregar')">

            Entregar

        </button>

    </div>

</template>

<script setup>

defineEmits([
    'rechazar',
    'entregar'
])

</script>
