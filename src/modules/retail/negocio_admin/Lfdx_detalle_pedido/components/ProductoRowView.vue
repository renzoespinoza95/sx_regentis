<template>

    <div class="bg-gray-50 rounded-md px-3 py-2 flex items-center gap-3 text-sm">

        <!-- 🔥 IMAGEN -->
        <img src="https://picsum.photos/60" class="w-10 h-10 rounded object-cover" />

        <!-- 🔥 INFO -->
        <div class="flex-1 flex items-center gap-3">

            <!-- NOMBRE -->
            <span class="text-gray-800">
                {{ item.nombre }}
            </span>

            <!-- PRECIO UNITARIO -->
            <span class="text-gray-500">
                S/{{ item.precio }}
            </span>

            <!-- CANTIDAD -->
            <span class="text-blue-600 font-semibold">
                x{{ item.cantidad }} {{ item.unidad }}
            </span>

        </div>

        <!-- 🔥 TOTAL -->
        <div class="text-gray-800 font-medium">
            S/{{ total }}
        </div>

    </div>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    item: Object
})

const total = computed(() => {
    return props.item.precio * props.item.cantidad
})
</script>