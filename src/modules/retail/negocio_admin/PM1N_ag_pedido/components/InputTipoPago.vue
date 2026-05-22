<template>

    <div>

        <label class="text-sm text-gray-600">

            Tipo de pago

        </label>

        <div class="flex flex-wrap gap-2 mt-2">

            <!-- EFECTIVO -->
            <div @click="model = 'EFECTIVO'"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 'EFECTIVO'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700'
                    ">

                💵 EFECTIVO

            </div>

            <!-- YAPE -->
            <div @click="model = 'YAPE'"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 'YAPE'
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 text-purple-700'
                    ">

                📱 YAPE

            </div>

            <!-- PLIN -->
            <div @click="model = 'PLIN'"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 'PLIN'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-700'
                    ">

                ⚡ PLIN

            </div>

            <!-- TRANSFERENCIA -->
            <div @click="model = 'TRANFERENCIA'"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 'TRANFERENCIA'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-100 text-orange-700'
                    ">

                🏦 TRANSFERENCIA

            </div>

            <!-- POR PAGAR -->
            <!-- POR PAGAR -->
            <div v-if="
                showPorPagar
            " @click="
        model = 'POR PAGAR'
        " class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 'POR PAGAR'
        ? 'bg-gray-700 text-white'
        : 'bg-gray-200 text-gray-700'
        ">

                ⏳ POR PAGAR

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({

    showPorPagar: {

        type:
            Boolean,

        default:
            true

    }

})

const model =
    defineModel()

</script>