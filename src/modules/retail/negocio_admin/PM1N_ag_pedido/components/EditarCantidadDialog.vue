<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-2xl p-5 w-72 text-center space-y-4">
            <!-- 🔥 BOTON CERRAR PREMIUM -->
            <div class="absolute top-3 right-3">

                <button @click="close"
                    class="w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition"
                    :style="{ background: mercado.topnavbar_color || '#FD7635' }">

                    <i class="fa fa-times text-white text-sm"></i>

                </button>

            </div>

            <!-- NOMBRE -->
            <div class="font-semibold text-sm">
                {{ producto?.nombre }}
            </div>

            <!-- CONTADOR -->
            <div class="flex justify-center items-center gap-4">

                <button class="
            w-11
            h-11
            rounded-lg
            text-white
            text-xl
            font-bold
            shadow-md
            active:scale-95
            transition
        " :style="{
            background: '#22c55e'
        }" @click="menos">

                    -

                </button>

                <input v-model="cantidad" type="number" class="
            w-16
            h-11
            text-center
            border-2
            border-gray-300
            rounded-lg
            text-lg
            font-semibold
        " />

                <button class="
            w-11
            h-11
            rounded-lg
            text-white
            text-xl
            font-bold
            shadow-md
            active:scale-95
            transition
        " :style="{
            background: '#22c55e'
        }" @click="mas">

                    +

                </button>

            </div>

            <!-- 🔥 TOTAL -->
            <div class="text-base font-semibold text-gray-700">

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

            <div v-if="
                producto?.precio_volumen?.length
            " class="
        text-left
        bg-gray-50
        rounded-xl
        p-3
        text-xs
    ">

                <div class="
            font-semibold
            mb-2
        ">

                    💰 Precios por volumen

                </div>

                <div v-for="r in producto.precio_volumen" :key="r.cantidad_desde" class="
            flex
            justify-between
            py-1
        ">

                    <span>

                        {{ r.nombre_rango }}

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
            <button class="w-full py-2 text-white rounded-md bg-green-500" @click="guardar">
                PEDIR
            </button>

        </div>

    </div>
    <GsapToast ref="toastRef" />
</template>

<script setup>
import {
    ref,
    nextTick,
    computed
}
    from 'vue'
import gsap from 'gsap'
import { useMercado } from '../../../../../services/useMercado.js'
import GsapToast
    from '../../../../../components/layout/GsapToast.vue'

const { mercado } = useMercado()

const visible = ref(false)
const box = ref(null)

const producto = ref(null)
const cantidad = ref(1)

const total =
    computed(() => {

        return (

            precioActual.value

            *

            cantidad.value

        ).toFixed(2)

    })

const emit = defineEmits(['update'])
const toastRef = ref(null)

function open(p) {
    producto.value = p
    cantidad.value = p.cantidad
    visible.value = true

    nextTick(() => {
        gsap.fromTo(box.value,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        )
    })
}

function close() {
    gsap.to(box.value, {
        scale: 0.7,
        opacity: 0,
        duration: 0.2,
        onComplete: () => visible.value = false
    })
}

function mas() {
    cantidad.value++
}

function menos() {
    if (cantidad.value > 1) cantidad.value--
}

function guardar() {

    const stock =

        Number(
            producto.value?.stock || 0
        )

    if (

        cantidad.value > stock

    ) {

        toastRef.value?.show({

            text:

                `Stock insuficiente. Disponible: ${stock}`,

            type:
                'error'

        })

        return

    }

    emit('update', {

        ...producto.value,

        cantidad:
            cantidad.value,

        precio:
            precioActual.value

    })

    close()

}

const precioActual =
    computed(() => {

        const lista =

            producto.value
                ?.precio_volumen

            ||

            []

        let precio =

            Number(
                producto.value
                    ?.precio || 0
            )

        lista.forEach(r => {

            if (

                cantidad.value

                >=

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

defineExpose({ open })
</script>
