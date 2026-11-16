<template>

    <div v-if="modelValue" class="
            fixed
            inset-0

            bg-black/50

            z-[999999]

            flex
            items-center
            justify-center

            p-5
        ">

        <div class="
                bg-white

                rounded-3xl

                p-6

                w-full
                max-w-sm

                shadow-2xl

                text-center
            ">

            <!-- ICON -->
            <div class="
                    text-2xl
                    mb-3
                ">

                🏪

            </div>

            <!-- TITULO -->
            <div class="
                    text-lg
                    font-bold
                    text-gray-800
                ">

                Ya tienes un negocio asignado

            </div>

            <!-- DESC -->
            <div class="
                    mt-3
                    text-sm
                    text-gray-500
                    leading-6
                ">

                Tu cuenta ya está vinculada
                a un negocio 😏

            </div>

            <!-- BTN -->
            <button class="
                    mt-6

                    w-full

                    h-[52px]

                    rounded-2xl

                    bg-[#FD7635]

                    text-white

                    font-bold

                    active:scale-95

                    transition
                " @click="aceptar">

                Aceptar

            </button>

        </div>

    </div>

</template>

<script setup>

import {
    useRouter
}
    from 'vue-router'

const router =
    useRouter()

const modelValue =
    defineModel({

        default: false

    })

function aceptar() {

    modelValue.value = false

    router.replace('/')

}

</script>
