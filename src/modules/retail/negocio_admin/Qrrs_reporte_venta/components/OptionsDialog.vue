<template>

    <div v-if="visible" class="
            fixed
            inset-0
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
            p-4
        ">

        <div ref="box" class="
                relative
                bg-white
                rounded-3xl
                p-5
                w-80
                shadow-2xl
                space-y-3
            ">

            <!-- ❌ CLOSE -->
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
                    active:scale-95
                    transition
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

                Estados 📦

            </div>

            <!-- OPCIONES -->
            <button v-for="o in opciones" :key="o.estado" class="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-2xl
                    bg-gray-50
                    hover:bg-gray-100
                    active:scale-[0.98]
                    transition
                    text-left
                " @click="seleccionar(o.estado)">

                <span class="text-2xl">

                    {{ o.emoji }}

                </span>

                <div class="
                        font-semibold
                        text-gray-800
                    ">

                    {{ o.estado }}

                </div>

            </button>

            <!-- TUTORIAL -->
            <button class="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-2xl
                    bg-[#fff4ee]
                    text-[#FD7635]
                    hover:bg-[#ffe9dd]
                    active:scale-[0.98]
                    transition
                    text-left
                    mt-2
                ">

                <span class="text-2xl">

                    🎓

                </span>

                <div class="font-semibold">

                    Tutorial

                </div>

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

import {
    bus
}
    from '../../../../../services/eventBus.js'

import {
    useUsuario
}
    from '../../../../../services/usuarioService.js'

const emit =
    defineEmits([

        'select'

    ])

const visible =
    ref(false)

const box =
    ref(null)

const {
    getTipoxusuId
} = useUsuario()

const esDelivery =

    Number(
        getTipoxusuId()
    ) === 4

const opciones = [

    {

        estado: 'resumen',

        emoji: '📈'

    }

]

function open() {

    bus.emit(
        'bottomnav:toggle',
        true
    )

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