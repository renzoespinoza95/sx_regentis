<template>

    <div class="product-card bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">

        <!-- IMG -->
        <div class="relative">

            <img :src="producto.img" class="w-full h-28 object-cover" />

            <!-- DESCUENTO -->
            <span class="absolute top-2 left-2 bg-[#FD7635] text-white text-xs px-2 py-1 rounded-full">
                -{{ producto.descuento }}%
            </span>

            <!-- ❌ ELIMINAR -->
            <div class="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow cursor-pointer"
                style="background:#EF4444" @click.stop="eliminar">
                <i class="fa fa-times text-white text-xs"></i>
            </div>

        </div>

        <!-- INFO -->
        <div class="p-3 flex flex-col flex-1">

            <div class="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight h-[42px]">
                {{ producto.name }}
            </div>

            <div class="flex items-center text-xs text-yellow-400 mt-1">
                ★ 5
                <span class="text-gray-400 ml-1">
                    | {{ producto.stock || 0 }}
                </span>
            </div>

            <div class="text-xs text-gray-400 mt-1">
                {{ producto.marca || 'Marca' }}
            </div>

            <div class="flex items-center gap-2 mt-2">
                <span class="text-orange-500 font-bold">
                    S/{{ producto.price }}
                </span>
                <span class="text-gray-400 line-through text-xs">
                    antes S/{{ producto.price }}
                </span>
            </div>

        </div>

        <!-- BOTON -->
        <div class="px-3 pb-3 mt-auto">
            <button class="w-full bg-[#FD7635] text-white py-2 rounded-xl text-sm">
                Pedir ahora
            </button>
        </div>

    </div>

    <!-- 🔥 SNACKBAR -->
    <AppSnackbar ref="snackbarRef" />

</template>

<script setup>
import { ref } from 'vue'
import AppSnackbar from '../../../../../components/layout/AppSnackbar.vue'

const props = defineProps({
    producto: Object
})

const emit = defineEmits(['eliminar'])

const snackbarRef = ref(null)

// 🔥 CONFIRMACIÓN
function eliminar() {

    snackbarRef.value?.open(
        '¿Eliminar de favoritos? 💔',
        () => {
            emit('eliminar', props.producto.fav_id)
        }
    )

}
</script>