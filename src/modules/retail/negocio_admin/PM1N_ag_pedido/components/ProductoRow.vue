<template>

    <div class="bg-gray-50 rounded-md px-3 py-2 text-sm flex items-center gap-3">

        <!-- 🔥 IMAGEN -->
        <img src="https://picsum.photos/50" class="w-8 h-8 rounded object-cover" />

        <!-- 🔥 CONTENIDO -->
        <div class="flex-1 flex items-center gap-2">

            <!-- NOMBRE -->
            <span class="text-gray-800">
                {{ item.nombre }}
            </span>

            <!-- PRECIO UNITARIO -->
            <span class="text-gray-500">
                S/.{{ item.precio }}
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

        <!-- 🔥 BOTONES -->
        <div class="flex items-center gap-1">

            <!-- EDIT -->
            <div class="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-green-500"
                @click="emit('edit', item)">
                <i class="fa fa-pencil text-white text-xs"></i>
            </div>

            <!-- DELETE -->
            <div class="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-green-500"
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
    return props.item.precio * props.item.cantidad
})

const emit = defineEmits(['edit', 'delete'])
</script>