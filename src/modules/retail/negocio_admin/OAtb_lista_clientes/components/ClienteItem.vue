<template>

    <div class="bg-white rounded-xl shadow-md p-3 flex items-center gap-3">

        <!-- 🔥 AVATAR -->
        <img src="https://picsum.photos/60" class="w-10 h-10 rounded-full object-cover" />

        <!-- 🔥 CONTENIDO -->
        <div class="flex-1 text-sm">

            <!-- TOP -->
            <div class="flex justify-between font-semibold">
                <span>{{ item.nombre }}</span>
                <span>{{ item.codigo }}</span>
            </div>

            <!-- BOTTOM -->
            <div class="flex justify-between mt-1 text-gray-500">
                <span>{{ item.direccion }}</span>
                <span>DNI: {{ item.dni }}</span>
            </div>

        </div>

    </div>

</template>

<script setup>
defineProps({ item: Object })
</script>