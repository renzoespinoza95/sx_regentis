<template>

    <div class="
            flex
            gap-2
            overflow-x-auto
            no-scrollbar
            pb-1
            cursor-grab
            active:cursor-grabbing
        " ref="container">

        <!-- TODOS -->
        <button @click="select(null)" class="
                shrink-0
                px-4
                py-2
                rounded-full
                text-xs
                font-semibold
                transition
                active:scale-95
            " :class="modelValue === null
                ?
                'bg-[#FD7635] text-white shadow-md'
                :
                'bg-white text-gray-700'
                ">

            ✨ Todos

        </button>

        <!-- ITEMS -->
        <button v-for="o in opciones" :key="o.value" @click="select(o.value)" class="
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
            " :class="modelValue === o.value
                ?
                'bg-[#FD7635] text-white shadow-md'
                :
                'bg-white text-gray-700'
                ">

            <span>

                {{ o.emoji }}

            </span>

            <span>

                {{ o.value }}

            </span>

        </button>

    </div>

</template>

<script setup>

import {
    ref,
    onMounted
}
    from 'vue'

const props =
    defineProps({

        modelValue: {

            default: null

        }

    })

const emit =
    defineEmits([

        'update:modelValue'

    ])

const container =
    ref(null)

const opciones = [

    {
        value: 'EFECTIVO',
        emoji: '💵'
    },

    {
        value: 'YAPE',
        emoji: '📱'
    },

    {
        value: 'PLIN',
        emoji: '💜'
    },

    {
        value: 'TRANFERENCIA',
        emoji: '🏦'
    },

    {
        value: 'POR_PAGAR',
        emoji: '⏳'
    }

]

function select(
    value
) {

    emit(
        'update:modelValue',
        value
    )

}

onMounted(() => {

    const el =
        container.value

    if (!el) return

    let isDown = false
    let startX
    let scrollLeft

    el.addEventListener('mousedown', e => {

        isDown = true

        startX =
            e.pageX - el.offsetLeft

        scrollLeft =
            el.scrollLeft

    })

    el.addEventListener('mouseleave', () => {

        isDown = false

    })

    el.addEventListener('mouseup', () => {

        isDown = false

    })

    el.addEventListener('mousemove', e => {

        if (!isDown) return

        e.preventDefault()

        const x =
            e.pageX - el.offsetLeft

        const walk =
            (x - startX) * 1.2

        el.scrollLeft =
            scrollLeft - walk

    })

})

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {

    display: none;

}

.no-scrollbar {

    -ms-overflow-style: none;

    scrollbar-width: none;

}
</style>
