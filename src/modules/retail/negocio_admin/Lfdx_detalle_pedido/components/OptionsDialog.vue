<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-2xl p-5 w-72 space-y-3 shadow-2xl">

            <!-- 🔥 ATENDER -->
            <!-- 🔥 ATENDER -->
            <button v-if="

                props.estado
                !== 'comprado'

                &&

                props.estado
                !== 'devolucion'

                &&

                props.estado
                !== 'rechazado'

                &&

                props.estado
                !== 'anulado'

            " class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-semibold active:scale-95 transition"
                @click="atenderAhora">

                <i class="fa fa-headphones text-lg"></i>

                <span>
                    Atender ahora
                </span>

            </button>

            <!-- 🔥 ADMINISTRADOR -->
            <button
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold active:scale-95 transition"
                @click="irDash">

                <i class="fa fa-shield text-lg"></i>

                <span>
                    Inicio
                </span>

            </button>



            <!-- 🔥 CERRAR -->
            <button class="w-full text-white py-3 rounded-xl bg-gray-800 mt-2 active:scale-95 transition"
                @click="close">

                Cerrar

            </button>

        </div>

    </div>

</template>

<script setup>

import { ref, nextTick } from 'vue'
import gsap from 'gsap'

const props =
    defineProps({

        estado: {

            type:
                String,

            default:
                ''

        }

    })

const emit = defineEmits([
    'atender',
    'eliminar'
])

const visible = ref(false)

const box = ref(null)

/* =========================================
   OPEN
========================================= */

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

/* =========================================
   CLOSE
========================================= */

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

/* =========================================
   ACCIONES
========================================= */

function atenderAhora() {

    emit('atender')

    close()

}

function eliminar() {

    emit('eliminar')

    close()

}

defineExpose({
    open,
    close
})

</script>