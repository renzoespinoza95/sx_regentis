<template>

    <div class="relative rounded-2xl shadow-md p-3 cursor-pointer active:scale-[0.98] transition" :class="{

        'bg-green-50 border border-green-200':
            item.estado === 'enviado',

        'bg-orange-50 border border-orange-200':
            item.estado === 'transito',

        'bg-white':
            item.estado !== 'enviado'
            &&
            item.estado !== 'transito'

    }" @click="irDetalle">

        <!-- 🔥 CHECK RECIBIR -->
        <div v-if="modo === 'transito'"
            class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">

            <i class="fa fa-check-circle-o text-green-500 opacity-20" style="font-size: 110px;">
            </i>

        </div>

        <div class="flex gap-3">

            <!-- INFO -->
            <div class="flex-1 min-w-0">

                <!-- TOP -->
                <div class="flex justify-between items-start gap-2">

                    <div class="font-semibold text-sm text-gray-800 truncate">
                        #{{ item.carrito_id }}
                        —
                        {{ item.neg_nombre }}
                    </div>

                    <div class="text-xs text-gray-500 whitespace-nowrap">
                        {{ fechaFormateada }}
                    </div>

                </div>

                <!-- PUESTO -->
                <div class="mt-1 text-xs text-gray-500">
                    {{ item.neg_icono || '🏪' }}
                    {{ item.neg_puesto || 'Sin puesto' }}
                </div>

                <!-- PRODUCTOS -->
                <div class="mt-2 text-xs text-gray-600">
                    {{ item.total_productos }} productos
                </div>

                <!-- TOTAL -->
                <div class="mt-1 font-bold text-sm text-gray-800">
                    S/ {{ totalFormateado }}
                </div>

                <!-- ESTADO -->
                <div class="mt-2">

                    <span
                        class="inline-block text-[11px] px-2 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold">

                        {{ item.estado }}

                    </span>

                </div>

            </div>

            <!-- IMAGEN -->
            <div class="w-24 h-24 shrink-0">

                <img :src="`https://picsum.photos/200?random=${item.neg_id}`"
                    class="w-full h-full rounded-xl object-cover" />

            </div>

        </div>

    </div>

</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

/* =========================================
   API ENCRYPT
========================================= */
import {
    enc_barsi,
    des_barsi,
    firma
}
    from '../../../services/security'

const router = useRouter()

const props = defineProps({

    item: {
        type: Object,
        required: true
    },

    modo: {
        type: String,
        default: 'normal'
    }

})

/* =========================================
   TOTAL
========================================= */
const totalFormateado = computed(() => {
    return Number(props.item.total_pedido || 0).toFixed(2)
})

/* =========================================
   FECHA
========================================= */
const fechaFormateada = computed(() => {

    if (!props.item.fecha_creacion) return ''

    const f = new Date(props.item.fecha_creacion)

    return f.toLocaleDateString('es-PE')
})

/* =========================================
   IR DETALLE
========================================= */
async function irDetalle() {

    try {

        router.push({
            path: `/B2Tk_detalle_pedido/${props.item.carrito_id}`
        })

    } catch (e) {

        console.error('Error navegando a detalle', e)
    }
}
</script>