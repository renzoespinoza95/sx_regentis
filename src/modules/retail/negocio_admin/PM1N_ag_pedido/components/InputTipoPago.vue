<template>

    <div>

        <label class="text-sm text-gray-600">

            Tipo de pago

        </label>

        <div class="flex flex-wrap gap-2 mt-2">

            <!-- EFECTIVO -->
            <div @click="model = 1"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 1
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-700'
                    ">

                💵 EFECTIVO

            </div>

            <!-- YAPE -->
            <div @click="model = 2"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 2
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-100 text-purple-700'
                    ">

                📱 YAPE

            </div>

            <!-- PLIN -->
            <div @click="model = 3"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 3
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-700'
                    ">

                ⚡ PLIN

            </div>

            <!-- TARJETA -->
            <div @click="model = 4"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 4
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-700'
                    ">

                💳 TARJETA

            </div>

            <!-- CREDITO -->
            <div @click="model = 5"
                class="px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95" :class="model === 5
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-700'
                    ">

                🧾 CREDITO

            </div>

        </div>

    </div>

</template>

<script setup>

const model = defineModel()

</script>