<template>

    <div class="bg-gray-50 rounded-md px-2 py-2 flex items-center gap-2 text-sm">

        <img src="https://picsum.photos/50" class="w-8 h-8 rounded object-cover" />

        <div class="flex-1">
            {{ item.nombre }} x{{ item.cantidad }}
        </div>

        <div class="text-xs text-gray-500 flex gap-2">
            <span>{{ item.unidad }}</span>
            <span>{{ item.precio }}</span>
        </div>

    </div>

</template>

<script setup>
defineProps({ item: Object })
</script>
