<template>

    <div v-if="visible" class="
            fixed
            inset-0
            z-[9999]
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
        " @click.self="close">

        <div ref="box" class="
                relative
                bg-white
                rounded-[32px]
                w-full
                max-w-md
                overflow-hidden
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
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
                        #ef4444 0%,
                        #f87171 100%
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

                    💸 Deuda

                </div>

                <div class="text-sm opacity-90 mt-1">

                    {{ cliente?.nombre }}

                </div>

            </div>

            <!-- BODY -->
            <!-- BODY -->
            <div class="
        flex
        flex-col
        h-[75vh]
    ">

                <!-- 🔥 SCROLL -->
                <div class="
            flex-1
            overflow-y-auto
            p-5
            space-y-3
            min-h-0
        ">

                    <!-- DEUDAS -->
                    <div v-for="d in deudas" :key="d.por_pagar_id" @click="selectDeuda(d)" class="
                border
                rounded-2xl
                p-3
                cursor-pointer
                active:scale-[0.98]
                transition
            " :class="deudaSeleccionada?.por_pagar_id
                ===
                d.por_pagar_id
                ?
                'bg-green-500 border-green-500 text-white'
                :
                'bg-white'
                ">

                        <!-- TOP -->
                        <div class="
                    flex
                    justify-between
                    items-center
                ">

                            <div class="
                        font-bold
                        text-sm
                    ">

                                Pedido
                                #{{ d.product_order_id }}

                            </div>

                            <div class="
                        text-[10px]
                        font-bold
                    " :class="deudaSeleccionada?.por_pagar_id
                        ===
                        d.por_pagar_id
                        ?
                        'text-white'
                        :
                        'text-red-500'
                        ">

                                {{ d.tipo_pago }}

                            </div>

                        </div>

                        <!-- GRID -->
                        <div class="
                    grid
                    grid-cols-3
                    gap-2
                    mt-3
                    text-center
                ">

                            <!-- TOTAL -->
                            <div>

                                <div class="
                            text-[10px]
                            opacity-70
                        ">

                                    Total

                                </div>

                                <div class="
                            text-xs
                            font-bold
                        ">

                                    S/
                                    {{
                                        Number(
                                            d.monto_total_order
                                        ).toFixed(2)
                                    }}

                                </div>

                            </div>

                            <!-- PAGADO -->
                            <div>

                                <div class="
                            text-[10px]
                            opacity-70
                        ">

                                    Ult. pago

                                </div>

                                <div class="
                            text-xs
                            font-bold
                        ">

                                    S/
                                    {{
                                        Number(
                                            d.monto_pagado
                                        ).toFixed(2)
                                    }}

                                </div>

                            </div>

                            <!-- RESTA -->
                            <div>

                                <div class="
                            text-[10px]
                            opacity-70
                        ">

                                    Pendiente

                                </div>

                                <div class="
                            text-xs
                            font-black
                        ">

                                    S/
                                    {{
                                        Number(
                                            d.monto_restante
                                        ).toFixed(2)
                                    }}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <!-- 🔥 FOOTER FIJO -->
                <div class="
            border-t
            bg-white
            p-4
            space-y-3
            shrink-0
        ">

                    <div class="
                font-bold
                text-gray-700
            ">

                        💰 Registrar pago

                    </div>

                    <!-- INPUT -->
                    <input v-model="monto" type="number" step="0.01" placeholder="Monto a pagar" class="
                w-full
                h-[54px]
                rounded-2xl
                bg-gray-50
                border
                px-4
                outline-none
            " />

                    <!-- BTN -->
                    <button :disabled="!deudaSeleccionada
                        ||
                        loading
                        " @click="
                            pagar
                        " class="
                w-full
                h-[56px]
                rounded-2xl
                text-white
                font-bold
                text-lg
                active:scale-[0.98]
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
            " :class="deudaSeleccionada
                ?
                'bg-green-500'
                :
                'bg-gray-400'
                ">

                        💵 Pagar

                    </button>

                </div>

            </div>

        </div>

    </div>
    <GsapToast ref="toastRef" />

</template>

<script setup>

import {
    ref,
    nextTick,
    computed
}
    from 'vue'

import axios
    from 'axios'

import GsapToast
    from '../../../../../components/layout/GsapToast.vue'

import {
    firma
}
    from '../../../../../services/security'

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

const cliente =
    ref(null)

const monto =
    ref('')

const deudaSeleccionada =
    ref(null)

const deudas =
    computed(() => {

        return (
            cliente.value?.por_pagar?.deudas
            || []
        )

    })

const toastRef =
    ref(null)

const loading =
    ref(false)

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

async function open(
    c
) {

    cliente.value = c

    monto.value = ''

    visible.value = true

    bus.emit(
        'bottomnav:toggle',
        true
    )

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

function selectDeuda(
    deuda
) {

    deudaSeleccionada.value =
        deuda

    monto.value = ''

}

function close() {

    gsap.to(

        box.value,

        {

            scale: 0.7,

            opacity: 0,

            duration: 0.2,

            onComplete: () => {

                visible.value = false

                bus.emit(
                    'bottomnav:toggle',
                    false
                )

            }

        }

    )

}

/* ======================================
   💰 PAGAR
====================================== */

async function pagar() {

    if (!deudaSeleccionada.value)
        return

    const montoFloat =
        Number(monto.value || 0)

    if (montoFloat <= 0) {

        toastRef.value?.show({

            text:
                'Monto inválido ❌',

            type:
                'error'

        })

        return

    }

    try {

        loading.value =
            true

        /* ======================================
           🔐 FIRMA
        ====================================== */

        const seguridad =
            firma()

        /* ======================================
           🚀 REQUEST
        ====================================== */

        const r =
            await axios.post(

                `${API}/UHUD/realizarPago`,

                {

                    product_order_id:

                        deudaSeleccionada.value
                            ?.product_order_id,

                    monto_pagado:
                        montoFloat,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        /* ======================================
           ✅ OK
        ====================================== */

        if (r.data?.ok) {

            toastRef.value?.show({

                text:
                    r.data?.msg
                    ||
                    'Pago realizado 💸',

                type:
                    'success'

            })

            monto.value = ''

            close()

        }

        else {

            toastRef.value?.show({

                text:
                    r.data?.msg
                    ||
                    'Error registrando pago ❌',

                type:
                    'error'

            })

        }

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:

                e?.response?.data?.msg

                ||

                'Error registrando pago ❌',

            type:
                'error'

        })

    }

    finally {

        loading.value =
            false

    }

}

defineExpose({

    open

})

</script>
