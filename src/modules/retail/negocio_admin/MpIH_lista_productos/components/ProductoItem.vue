<template>
    <div @click="
        emit(
            'click',
            item
        )
        " class="rounded-2xl shadow-md p-3 flex items-center justify-between hover:scale-[1.02] transition"
        :style="cardStyle">

        <!-- LEFT -->
        <div class="flex items-center gap-3">

            <img :src="item.imagenes?.find(

                x =>

                    Number(
                        x.orden
                    ) === 1

            )?.img

                ||

                item.imagenes?.[0]?.img

                ||

                'https://barsi-img.b-cdn.net/recursos/6qz5.png'

                " class="
        w-12
        h-12

        rounded-xl

        object-cover

        bg-gray-100

        shrink-0
    " />

            <div>
                <div class="font-semibold text-sm">
                    {{ item.name }}
                </div>

                <div v-if="
                    Number(item.stock) === 0
                " class="
        text-xs
        font-bold
        text-red-500
        mt-1
    ">

                    🚫 SIN STOCK

                </div>

                <div v-else class="
        text-xs
        text-gray-500
    ">

                    Stock: {{ item.stock }}

                </div>
            </div>

        </div>

        <!-- RIGHT -->
        <div class="text-right">

            <div class="
    text-sm
    font-black
    text-[#0EA5E9]
">

                S/{{ Number(item.price).toFixed(2) }}

            </div>
            <div v-if="
                Number(item.is_visible) === 0
            " class="
        text-xs
        font-bold
        text-red-500
    ">

                🔒 OCULTO

            </div>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'


const props = defineProps({
    item: Object
})

const emit =
    defineEmits([
        'click'
    ])

// 🔥 COLOR DINÁMICO SEGÚN STOCK
const cardStyle = computed(() => {

    /* =========================================
       🔴 OCULTO
    ========================================= */

    if (

        Number(
            props.item.is_visible
        ) === 0

    ) {

        return {

            background:
                '#d1d5db',

            opacity:
                0.85

        }

    }

    /* =========================================
       🔴 SIN STOCK
    ========================================= */

    if (

        Number(
            props.item.stock
        ) <= 0

    ) {

        return {

            background:
                '#E1A2B7'

        }

    }

    /* =========================================
       ⚪ NORMAL
    ========================================= */

    return {

        background:
            'white'

    }

})
</script>