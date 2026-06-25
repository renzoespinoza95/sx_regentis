<template>

    <div class="
            border
            rounded-2xl
            p-3
            cursor-pointer
            transition
            active:scale-[0.98]
        " :class="activo
                ?
                'border-orange-500 bg-orange-50'
                :
                'border-gray-200 bg-white'
            ">

        <div class="
                flex
                justify-between
                items-center
            ">

            <div>

                <div class="
                        font-semibold
                        text-sm
                    ">

                    Pedido #{{ carrito.carrito_id }}

                </div>

                <div class="
                        text-xs
                        text-gray-500
                    ">

                    {{ carrito.tipo_pedido }}

                </div>

            </div>

            <div class="
                    text-xs
                    font-bold
                    px-3
                    py-1
                    rounded-full
                    bg-emerald-100
                    text-emerald-700
                ">

                {{ carrito.estado }}

            </div>

        </div>

        <div class="
                mt-2
                text-xs
                text-gray-500
            ">

            {{ carrito.productos?.length || 0 }}
            productos

        </div>

    </div>

</template>

<script setup>

defineProps({

    carrito:
        Object,

    activo:
        Boolean

})

</script>
