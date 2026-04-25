<template>
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">

        <!-- IMG -->
        <div class="relative">
            <img :src="producto.img" class="w-full h-32 object-cover" />

            <!-- DESCUENTO -->
            <span class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                -{{ producto.descuento }}%
            </span>

            <!-- CORAZON -->
            <div class="absolute top-2 right-2 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow">
                <i class="fa fa-heart text-orange-500"></i>
            </div>
        </div>

        <!-- INFO -->
        <div class="p-3">

            <div class="text-sm font-semibold truncate">
                {{ producto.nombre }}
            </div>

            <div class="text-yellow-400 text-xs mt-1">
                ★ 4.5
            </div>

            <div class="flex items-center gap-2 mt-2">
                <span class="text-orange-500 font-bold">
                    ${{ producto.precio }}
                </span>
                <span class="text-gray-400 line-through text-xs">
                    $999
                </span>
            </div>

        </div>

        <!-- BTN -->
        <div class="p-3 pt-0">
            <button class="w-full bg-orange-500 text-white py-2 rounded-xl text-sm">
                🛍
            </button>
        </div>

    </div>
</template>

<script setup>
defineProps({
    producto: Object
})
</script>