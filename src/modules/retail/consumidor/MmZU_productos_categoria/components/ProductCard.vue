<template>

    <div class="bg-white rounded-2xl shadow-md overflow-hidden" @click="irDetalle">

        <!-- IMAGEN -->
        <div class="relative">

            <img :src="producto.img" class="w-full h-28 object-cover" />

            <!-- DESCUENTO -->
            <span class="absolute top-2 left-2 bg-[#FD7635] text-white text-xs px-2 py-1 rounded-full">
                -{{ producto.descuento }}%
            </span>

            <!-- FAVORITO -->
            <div class="absolute top-2 right-2 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow">
                <i class="fa fa-heart text-[#FD7635] text-xs"></i>
            </div>

        </div>

        <!-- INFO -->
        <div class="p-3">

            <!-- TITULO -->
            <div class="text-sm font-semibold text-gray-800 truncate">
                {{ producto.nombre }}
            </div>

            <!-- RATING -->
            <div class="flex items-center text-xs text-yellow-400 mt-1">
                ★ {{ producto.rating }}
                <span class="text-gray-400 ml-1">
                    | {{ producto.stock }}
                </span>
            </div>

            <!-- MARCA -->
            <div class="text-xs text-gray-400 mt-1">
                {{ producto.marca }}
            </div>

            <!-- PRECIOS -->
            <div class="flex items-center gap-2 mt-2">

                <span class="text-orange-500 font-bold">
                    ${{ producto.precio }}
                </span>

                <span class="text-gray-400 line-through text-xs">
                    ${{ producto.precio_old }}
                </span>

            </div>

        </div>

        <!-- BOTON -->
        <div class="px-3 pb-3">
            <button class="w-full bg-[#FD7635] text-white py-2 rounded-xl text-sm">
                🛍
            </button>
        </div>

    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    producto: Object
})

function irDetalle() {
    router.push({
        path: '/QZMq_detalle_prod',
        query: {
            id: props.producto.id,
            nombre: props.producto.nombre
        }
    })
}
</script>