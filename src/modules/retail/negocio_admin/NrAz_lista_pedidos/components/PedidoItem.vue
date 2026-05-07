<template>

    <div class="bg-white rounded-2xl shadow-sm p-4 cursor-pointer active:scale-[0.98] transition" @click="irDetalle">

        <!-- TOP -->
        <div class="flex justify-between items-center">

            <div class="font-bold text-base">
                {{ item.codigo }}
            </div>

            <div class="text-xs text-gray-500">
                {{ item.fecha }}
            </div>

        </div>

        <!-- CLIENTE -->
        <div class="mt-3 flex justify-between items-center">

            <div>
                <div class="font-semibold text-gray-800">
                    {{ item.cliente }}
                </div>

                <div class="text-xs text-gray-500 mt-1">
                    {{ item.productos }} productos
                </div>
            </div>

            <div class="font-bold text-lg">
                S/ {{ Number(item.total).toFixed(2) }}
            </div>

        </div>

        <!-- REPARTIDOR -->
        <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">

            <i class="fa fa-motorcycle"></i>

            <span>
                {{ item.repartidor }}
            </span>

        </div>

        <!-- ESTADO -->
        <div class="mt-3">

            <span class="px-3 py-1 rounded-full text-white text-xs font-semibold" :style="{ background: colorEstado }">
                {{ item.estado }}
            </span>

        </div>

    </div>

</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    item: Object
})

const colorEstado = computed(() => {

    const estado = (props.item.estado || '').toLowerCase()

    if (estado === 'enviado') return '#22c55e'
    if (estado === 'transito') return '#f59e0b'
    if (estado === 'activo') return '#3b82f6'

    return '#6b7280'
})

function irDetalle() {

    router.push(
        `/Lfdx_detalle_pedido/${props.item.carrito_id}`
    )
}
</script>