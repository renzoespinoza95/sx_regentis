<template>

    <div class="mt-6 flex justify-center">

        <button @click="irCarrito"
            class="bg-[#FD7635] text-white px-6 py-2 rounded-full text-sm shadow-md flex items-center gap-2 active:scale-95 transition">
            Siguiente
            <i class="fa fa-arrow-right"></i>
        </button>

    </div>

</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function irCarrito() {
    router.push({
        path: '/U8mi_carrito_pedido',
        query: {
            titulo: 'Carrito de compras'
        }
    })
}
</script>