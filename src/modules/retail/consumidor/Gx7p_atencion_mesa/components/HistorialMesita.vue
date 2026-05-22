<template>

    <div class="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-gray-100
            overflow-hidden
        ">

        <!-- HEADER -->
        <div class="
                px-4
                py-4
                border-b
                bg-gradient-to-r
                from-orange-50
                to-white
                flex
                items-center
                justify-between
            ">

            <div>

                <div class="
                        text-sm
                        font-black
                        text-gray-800
                    ">

                    Pedido actual

                </div>

                <div class="
                        text-xs
                        text-gray-400
                        mt-1
                    ">

                    Productos previamente registrados

                </div>

            </div>

            <div class="
                    w-11
                    h-11
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                ">

                🍽️

            </div>

        </div>

        <!-- EMPTY -->
        <div v-if="!detalles.length" class="
                py-12
                px-4
                flex
                flex-col
                items-center
                justify-center
                text-center
            ">

            <!-- EMOJI -->
            <div class="
                    text-5xl
                ">

                🍜

            </div>

            <!-- TITLE -->
            <div class="
                    mt-4
                    text-sm
                    font-semibold
                    text-gray-700
                ">

                Esta mesa aún no tiene pedidos

            </div>

            <!-- SUB -->
            <div class="
                    mt-1
                    text-xs
                    text-gray-400
                    max-w-[220px]
                ">

                Agrega productos usando el botón "+"
                para comenzar el pedido

            </div>

        </div>

        <!-- LIST -->
        <div v-else class="
                divide-y
            ">

            <HistorialProductoItem v-for="item in detalles" :key="item.carrito_detalle_id" :item="item"
                @edit="$emit('edit', item)" @delete="$emit('delete', item)" />

        </div>

    </div>

</template>

<script setup>

import HistorialProductoItem
    from './HistorialProductoItem.vue'

defineProps({

    detalles: {

        type:
            Array,

        default:
            () => []

    }

})

defineEmits([
    'edit',
    'delete'
])

</script>