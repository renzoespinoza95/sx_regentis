<template>

    <a v-if="
        celular
    " :href="urlWhatsapp
        " target="_blank" class="
            fixed

            bottom-24
            right-6

            z-[9999]

            w-20
            h-20

            rounded-full

            bg-[#25D366]

            flex
            items-center
            justify-center

            shadow-[0_8px_25px_rgba(37,211,102,.45)]

            active:scale-95

            transition
        ">

        <i class="
        fa
        fa-whatsapp

        text-white
    " style="
        font-size: 48px;
        line-height: 1;
    ">
        </i>

    </a>

</template>

<script setup>

import {

    computed

}
    from 'vue'

const props =
    defineProps({

        celular: {

            type: String,

            default: ''

        },

        mensaje: {

            type: String,

            default: ''

        }

    })

const urlWhatsapp =
    computed(() => {

        const numero =

            String(
                props.celular || ''
            )

                .replace(
                    /\D/g,
                    ''
                )

        return (

            'https://wa.me/51'

            +

            numero

            +

            '?text='

            +

            encodeURIComponent(

                props.mensaje

            )

        )

    })

</script>