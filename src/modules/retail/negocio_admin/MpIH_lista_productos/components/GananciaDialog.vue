<template>

    <div v-if="visible" class="
            fixed
            inset-0
            z-[9999]
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
        ">

        <div ref="box" class="
                relative
                bg-white
                rounded-[32px]
                w-full
                max-w-sm
                overflow-hidden
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            ">

            <!-- CERRAR -->
            <button class="
                    absolute
                    top-4
                    left-4
                    z-10

                    w-11
                    h-11

                    rounded-full

                    bg-red-500

                    text-white

                    flex
                    items-center
                    justify-center

                    shadow-lg
                " @click="close">

                <i class="fa fa-times"></i>

            </button>

            <!-- HEADER -->
            <div class="
                    px-5
                    pt-5
                    pb-4
                    text-white
                " style="
                    background:
                    linear-gradient(
                        135deg,
                        #FD7635 0%,
                        #ff995e 100%
                    );
                ">

                <div class="
                        text-xl
                        font-black
                        text-center
                    ">

                    {{ titulo }}

                </div>

                <div class="
                        text-sm
                        opacity-90
                        mt-1
                        text-center
                    ">

                    Configurar rango

                </div>

            </div>

            <!-- BODY -->
            <div class="
                    p-6
                    space-y-5
                ">

                <!-- NOMBRE -->
                <div>

                    <label class="
                            block
                            text-sm
                            font-semibold
                            mb-2
                        ">

                        Nombre de venta

                    </label>

                    <input v-model="nombreRango" type="text" class="
                            w-full
                            border
                            rounded-2xl
                            px-4
                            py-3
                        " placeholder="Unidad">

                </div>

                <!-- CANTIDAD -->
                <div>

                    <label class="
                            block
                            text-sm
                            font-semibold
                            mb-2
                        ">

                        Cantidad

                    </label>

                    <input v-model.number="cantidadDesde" type="number" min="0" class="
                            w-full
                            border
                            rounded-2xl
                            px-4
                            py-3
                        " placeholder="0">

                </div>

                <!-- GANANCIA -->
                <div class="
                        flex
                        items-center
                        justify-center
                        gap-4
                    ">

                    <!-- MENOS -->
                    <button class="
                            w-14
                            h-14
                            rounded-full
                            bg-red-500
                            text-white
                            text-2xl
                            font-bold
                        " @click="disminuir">

                        -

                    </button>

                    <!-- VALOR -->
                    <div class="
                            text-center
                            w-[140px]
                            shrink-0
                        ">

                        <input v-model.number="porcentaje" type="number" min="0" class="
                                w-full
                                h-[72px]
                                text-center
                                text-5xl
                                font-black
                                text-[#FD7635]
                                border-0
                                outline-none
                                bg-transparent
                                appearance-none
                            ">

                        <div class="
                                text-sm
                                text-gray-500
                                -mt-2
                            ">

                            %

                        </div>

                    </div>

                    <!-- MAS -->
                    <button class="
                            w-14
                            h-14
                            rounded-full
                            bg-green-500
                            text-white
                            text-2xl
                            font-bold
                        " @click="aumentar">

                        +

                    </button>

                </div>

            </div>

            <!-- FOOTER -->
            <div class="
                    p-5
                    border-t
                    bg-white
                ">

                <button class="
                        w-full
                        h-[54px]
                        rounded-2xl
                        bg-[#FD7635]
                        text-white
                        font-bold
                    " @click="confirmar">

                    Guardar ✨

                </button>

            </div>

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
        'confirm'
    ])

const visible =
    ref(false)

const box =
    ref(null)

const titulo =
    ref('')

const porcentaje =
    ref(25)

const nombreRango =
    ref('')

const cantidadDesde =
    ref(0)

function open(data = {}) {

    titulo.value =
        data.titulo || ''

    porcentaje.value =
        Number(
            data.valor
        ) || 0

    nombreRango.value =
        data.nombre_rango
        ||
        ''

    cantidadDesde.value =
        Number(
            data.cantidad_desde
        ) || 0

    visible.value =
        true

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

                visible.value =
                    false

            }

        }

    )

}

function aumentar() {

    porcentaje.value++

}

function disminuir() {

    if (

        porcentaje.value <= 0

    ) {

        return

    }

    porcentaje.value--

}

function confirmar() {

    porcentaje.value =

        Math.max(

            0,

            Number(
                porcentaje.value
            ) || 0

        )

    cantidadDesde.value =

        Math.max(

            0,

            Number(
                cantidadDesde.value
            ) || 0

        )

    emit(

        'confirm',

        {

            nombre_rango:
                nombreRango.value,

            cantidad_desde:
                cantidadDesde.value,

            ganancia_porcentaje:
                porcentaje.value

        }

    )

    close()

}

defineExpose({

    open

})

</script>