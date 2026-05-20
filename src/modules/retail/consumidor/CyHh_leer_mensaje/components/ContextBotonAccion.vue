<template>

    <div class="
            mt-3
            w-64

            rounded-3xl
            overflow-hidden

            shadow-2xl

            border
            border-white/30

            backdrop-blur-md
        " style="
            background:
                linear-gradient(
                    135deg,
                    rgba(255,255,255,0.92),
                    rgba(245,245,245,0.82)
                );
        ">

        <!-- HEADER -->
        <div class="
                h-32

                bg-gradient-to-br
                from-[#FD7635]
                via-orange-400
                to-pink-500

                flex
                items-center
                justify-center
            ">

            <div class="
                    w-20
                    h-20

                    rounded-full

                    bg-white/20

                    backdrop-blur

                    flex
                    items-center
                    justify-center

                    shadow-2xl

                    border
                    border-white/30
                ">

                <i class="
                        fa fa-shopping-bag

                        text-white
                        text-4xl
                    ">
                </i>

            </div>

        </div>

        <!-- BODY -->
        <div class="p-4">

            <!-- TITULO -->
            <div class="
                    text-sm
                    font-bold
                    text-gray-800
                ">

                {{ contexto.data?.titulo }}

            </div>

            <!-- DESC -->
            <div class="
                    text-xs
                    text-gray-500
                    mt-2
                    leading-5
                " v-html="contexto.data?.descripcion
                    ">
            </div>

            <!-- BTN -->
            <button class="
                    mt-4

                    w-full

                    bg-[#FD7635]

                    text-white

                    py-2.5

                    rounded-full

                    text-xs
                    font-bold

                    shadow-lg

                    active:scale-95

                    transition
                " @click="irRuta">

                {{

                    contexto.data?.boton_texto
                    ||

                    'Abrir'

                }}

            </button>

        </div>

    </div>

</template>

<script setup>

import {
    useRouter
}
    from 'vue-router'

const router =
    useRouter()

const props =
    defineProps({

        contexto: Object

    })

function irRuta() {

    const ruta =
        props.contexto?.data?.ruta

    if (!ruta)
        return

    router.push(ruta)

}

</script>