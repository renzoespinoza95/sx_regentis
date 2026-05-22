<!-- MesaEstadoBadge.vue -->

<template>

    <div class="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" :class="estado === 'DISPONIBLE'
            ? 'bg-green-100 text-green-700'
            : 'bg-orange-100 text-orange-700'
        ">

        <i class="fa mr-1" :class="estado === 'DISPONIBLE'
                ? 'fa-check-circle'
                : 'fa-clock-o'
            "></i>

        {{ estado }}

    </div>

</template>

<script setup>

defineProps({

    estado:
        String

})

</script>