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
                bg-white
                rounded-[28px]
                p-5
                w-full
                max-w-[320px]
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            ">

            <!-- TITLE -->
            <div class="text-xl font-black text-gray-800 mb-4">

                Opciones

            </div>

            <!-- TUTORIAL -->
            <button class="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-4
                    rounded-2xl
                    bg-[#fff4ee]
                    text-[#FD7635]
                    font-semibold
                    active:scale-[0.98]
                    transition
                ">

                <div class="
                        w-10
                        h-10
                        rounded-full
                        bg-[#FD7635]
                        text-white
                        flex
                        items-center
                        justify-center
                        shrink-0
                    ">

                    <i class="fa fa-heart"></i>

                </div>

                <div class="text-left">

                    Favoritos

                </div>

            </button>

            <!-- CLOSE -->
            <button class="
                    w-full
                    mt-4
                    h-[50px]
                    rounded-2xl
                    bg-red-500
                    text-white
                    font-semibold
                    active:scale-[0.98]
                    transition
                " @click="close">

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

import gsap
    from 'gsap'

const visible =
    ref(false)

const box =
    ref(null)

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

defineExpose({

    open

})

</script>