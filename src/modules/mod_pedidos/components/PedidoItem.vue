<template>

    <div class="bg-white rounded-xl shadow-md p-3 text-sm">

        <!-- TOP -->
        <div class="flex justify-between font-semibold">
            <span>{{ item.codigo }}</span>
            <span>{{ item.fecha }}</span>
        </div>

        <!-- CLIENTE -->
        <div class="flex justify-between mt-1">
            <span>{{ item.cliente }}</span>
            <span>S/ {{ item.total }}</span>
        </div>

        <!-- DETALLE -->
        <div class="flex justify-between text-gray-500 mt-1">
            <span>{{ item.productos }} productos</span>
            <span v-if="item.repartidor">{{ item.repartidor }}</span>
        </div>

        <!-- ESTADO -->
        <div class="mt-1 text-xs">
            {{ item.estado }}
        </div>

    </div>

</template>

<script setup>
defineProps({ item: Object })
</script>