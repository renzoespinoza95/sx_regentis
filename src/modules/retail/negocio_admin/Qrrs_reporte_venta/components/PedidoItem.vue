<template>

    <div class="relative bg-white rounded-2xl shadow-md p-3 cursor-pointer active:scale-[0.98] transition"
        @click="irDetalle">

        <!-- 🔥 CHECK -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">

            <!-- ENVIADO -->
            <i v-if="
                (
                    item.estado
                    ||
                    item.entrega_estado
                    ||
                    ''
                ).toLowerCase() === 'enviado'
            " class="fa fa-send text-blue-500 opacity-20" style="font-size: 110px;">
            </i>

            <!-- TRANSITO -->
            <i v-else-if="
                (
                    item.estado
                    ||
                    item.entrega_estado
                    ||
                    ''
                ).toLowerCase() === 'transito'
            " class="fa fa-shopping-cart text-orange-500 opacity-20" style="font-size: 110px;">
            </i>

            <!-- COMPRADO -->
            <i v-else-if="
                (
                    item.estado
                    ||
                    item.entrega_estado
                    ||
                    ''
                ).toLowerCase() === 'comprado'
            " class="fa fa-check-circle text-green-500 opacity-20" style="font-size: 110px;">
            </i>

            <!-- RECHAZADO -->
            <i v-else-if="
                (
                    item.estado
                    ||
                    item.entrega_estado
                    ||
                    ''
                ).toLowerCase() === 'rechazado'
            " class="fa fa-times-circle text-red-500 opacity-20" style="font-size: 110px;">
            </i>

            <!-- DEFAULT -->
            <i v-else class="fa fa-cube text-gray-400 opacity-20" style="font-size: 110px;">
            </i>

        </div>

        <div class="flex gap-3">

            <!-- INFO -->
            <div class="flex-1 min-w-0">

                <!-- TOP -->
                <div class="flex justify-between items-start gap-2">

                    <div class="font-semibold text-sm text-gray-800 truncate">

                        #{{ item.carrito_id }}
                        —
                        {{ item.neg_nombre }}

                    </div>

                    <div class="text-xs text-gray-500 whitespace-nowrap">

                        {{ fechaFormateada }}

                    </div>

                </div>

                <!-- CLIENTE -->
                <div class="mt-1 text-xs text-gray-500">

                    👤
                    {{
                        item.cliente
                        ||
                        item.nombres_apellidos
                        ||
                        item.sobrenombre
                    }}

                </div>

                <!-- DIRECCION -->
                <div class="mt-1 text-xs text-gray-500 line-clamp-1">

                    📍
                    {{ item.direccion }}

                </div>

                <!-- PRODUCTOS -->
                <div class="mt-2 text-xs text-gray-600">

                    {{
                        item.productos
                        ||
                        item.total_productos
                    }}
                    productos

                </div>

                <!-- TOTAL -->
                <div class="mt-1 font-bold text-sm text-gray-800">

                    S/
                    {{
                        Number(

                            item.total
                            ||
                            item.total_pedido
                            ||
                            0

                        ).toFixed(2)
                    }}

                </div>

                <!-- ESTADO -->
                <div class="mt-2">

                    <span
                        class="inline-block text-[11px] px-2 py-1 rounded-full bg-green-100 text-green-600 font-semibold">

                        {{
                            item.estado
                            ||
                            item.entrega_estado
                        }}

                    </span>

                    <span
                        class="inline-block text-[11px] px-2 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold">

                        {{
                            item.tipo_pedido
                        }}

                    </span>

                </div>

            </div>

            <!-- IMG -->
            <div class="w-24 h-24 shrink-0">

                <img :src="item.neg_logo
                    ||
                    `https://picsum.photos/200?random=${item.neg_id}`
                    " class="w-full h-full rounded-xl object-cover" />

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    computed
}
    from 'vue'

import {
    useRouter
}
    from 'vue-router'
import {
    useUsuario
}
    from '../../../../../services/usuarioService.js'

const router =
    useRouter()
const {
    getTipoxusuId
} = useUsuario()

const props =
    defineProps({

        item: Object,

        estadoActual: {

            type: String,

            default: ''

        }

    })

const fechaFormateada =
    computed(() => {

        if (
            !props.item.fecha
            &&
            !props.item.fecha_creacion
        ) {
            return ''
        }

        return new Date(

            props.item.fecha
            ||
            props.item.fecha_creacion

        ).toLocaleDateString(
            'es-PE'
        )

    })


function irDetalle() {

    const tipoxusu_id =

        Number(
            getTipoxusuId()
        )

    /* ======================================
       🚚 DELIVERY
    ====================================== */

    if (
        tipoxusu_id === 4
    ) {

        router.push(

            `/Khjs_despachar/${props.item.carrito_id}`

        )

        return

    }

    /* ======================================
       🏪 NEGOCIO
    ====================================== */

    router.push(

        `/Lfdx_detalle_pedido/${props.item.carrito_id}`

    )

}

</script>