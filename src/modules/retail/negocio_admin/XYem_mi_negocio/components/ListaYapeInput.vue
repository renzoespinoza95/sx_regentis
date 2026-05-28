<template>

    <div>

        <div class="
                text-sm
                font-semibold
                text-gray-700
                mb-2
            ">

            Números Yape

        </div>

        <div class="
                flex
                flex-wrap
                gap-2

                p-3

                rounded-2xl

                border

                bg-gray-50
            ">

            <!-- PILLS -->
            <div v-for="(item, i) in modelValue" :key="i" class="
                    px-3
                    py-2

                    rounded-full

                    bg-gradient-to-r
                    from-purple-500
                    to-pink-500

                    text-white

                    text-sm

                    flex
                    items-center
                    gap-2
                ">

                {{ item }}

                <button @click="
                    remove(i)
                    ">

                    ✕
                </button>

            </div>

            <!-- INPUT -->
            <input v-model="texto" class="
                    bg-transparent
                    outline-none
                    text-sm
                    flex-1
                    min-w-[120px]
                " placeholder="
                    999000111
                " @keydown.space.prevent="
                    createPill
                " />

        </div>

    </div>

</template>

<script setup>

import {
    ref
}
    from 'vue'

const props =
    defineProps({

        modelValue: {

            type: Array,

            default: () => []

        }

    })

const emit =
    defineEmits([

        'update:modelValue',

        'invalid'

    ])

const texto =
    ref('')

function createPill() {

    const value =
        texto.value.trim()

    if (

        value.length !== 9

    ) {

        emit('invalid')

        return

    }

    const arr = [

        ...props.modelValue

    ]

    if (

        !arr.includes(value)

    ) {

        arr.push(value)

    }

    emit(

        'update:modelValue',

        arr

    )

    texto.value = ''

}

function remove(i) {

    const arr = [

        ...props.modelValue

    ]

    arr.splice(i, 1)

    emit(

        'update:modelValue',

        arr

    )

}

</script>