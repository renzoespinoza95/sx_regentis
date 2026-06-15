<template>
    <Teleport to="body">
        <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]" @click.stop>

            <div ref="box" class="bg-white rounded-2xl p-5 w-80 text-center space-y-4 relative" @click.stop>

                <!-- CERRAR -->
                <div class="absolute top-3 right-3">

                    <button @click.stop="close" class="w-8 h-8 rounded-full flex items-center justify-center" :style="{
                        background:
                            mercado.topnavbar_color || '#FD7635'
                    }">

                        <i class="fa fa-times text-white text-sm"></i>

                    </button>

                </div>

                <!-- NOMBRE -->
                <div class="font-semibold text-lg text-gray-800 leading-tight pr-6">

                    {{ producto?.name }}

                </div>

                <!-- CONTADOR -->
                <div class="flex justify-center items-center gap-3">

                    <button class="w-10 h-10 text-white font-bold rounded-md text-lg" :style="{
                        background:
                            '#39d06b'
                    }" @click.stop="menos">

                        -

                    </button>

                    <input v-model="cantidad" type="number" class="w-16 text-center border rounded-md py-2" />

                    <button class="w-10 h-10 font-bold text-white rounded-md text-lg" :style="{
                        background:
                            '#39d06b'
                    }" @click.stop="mas">

                        +

                    </button>

                </div>


                <!-- TOTAL -->
                <div v-if="props.mostrarPrecios" class="text-base font-semibold text-gray-700">

                    S/

                    {{
                        precioActual.toFixed(2)
                    }}

                    ×

                    {{ cantidad }}

                    =

                    <span class="text-green-600">

                        S/{{ total }}

                    </span>

                </div>

                <!-- PRECIOS POR VOLUMEN -->
                <div v-if="
                    props.mostrarPrecios
                    &&
                    producto?.precio_volumen?.length
                " class=" text-left bg-gray-50 rounded-xl p-3 text-xs ">

                    <div class=" font-semibold mb-2 ">

                        💰 Precios por volumen

                    </div>

                    <div v-for="r in producto.precio_volumen" :key="r.cantidad_desde" class="
            flex
            justify-between
            py-1
        ">

                        <span>

                            {{ r.nombre_rango }}

                            <span class="text-gray-500">

                                (

                                {{ r.cantidad_desde }}

                                und.

                                )

                            </span>

                        </span>

                        <span class="
                font-semibold
                text-green-600
            ">

                            S/

                            {{

                                Number(
                                    r.precio_unitario_calculado
                                ).toFixed(2)

                            }}

                        </span>

                    </div>

                </div>

                <!-- BOTON -->
                <button class="w-full py-3 text-white rounded-xl font-semibold" :style="{
                    background:
                        '#39d06b'
                }" @click.stop="confirmar">

                    {{ props.botonTexto }}

                </button>

            </div>

        </div>
    </Teleport>
</template>

<script setup>

import {
    ref,
    nextTick,
    computed
} from 'vue'

import gsap from 'gsap'

import {
    useMercado
} from '../../services/useMercado.js'

import {
    bus
} from '../../services/eventBus.js'

const {
    mercado
} = useMercado()

const visible = ref(false)
const box = ref(null)

const producto = ref(null)
const cantidad = ref(1)

const precioActual =
    computed(() => {

        const lista =

            producto.value
                ?.precio_volumen

            ||

            []

        let precio =

            Number(
                producto.value?.price || 0
            )

        lista.forEach(r => {

            if (

                cantidad.value >=

                Number(
                    r.cantidad_desde
                )

            ) {

                precio =

                    Number(
                        r.precio_unitario_calculado
                    )

            }

        })

        return precio

    })

const total =
    computed(() => {

        return (

            precioActual.value

            *

            cantidad.value

        ).toFixed(2)

    })

const emit = defineEmits([
    'confirm'
])

function open(p) {

    producto.value = p

    cantidad.value = 1

    visible.value = true

    bus.emit(
        'bottomnav:toggle',
        true
    )

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

    gsap.to(box.value, {

        scale: 0.7,

        opacity: 0,

        duration: 0.2,

        onComplete: () => {

            visible.value = false

            bus.emit(
                'bottomnav:toggle',
                false
            )

        }

    })

}

function mas() {

    cantidad.value++

}

function menos() {

    if (cantidad.value > 1) {

        cantidad.value--

    }

}

function confirmar() {

    emit(
        'confirm',
        {
            producto: producto.value,
            cantidad: cantidad.value
        }
    )

    close()

}

defineExpose({
    open
})

const props =
    defineProps({

        botonTexto: {

            type: String,

            default: 'PEDIR'

        },

        mostrarPrecios: {

            type: Boolean,

            default: true

        }

    })
</script>
