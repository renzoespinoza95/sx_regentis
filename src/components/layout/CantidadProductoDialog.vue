<template>

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

                <button class="w-10 h-10 bg-gray-200 rounded-md text-lg" @click.stop="menos">

                    -

                </button>

                <input v-model="cantidad" type="number" class="w-16 text-center border rounded-md py-2" />

                <button class="w-10 h-10 bg-gray-200 rounded-md text-lg" @click.stop="mas">

                    +

                </button>

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

</template>

<script setup>

import {
    ref,
    nextTick
} from 'vue'

import gsap from 'gsap'

import {
    useMercado
} from '../../services/useMercado.js'

const {
    mercado
} = useMercado()

const visible = ref(false)
const box = ref(null)

const producto = ref(null)
const cantidad = ref(1)

const emit = defineEmits([
    'confirm'
])

function open(p) {

    producto.value = p

    cantidad.value = 1

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

    gsap.to(box.value, {

        scale: 0.7,

        opacity: 0,

        duration: 0.2,

        onComplete: () => {

            visible.value = false

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

        }

    })
</script>
