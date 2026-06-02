<template>

    <div v-if="pedidos.length" class="space-y-2">

        <div class="
                flex
                items-center
                justify-between
            ">

            <div class="
                    text-sm
                    font-semibold
                    text-gray-700
                ">

                Pedidos abiertos

            </div>

            <div class="
                    text-xs
                    text-gray-500
                ">

                {{ pedidos.length }}
                pedidos

            </div>

        </div>

        <div ref="scrollRef" class="
        overflow-x-auto
        no-scrollbar
        select-none
        cursor-grab
        active:cursor-grabbing
    " @mousedown="
        onMouseDown
    " @mouseleave="
        onMouseLeave
    " @mouseup="
        onMouseUp
    " @mousemove="
        onMouseMove
    ">

            <div class="
                    grid
                    grid-rows-2
                    grid-flow-col
                    gap-2
                    w-max
                    pb-2
                ">

                <div v-for="pedido in pedidos" :key="pedido
                    .venta_borrador_id
                    " class="
                        relative
                        px-3
                        py-2
                        rounded-full
                        text-xs
                        font-semibold
                        cursor-pointer
                        transition
                        active:scale-95
                        min-w-[180px]
                        max-w-[220px]
                    " :class="Number(
                        pedido
                            .venta_borrador_id
                    )

                        ===

                        Number(
                            activoId
                        )

                        ?

                        'bg-orange-500 text-white'

                        :

                        'bg-orange-100 text-orange-700'

                        " @click="
                            seleccionar(
                                pedido
                            )
                            ">

                    <div class="
                            flex
                            items-center
                            gap-2
                        ">

                        <span>

                            {{
                                getEmoji(
                                    pedido
                                )
                            }}

                        </span>

                        <span class="
                                truncate
                                flex-1
                            ">

                            {{
                                String(

                                    pedido
                                        .cliente_nombre

                                    ||

                                    'PUBLICO GENERAL'

                                )
                                    .toUpperCase()
                            }}

                        </span>

                        <div class="
                                w-5
                                h-5
                                rounded-full
                                flex
                                items-center
                                justify-center
                                bg-red-500
                                text-white
                                text-[10px]
                                shrink-0
                            " @click.stop="
                                eliminar(
                                    pedido
                                )
                                ">

                            <i class="
                                    fa
                                    fa-times
                                "></i>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>
import {
    ref,
    onMounted,
    onBeforeUnmount
}
    from 'vue'

const scrollRef =
    ref(null)

let isDown =
    false

let startX =
    0

let scrollLeft =
    0

function onMouseDown(e) {

    isDown = true

    startX =

        e.pageX

        -

        scrollRef.value
            .offsetLeft

    scrollLeft =

        scrollRef.value
            .scrollLeft

}

function onMouseLeave() {

    isDown = false

}

function onMouseUp() {

    isDown = false

}

function onMouseMove(e) {

    if (!isDown) {

        return

    }

    e.preventDefault()

    const x =

        e.pageX

        -

        scrollRef.value
            .offsetLeft

    const walk =

        (x - startX)

        * 1.5

    scrollRef.value.scrollLeft =

        scrollLeft

        -

        walk

}



const props =
    defineProps({

        pedidos: {

            type:
                Array,

            default:
                () => []

        },

        activoId: {

            type:
                Number,

            default:
                0

        }

    })

const emit =
    defineEmits([

        'select',

        'delete'

    ])

function seleccionar(
    pedido
) {

    emit(
        'select',
        pedido
    )

}

function eliminar(
    pedido
) {

    emit(
        'delete',
        pedido
    )

}

function getEmoji(
    pedido
) {

    const nombre =

        String(

            pedido
                ?.cliente_nombre

            ||

            ''

        )
            .toUpperCase()

    if (

        nombre ===
        'PUBLICO GENERAL'

    ) {

        return '👥'

    }

    return '👤'

}

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {

    display: none;

}

.no-scrollbar {

    scrollbar-width: none;

}
</style>