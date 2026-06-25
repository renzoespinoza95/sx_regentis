<template>

    <div>

        <!-- LABEL -->
        <div class="text-sm text-gray-600 mb-2">

            Tipo de pedido

        </div>

        <!-- PILLS -->
        <div class="
                flex
                gap-2
                overflow-x-auto
                no-scrollbar
                pb-1
            ">

            <button v-for="o in opciones" :key="o.value" @click="model = o.value" class="
                    shrink-0
                    px-4
                    py-2
                    rounded-full
                    text-xs
                    font-semibold
                    transition
                    active:scale-95
                    flex
                    items-center
                    gap-2
                " :class="model === o.value
                        ?
                        'bg-[#FD7635] text-white shadow-lg'
                        :
                        'bg-orange-100 text-orange-700'
                    ">

                <span>

                    {{ o.emoji }}

                </span>

                <span>

                    {{ o.label }}

                </span>

            </button>

        </div>

    </div>

</template>

<script setup>

const model =
    defineModel({

        default:
            'DELIVERY'

    })

const opciones = [

    {

        value:
            'DELIVERY',

        label:
            'Delivery',

        emoji:
            '🛵'

    },

    {

        value:
            'RECOGER_TIENDA',

        label:
            'Recoger',

        emoji:
            '🏪'

    },

    {

        value:
            'MESA_PEDIDO',

        label:
            'Mesa',

        emoji:
            '🍽️'

    },

    {

        value:
            'RESERVA_MENU',

        label:
            'Reserva',

        emoji:
            '📅'

    }

]

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {

    display: none;

}

.no-scrollbar {

    scrollbar-width: none;

}
</style>
