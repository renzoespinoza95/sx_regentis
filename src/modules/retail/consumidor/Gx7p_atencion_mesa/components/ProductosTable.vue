<template>

    <div>

        <!-- HEADER -->
        <div class="
                flex
                justify-between
                items-center
                mb-3
            ">

            <span class="
                    text-sm
                    font-black
                    text-gray-800
                ">

                Productos

            </span>

        </div>

        <!-- EMPTY -->
        <div v-if="!items.length" class="
                bg-gradient-to-br
                from-orange-50
                to-white
                border
                border-orange-100
                rounded-3xl
                py-12
                px-5
                flex
                flex-col
                items-center
                justify-center
                text-center
            ">

            <!-- EMOJI -->
            <div class="
                    text-6xl
                ">

                🍽️

            </div>

            <!-- TITLE -->
            <div class="
                    mt-4
                    text-base
                    font-bold
                    text-gray-700
                ">

                Esta mesa aún no tiene pedidos nuevos

            </div>

            <!-- SUB -->
            <div class="
                    mt-2
                    text-sm
                    text-gray-400
                    max-w-[240px]
                    leading-relaxed
                ">

                Presiona el botón
                <span class="font-bold text-orange-500">
                    +
                </span>
                para agregar productos al pedido

            </div>

        </div>

        <!-- LIST -->
        <div v-else class="
                space-y-2
            ">

            <ProductoRow v-for="(p, i) in items" :key="i" :item="p" @edit="$emit('edit', $event)"
                @delete="$emit('delete', $event)" />

        </div>

    </div>

</template>

<script setup>

import ProductoRow
    from './ProductoRow.vue'

defineProps({

    items:
        Array

})

defineEmits([
    'edit',
    'delete'
])

</script>