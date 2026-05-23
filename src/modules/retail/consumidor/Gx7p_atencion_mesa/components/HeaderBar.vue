<template>

    <div class="
            fixed
            top-0
            left-0
            right-0
            z-50
            flex
            justify-between
            items-center
            px-4
            py-4
            shadow-md
        " :style="{
            background:
                mercado.topnavbar_color
        }">

        <!-- LEFT -->
        <div class="
                flex
                items-center
                gap-2
                cursor-pointer
            " @click="$emit('back')">

            <div class="
                    w-9
                    h-9
                    bg-white
                    rounded-full
                    flex
                    items-center
                    justify-center
                ">

                <i class="
                        fa
                        fa-arrow-left
                        text-sm
                    " :style="{
                        color:
                            mercado.topnavbar_color
                    }"></i>

            </div>

            <span class="
                    text-white
                    font-semibold
                ">

                {{
                    isDetalle
                        ? mesa?.nombre
                        : 'Mesas'
                }}

            </span>

        </div>

        <!-- RIGHT -->
        <div class="
                flex
                items-center
                gap-2
            ">

            <!-- CHECKOUT -->
            <div v-if="isDetalle" class="
                    w-9
                    h-9
                    bg-white
                    rounded-full
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                " @click="$emit('checkout')">

                <i class="
                        fa
                        fa-shopping-cart
                        text-sm
                    " :style="{
                        color:
                            mercado.topnavbar_color
                    }"></i>

            </div>

            <!-- ADD -->
            <div v-if="isDetalle" class="
                    w-9
                    h-9
                    bg-white
                    rounded-full
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                " @click="$emit('openAdd')">

                <i class="
                        fa
                        fa-plus
                        text-sm
                    " :style="{
                        color:
                            mercado.topnavbar_color
                    }"></i>

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    useMercado
}
    from '../../../../../services/useMercado.js'

defineProps({

    isDetalle:
        Boolean,

    mesa:
        Object

})

defineEmits([
    'back',
    'openAdd',
    'checkout'
])

const {
    mercado
} = useMercado()

</script>