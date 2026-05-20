<template>

    <div v-if="visible" class="
            fixed
            inset-0
            z-[999]
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
        " @click.self="close">

        <div ref="box" class="
                bg-white
                rounded-[32px]
                w-full
                max-w-md
                max-h-[90vh]
                overflow-hidden
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                flex
                flex-col
            ">

            <!-- HEADER -->
            <div class="
                    relative
                    px-5
                    pt-5
                    pb-4
                    text-white
                " style="
                    background:
                    linear-gradient(
                        135deg,
                        #FD7635 0%,
                        #ff995e 100%
                    );
                ">

                <!-- CLOSE -->
                <button class="
                        absolute
                        top-4
                        right-4
                        w-10
                        h-10
                        rounded-full
                        bg-white/20
                        text-white
                        flex
                        items-center
                        justify-center
                    " @click="close">

                    <i class="fa fa-times"></i>

                </button>

                <div class="text-2xl font-black">

                    Venta
                    #{{ venta?.product_order_id }}

                </div>

                <div class="text-sm opacity-90 mt-1">

                    {{
                        fecha
                    }}

                </div>

            </div>

            <!-- BODY -->
            <div class="
                    flex-1
                    overflow-y-auto
                    p-5
                    space-y-5
                ">

                <!-- CLIENTE -->
                <div class="
                        bg-[#fff4ee]
                        rounded-3xl
                        p-4
                    ">

                    <div class="
                            font-bold
                            text-gray-800
                            mb-2
                        ">

                        Cliente 👤

                    </div>

                    <div class="text-sm text-gray-700">

                        {{
                            venta?.cliente_nombre
                            || 'Cliente'
                        }}

                    </div>

                    <div class="
                            text-xs
                            text-gray-500
                            mt-1
                        ">

                        DNI:
                        {{
                            venta?.cliente_dni
                            || '—'
                        }}

                    </div>

                    <div class="
                            text-xs
                            text-gray-500
                            mt-1
                        ">

                        Cel:
                        {{
                            venta?.cliente_celular
                            || '—'
                        }}

                    </div>

                </div>

                <!-- INFO -->
                <div class="
                        bg-gray-50
                        rounded-3xl
                        p-4
                        text-sm
                        space-y-2
                    ">

                    <div>

                        💳
                        Pago:
                        <b>
                            {{
                                venta?.tipo_pago
                                || '—'
                            }}
                        </b>

                    </div>

                    <div>

                        👨‍💼
                        Usuario:
                        <b>
                            {{
                                venta?.usuario_nombre
                                || '—'
                            }}
                        </b>

                    </div>

                    <div>

                        🍽️
                        Mesa:
                        <b>
                            {{
                                venta?.mesa_nombre
                                || '—'
                            }}
                        </b>

                    </div>

                </div>

                <!-- PRODUCTOS -->
                <div>

                    <div class="
                            font-bold
                            text-gray-800
                            mb-3
                        ">

                        Productos 🛒

                    </div>

                    <div class="space-y-3">

                        <div v-for="d in venta?.detalles || []" :key="d.product_order_detail_id" class="
                                border
                                rounded-2xl
                                p-3
                            ">

                            <div class="
                                    font-semibold
                                    text-sm
                                    text-gray-800
                                ">

                                {{
                                    d.product_name
                                }}

                            </div>

                            <div class="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                ">

                                {{
                                    d.amount
                                }}
                                ×
                                S/
                                {{
                                    Number(
                                        d.price_item || 0
                                    ).toFixed(2)
                                }}

                            </div>

                            <div class="
                                    mt-2
                                    text-right
                                    font-bold
                                    text-[#FD7635]
                                ">

                                S/
                                {{
                                    Number(
                                        d.total_item || 0
                                    ).toFixed(2)
                                }}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <!-- FOOTER -->
            <div class="
                    border-t
                    p-5
                    bg-white
                ">

                <div class="
                        flex
                        justify-between
                        items-center
                    ">

                    <div class="
                            text-gray-500
                            text-sm
                        ">

                        Total

                    </div>

                    <div class="
                            text-2xl
                            font-black
                            text-[#FD7635]
                        ">

                        S/
                        {{
                            Number(
                                venta?.total_fees || 0
                            ).toFixed(2)
                        }}

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    ref,
    nextTick,
    computed
}
    from 'vue'

import gsap
    from 'gsap'

import {
    bus
}
    from '../../../../../services/eventBus.js'

const visible =
    ref(false)

const box =
    ref(null)

const venta =
    ref(null)

const fecha =
    computed(() => {

        if (
            !venta.value?.fecha_creacion
        ) {

            return ''

        }

        return new Date(

            venta.value.fecha_creacion

        ).toLocaleDateString(
            'es-PE'
        )

    })

async function open(
    item
) {

    bus.emit(
        'bottomnav:toggle',
        true
    )

    venta.value =
        item

    visible.value =
        true

    await nextTick()

    gsap.fromTo(

        box.value,

        {
            scale: 0.7,
            opacity: 0
        },

        {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        }

    )

}

function close() {

    bus.emit(
        'bottomnav:toggle',
        false
    )

    gsap.to(

        box.value,

        {

            scale: 0.7,

            opacity: 0,

            duration: 0.2,

            onComplete: () => {

                visible.value = false

            }

        }

    )

}

defineExpose({

    open

})

</script>
