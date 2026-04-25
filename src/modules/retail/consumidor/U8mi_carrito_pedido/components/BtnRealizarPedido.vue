<template>
    <div class="mt-6 flex justify-center">
        <button @click="irDelivery"
            class="w-full max-w-sm bg-[#FD7635] text-white py-4 rounded-full text-base font-semibold shadow-md active:scale-95 transition">
            {{ texto }}
        </button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    texto: {
        type: String,
        default: 'Realizar pedido'
    }
})

const router = useRouter()

function irDelivery() {
    router.push({
        path: '/QJB5_fecha_entrega',
        query: {
            titulo: 'Fecha de entrega'
        }
    })
}
</script>
