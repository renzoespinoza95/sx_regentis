<template>

    <div class="
        relative
        bg-white
        rounded-2xl
        shadow-md
        p-3
        cursor-pointer
        active:scale-[0.98]
        transition
    " @click="$emit('detalle', item)">

        <div class="flex gap-3">

            <!-- INFO -->
            <div class="flex-1 min-w-0">

                <!-- TOP -->
                <div class="flex justify-between">

                    <div class="
                            font-bold
                            text-gray-800
                            text-sm
                        ">

                        Venta
                        #{{ item.product_order_id }}

                    </div>

                    <div class="
                            text-xs
                            text-gray-500
                        ">

                        {{ fecha }}

                    </div>

                </div>

                <!-- CLIENTE -->
                <div class="
                        mt-2
                        text-sm
                        text-gray-700
                    ">

                    👤
                    {{

                        item.cliente_nombre
                        || 'Cliente'

                    }}

                </div>

                <!-- USUARIO -->
                <div class="
                        mt-1
                        text-xs
                        text-gray-500
                    ">

                    👨‍💼
                    {{
                        item.usuario_nombre
                        || '—'
                    }}

                </div>

                <!-- TIPO PAGO -->
                <div class="
                        mt-1
                        text-xs
                        text-gray-500
                    ">

                    💳
                    {{
                        item.tipo_pago
                        || '—'
                    }}

                </div>

                <!-- TOTAL -->
                <div class="
                        mt-3
                        text-lg
                        font-black
                        text-[#FD7635]
                    ">

                    S/
                    {{

                        Number(
                            item.total_fees || 0
                        ).toFixed(2)

                    }}

                </div>

            </div>

            <!-- ICON -->
            <div class="
                    w-20
                    flex
                    items-center
                    justify-center
                ">

                <i class="
                        fa
                        fa-shopping-bag
                        text-[60px]
                        text-green-500
                        opacity-20
                    ">

                </i>

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    computed
}
    from 'vue'

const props =
    defineProps({

        item: Object

    })

defineEmits([
    'detalle'
])

const fecha =
    computed(() => {

        if (
            !props.item.fecha_creacion
        ) {

            return ''

        }

        return new Date(

            props.item.fecha_creacion

        ).toLocaleDateString(
            'es-PE'
        )

    })

</script>
