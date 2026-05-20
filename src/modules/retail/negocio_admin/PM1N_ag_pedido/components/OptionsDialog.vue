<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-xl p-5 w-72 space-y-3">

            <!-- ======================================
                 🆕 NUEVO
            ====================================== -->

            <button class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                @click="nuevo">

                <i class="fa fa-file-o text-green-500"></i>

                <span>

                    Crear pedido

                </span>

            </button>

            <button class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                @click="nuevoCliente">

                <i class="fa fa-user-plus text-blue-500"></i>

                <span>

                    Crear cliente

                </span>

            </button>

            <!-- ======================================
                 ❌ CERRAR
            ====================================== -->

            <button class="w-full text-white py-2 rounded-md bg-red-500 mt-2" @click="close">

                Cerrar

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

const visible = ref(false)

const box = ref(null)

const emit = defineEmits([

    'nuevo',

    'nuevo-cliente'

])

/* ======================================
   🔥 OPEN
====================================== */

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

/* ======================================
   🔥 CLOSE
====================================== */

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

/* ======================================
   🆕 NUEVO
====================================== */

function nuevo() {

    emit('nuevo')

    close()

}

function nuevoCliente() {

    emit(
        'nuevo-cliente'
    )

    close()

}

defineExpose({
    open
})

</script>