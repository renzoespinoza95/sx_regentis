<template>

    <div v-if="visible" class="
            fixed
            inset-0
            z-[999]
            bg-black/40
            flex
            items-center
            justify-center
        ">

        <div ref="box" class="
                bg-white
                rounded-3xl
                p-5
                w-[320px]
                space-y-4
            ">

            <!-- TITULO -->
            <div class="
                    text-lg
                    font-bold
                    text-gray-800
                ">

                Nueva categoría

            </div>

            <!-- INPUT -->
            <input v-model="name" type="text" placeholder="Nombre categoría" class="
                    w-full
                    h-[48px]
                    rounded-2xl
                    bg-gray-100
                    px-4
                    outline-none
                " />

            <!-- GUARDAR -->
            <button class="
                    w-full
                    h-[48px]
                    rounded-2xl
                    bg-[#FD7635]
                    text-white
                    font-semibold
                " @click="guardar">

                Guardar

            </button>

            <!-- CERRAR -->
            <button class="
                    w-full
                    h-[48px]
                    rounded-2xl
                    bg-red-500
                    text-white
                    font-semibold
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

import axios
    from 'axios'

import gsap
    from 'gsap'

import {
    firma
}
    from '../../../../../services/security'

import {
    useUsuario
}
    from '../../../../../services/usuarioService'

const emit =
    defineEmits([

        'created'

    ])

const {
    getNegId
} = useUsuario()

const visible =
    ref(false)

const box =
    ref(null)

const name =
    ref('')

/* =========================================
🔥 OPEN
========================================= */

function open() {

    name.value = ''

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
🔥 CLOSE
========================================= */

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

/* =========================================
🔥 GUARDAR
========================================= */

async function guardar() {

    try {

        const seguridad =
            firma()

        await axios.post(

            '/NsQm/crearCategoria',

            {

                neg_id:
                    getNegId(),

                name:
                    name.value,

                icon:
                    '📦',

                brief:
                    name.value,

                color:
                    '#FD7635',

                priority:
                    1,

                categoria_global_id:
                    13,

                clave_txt:
                    name.value
                        .toLowerCase(),

                img:
                    'https://barsi-img.b-cdn.net/recursos/ffc1.png',

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

        emit(
            'created'
        )

        close()

    } catch (e) {

        console.error(e)

    }

}

defineExpose({

    open

})

</script>
