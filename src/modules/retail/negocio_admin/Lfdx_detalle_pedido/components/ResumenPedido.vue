<template>

    <div class="mt-3 bg-gray-50 rounded-md p-3 text-sm space-y-2">

        <div class="flex justify-between">

            <span>
                Subtotal
            </span>

            <span>

                S/
                {{
                    subtotal.toFixed(2)
                }}

            </span>

        </div>

        <div class="flex justify-between">

            <span>
                Delivery
            </span>

            <span>

                S/
                {{
                    delivery.toFixed(2)
                }}

            </span>

        </div>

        <div class="flex justify-between font-semibold border-t pt-2">

            <span>
                Total
            </span>

            <span>

                S/
                {{
                    total.toFixed(2)
                }}

            </span>

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

        items: Array

    })

/* =========================================
   🔥 SUBTOTAL
========================================= */

const subtotal =
    computed(() => {

        return props.items.reduce(

            (sum, p) => {

                return sum +

                    (
                        Number(
                            p.precio_unitario || 0
                        )

                        *

                        Number(
                            p.cantidad || 0
                        )

                    )

            },

            0

        )

    })

/* =========================================
   🚚 DELIVERY
========================================= */

const delivery =
    computed(() => 0)

/* =========================================
   💰 TOTAL
========================================= */

const total =
    computed(() => {

        return (
            subtotal.value
            +
            delivery.value
        )

    })

</script>