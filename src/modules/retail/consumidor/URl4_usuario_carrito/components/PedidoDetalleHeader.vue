<template>

    <div class="
        flex
        items-center
        gap-3
        bg-white
        rounded-2xl
        shadow-md
        p-4
    ">

        <!-- BACK -->
        <button @click="
            emit('back')
            " class="
                w-11
                h-11
                rounded-full
                bg-orange-100
                text-orange-600
                flex
                items-center
                justify-center
                shadow-sm
                active:scale-95
                transition
            ">

            <i class="
                    fa
                    fa-arrow-left
                "></i>

        </button>

        <!-- INFO -->
        <div class="
                flex-1
            ">

            <div class="
                    text-lg
                    font-black
                    text-gray-800
                ">

                Detalle del pedido

            </div>

            <div class="
                    text-sm
                    text-gray-500
                ">

                Pedido #{{ carritoId }}

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({

    carritoId: {

        type:
            [String, Number],

        default:
            null

    }

})

const emit =
    defineEmits([

        'back'

    ])

</script>
