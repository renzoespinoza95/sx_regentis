<template>

    <div class="bg-white rounded-xl shadow-md p-3 flex items-center gap-3">

        <!-- FOTO -->
        <img src="https://picsum.photos/60" class="w-12 h-12 rounded-lg object-cover" />

        <!-- INFO -->
        <div class="flex-1">

            <div class="flex justify-between text-sm font-semibold">
                <span>{{ item.nombre }}</span>
                <span>cel: {{ item.cel }}</span>
            </div>

            <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>{{ item.rol }}</span>
                <span>DNI: {{ item.dni }}</span>
            </div>

        </div>

    </div>

</template>

<script setup>
defineProps({
    item: Object
})
</script>