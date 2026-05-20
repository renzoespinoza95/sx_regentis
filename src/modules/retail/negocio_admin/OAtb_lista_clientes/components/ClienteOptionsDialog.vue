<template>

    <div v-if="visible" class="
            fixed
            inset-0
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-[999]
            p-4
        " @click.self="close">

        <div ref="box" class="
                relative
                bg-white
                rounded-3xl
                p-5
                w-full
                max-w-[320px]
                shadow-2xl
                space-y-3
            ">

            <!-- CLOSE -->
            <button class="
                    absolute
                    top-4
                    right-4
                    w-10
                    h-10
                    rounded-full
                    bg-red-100
                    text-red-500
                    flex
                    items-center
                    justify-center
                " @click="close">

                <i class="fa fa-times"></i>

            </button>

            <!-- TITLE -->
            <div class="
                    text-xl
                    font-black
                    text-gray-800
                    mb-2
                ">

                Cliente 👤

            </div>

            <!-- EDITAR -->
            <button class="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-2xl
                    bg-orange-50
                    text-orange-600
                    font-semibold
                " @click="editar">

                ✏️ Editar

            </button>

            <!-- DEUDA -->
            <!-- DEUDA -->
            <button v-if="cliente?.por_pagar" class="
        w-full
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-2xl
        bg-red-50
        text-red-600
        font-semibold
    " @click="abrirDeuda">

                💸 Deuda

            </button>

            <!-- YAPLINS -->
            <button class="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-2xl
                    bg-purple-50
                    text-purple-600
                    font-semibold
                ">

                📱 Yaplins

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

import gsap
    from 'gsap'

const emit =
    defineEmits([

        'edit',

        'deuda'

    ])

const visible =
    ref(false)

const box =
    ref(null)

const cliente =
    ref(null)

async function open(
    c
) {

    cliente.value = c

    visible.value = true

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

function editar() {

    emit(
        'edit',
        cliente.value
    )

    close()

}

function abrirDeuda() {

    emit(
        'deuda',
        cliente.value
    )

    close()

}

defineExpose({

    open

})

</script>
