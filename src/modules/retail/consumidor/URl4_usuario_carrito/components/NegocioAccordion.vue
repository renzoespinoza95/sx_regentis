<template>

    <div class="
            bg-white
            rounded-2xl
            shadow-md
            overflow-hidden
        ">

        <!-- HEADER -->
        <div class="
                flex
                items-center
                gap-3
                p-4
                cursor-pointer
                active:scale-[0.99]
                transition
            " @click="
                open = !open
                ">

            <img :src="negocio.img_logo
                ||
                'https://picsum.photos/80'
                " class="
                    w-14
                    h-14
                    rounded-2xl
                    object-cover
                    border
                " />

            <div class="
                    flex-1
                ">

                <div class="
                        font-bold
                        text-gray-800
                    ">

                    {{ negocio.nombre }}

                </div>

                <div class="
                        text-xs
                        text-gray-500
                    ">

                    {{ negocio.puesto }}

                </div>

            </div>

            <div class="
                    w-9
                    h-9
                    rounded-full
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    text-orange-600
                ">

                <i class="
                        fa
                    " :class="open
                            ?
                            'fa-chevron-up'
                            :
                            'fa-chevron-down'
                        "></i>

            </div>

        </div>

        <!-- CARRITOS -->
        <div v-if="
            open
        " class="
                px-4
                pb-4
                space-y-2
            ">

            <CarritoCard v-for="
c in negocio.carritos
                " :key="c.carrito_id
                    " :carrito="c
                    " :activo="carritoIdActivo
                    ===
                    c.carrito_id
                    " @click="
                    emit(
                        'select-carrito',
                        c
                    )
                    " />

        </div>

    </div>

</template>

<script setup>

import {
    ref
}
    from 'vue'

import CarritoCard
    from './CarritoCard.vue'

defineProps({

    negocio:
        Object,

    carritoIdActivo:
        Number

})

const emit =
    defineEmits([

        'select-carrito'

    ])

const open =
    ref(false)

</script>
