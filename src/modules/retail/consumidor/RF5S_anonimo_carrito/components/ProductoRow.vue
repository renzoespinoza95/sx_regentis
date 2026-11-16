<template>

    <div class="bg-gray-50 rounded-md px-3 py-2 text-sm flex items-center gap-3">

        <!-- 🔥 IMAGEN DINÁMICA DEL PRODUCTO -->
        <img :src="item.img || 'https://barsi-img.b-cdn.net/recursos/6qz5.png'"
            class="w-10 h-10 rounded-lg object-contain bg-white border p-0.5" />

        <!-- 🔥 CONTENIDO -->
        <div class="flex-1 flex items-center gap-2">

            <!-- NOMBRE -->
            <span class="text-gray-800 font-medium">
                {{ item.nombre }}
            </span>

            <!-- PRECIO UNITARIO -->
            <span class="text-gray-500 text-xs">
                S/.{{ item.precio }}
            </span>

            <!-- CANTIDAD -->
            <span class="text-blue-600 font-semibold text-xs">
                x{{ item.cantidad }} {{ item.unidad }}
            </span>

        </div>

        <!-- 🔥 TOTAL -->
        <div class="text-gray-800 font-medium">
            S/{{ total.toFixed(2) }}
        </div>

        <!-- 🔥 BOTONES -->
        <div class="flex items-center gap-1">

            <!-- EDIT -->
            <div class="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-green-500 hover:scale-105 active:scale-95 transition"
                @click="emit('edit', item)">
                <i class="fa fa-pencil text-white text-xs"></i>
            </div>

            <!-- DELETE -->
            <div class="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-red-500 hover:scale-105 active:scale-95 transition"
                @click="emit('delete', item)">
                <i class="fa fa-trash text-white text-xs"></i>
            </div>

        </div>

    </div>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    item: Object
})

const total = computed(() => {
    return Number(props.item.precio || 0) * Number(props.item.cantidad || 0)
})

const emit = defineEmits(['edit', 'delete'])
</script>