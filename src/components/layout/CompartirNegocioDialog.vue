<template>

    <div v-if="modelValue" class="
            fixed
            inset-0
            bg-black/40
            z-[9999]

            flex
            items-center
            justify-center

            p-4
        " @click.self="cerrar">

        <div ref="modalRef" class="
        bg-white

        w-full
        max-w-md

        rounded-2xl

        overflow-hidden

        shadow-2xl
    ">

            <!-- HEADER -->
            <div class="
                    px-4
                    py-3

                    text-white

                    flex
                    items-center
                    justify-between
                " :style="{
                    background:
                        mercado?.topnavbar_color
                        ||
                        '#FD7635'
                }">

                <div class="font-semibold">

                    Compartir negocio

                </div>

                <button @click="cerrar">

                    <i class="fa fa-times"></i>

                </button>

            </div>

            <!-- BODY -->
            <div class="
                    p-4
                    space-y-4
                ">

                <div class="
        relative

        overflow-hidden

        rounded-2xl

        p-4

        border

        border-[#FD7635]/20

        bg-gradient-to-r

        from-orange-50

        via-white

        to-orange-50

        shadow-[0_8px_30px_rgba(253,118,53,0.15)]
    ">

                    <div class="
            text-[11px]

            uppercase

            tracking-[2px]

            text-[#FD7635]

            font-bold

            mb-2
        ">

                        TU PAGINA WEB

                    </div>

                    <div class="
            text-[15px]

            font-semibold

            text-gray-800

            break-all
        ">

                        {{ urlCompleta }}

                    </div>

                </div>

                <!-- COPIAR -->
                <button ref="btnCopiar" @click="copiar" class="
        w-full

        py-3

        rounded-xl

        text-white

        font-semibold

        transition-all

        duration-300
    " :class="copiado

        ?

        'bg-green-500 shadow-[0_0_25px_rgba(34,197,94,.8)]'

        :

        'bg-blue-500'

        ">

                    <span v-if="!copiado">

                        📋 Copiar enlace

                    </span>

                    <span v-else>

                        ✅ Enlace copiado

                    </span>

                </button>

                <!-- WHATSAPP -->
                <button @click="compartirWhatsapp" class="
                        w-full

                        py-3

                        rounded-xl

                        bg-green-500

                        text-white

                        font-semibold
                    ">

                    🟢 Compartir por WhatsApp

                </button>

            </div>

        </div>

    </div>

</template>

<script setup>
import gsap
    from 'gsap'
import {
    computed,
    ref,
    watch,
    nextTick
}
    from 'vue'

import {
    useMercado
}
    from '../../services/useMercado'

const props =
    defineProps({

        modelValue: {

            type: Boolean,

            default: false

        },

        slug: {

            type: String,

            default: ''

        }

    })

const btnCopiar =
    ref(null)

const modalRef =
    ref(null)

const copiado =
    ref(false)

const emit =
    defineEmits([

        'update:modelValue'

    ])

const {
    mercado
}
    =
    useMercado()

watch(

    () => props.modelValue,

    (val) => {

        if (!val) return

        nextTick(() => {

            if (!modalRef.value) return

            gsap.fromTo(

                modalRef.value,

                {

                    scale: 0.7,

                    opacity: 0,

                    y: 30

                },

                {

                    scale: 1,

                    opacity: 1,

                    y: 0,

                    duration: 0.28,

                    ease: 'back.out(1.7)'

                }

            )

        })

    },

    {

        immediate: true

    }

)

const urlCompleta =
    computed(() => {

        return `https://ofer.lat/${props.slug

            }`

    })

function cerrar() {

    if (!modalRef.value) {

        emit(

            'update:modelValue',

            false

        )

        return

    }

    gsap.to(

        modalRef.value,

        {

            scale: 0.85,

            opacity: 0,

            y: 20,

            duration: 0.2,

            ease: 'power2.in',

            onComplete: () => {

                emit(

                    'update:modelValue',

                    false

                )

            }

        }

    )

}

async function copiar() {

    try {

        await navigator.clipboard.writeText(

            urlCompleta.value

        )

        copiado.value = true

        gsap.fromTo(

            btnCopiar.value,

            {

                scale: 1

            },

            {

                scale: 1.08,

                duration: 0.18,

                repeat: 1,

                yoyo: true

            }

        )

        gsap.fromTo(

            btnCopiar.value,

            {

                boxShadow:

                    '0 0 0 rgba(34,197,94,0)'

            },

            {

                boxShadow:

                    '0 0 35px rgba(34,197,94,.9)',

                duration: .35,

                repeat: 1,

                yoyo: true

            }

        )

        setTimeout(() => {

            copiado.value = false

        }, 2500)

    }

    catch (e) {

        console.error(e)

    }

}

function compartirWhatsapp() {

    window.open(

        `https://wa.me/?text=${encodeURIComponent(

            urlCompleta.value

        )

        }`,

        '_blank'

    )

}

</script>
