<template>

    <div class="mt-3 w-64 bg-white rounded-2xl overflow-hidden shadow-lg">

        <!-- HEADER -->
        <div class="h-28 bg-gray-100 flex items-center justify-center">

            <i class="fa fa-shopping-basket text-4xl text-[#FD7635]"></i>

        </div>

        <div class="p-3">

            <!-- PEDIDO -->
            <div class="text-sm font-semibold text-gray-800">
                Pedido #{{ contexto.data?.pedido_id }}
            </div>

            <!-- ESTADO -->
            <div class="text-xs text-gray-500 mt-1">
                Estado:
                {{ contexto.data?.estado }}
            </div>

            <!-- TOTAL -->
            <div class="text-xs text-[#FD7635] font-bold mt-1">
                S/ {{ contexto.data?.total }}
            </div>

            <!-- BTN -->
            <button
                class="mt-3 w-full bg-[#FD7635] text-white py-2 rounded-full text-xs font-semibold active:scale-95 transition"
                @click="ver">

                Ver pedido

            </button>

        </div>

    </div>

</template>

<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    contexto: Object
})

function ver() {

    const url = props.contexto?.data?.url

    if (!url) return

    router.push(url)

}

</script>
