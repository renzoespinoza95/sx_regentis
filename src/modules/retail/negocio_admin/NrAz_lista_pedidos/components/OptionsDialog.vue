<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-3xl p-5 w-80 shadow-2xl space-y-3">

            <button v-for="o in opciones" :key="o.estado"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 active:scale-[0.98] transition text-left"
                @click="seleccionar(o.estado)">

                <span class="text-2xl">
                    {{ o.emoji }}
                </span>

                <div class="font-semibold text-gray-800">
                    {{ o.estado }}
                </div>

            </button>

            <button class="w-full text-white py-3 rounded-2xl bg-red-500 font-semibold mt-2" @click="close">

                Cerrar

            </button>

        </div>

    </div>

</template>

<script setup>

import {
    ref,
    nextTick
}
    from 'vue'

import gsap from 'gsap'

const emit = defineEmits([
    'select'
])

const visible = ref(false)

const box = ref(null)

const opciones = [

    {
        estado: 'enviado',
        emoji: '📦'
    },

    {
        estado: 'transito',
        emoji: '🚚'
    },

    {
        estado: 'comprado',
        emoji: '🛒'
    },

    {
        estado: 'devolucion',
        emoji: '↩️'
    },

    {
        estado: 'rechazado',
        emoji: '❌'
    },

    {
        estado: 'anulado',
        emoji: '🚫'
    }

]

function open() {

    visible.value = true

    nextTick(() => {

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

    })

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

            }

        }

    )

}

function seleccionar(
    estado
) {

    emit(
        'select',
        estado
    )

    close()

}

defineExpose({
    open
})

</script>