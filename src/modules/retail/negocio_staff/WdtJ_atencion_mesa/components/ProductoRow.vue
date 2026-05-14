<template>

    <div class="bg-gray-50 rounded-md px-2 py-2 text-sm flex items-center gap-2">

        <!-- 🔥 IMAGEN -->
        <img src="https://picsum.photos/50" class="w-8 h-8 rounded object-cover" />

        <!-- 🔥 NOMBRE -->
        <div class="flex-1">
            {{ item.nombre }} x{{ item.cantidad }}
        </div>

        <!-- 🔥 DETALLE -->
        <div class="flex items-center gap-2 text-xs">

            <span>{{ item.unidad }}</span>
            <span>{{ item.precio }}</span>

            <!-- EDIT -->
            <div class="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                :style="{ background: mercado.topnavbar_color }">
                <i class="fa fa-pencil text-white text-xs"></i>
            </div>

            <!-- DELETE -->
            <div class="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                :style="{ background: mercado.topnavbar_color }">
                <i class="fa fa-trash text-white text-xs"></i>
            </div>

        </div>

    </div>

</template>

<script setup>
import { useMercado } from '../../../../../services/useMercado.js'
const { mercado } = useMercado()

defineProps({ item: Object })
</script>