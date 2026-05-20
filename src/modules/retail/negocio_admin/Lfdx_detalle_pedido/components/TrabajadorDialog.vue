<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
        @click.self="close">

        <div ref="box"
            class="relative bg-white w-[90%] max-w-md h-[85vh] rounded-2xl shadow-2xl p-5 overflow-hidden flex flex-col space-y-3">

            <!-- 🔥 CERRAR -->
            <div class="absolute top-3 right-3 z-10">

                <button @click="close"
                    class="w-8 h-8 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition">

                    <i class="fa fa-times text-sm"></i>

                </button>

            </div>

            <!-- 🔥 SEARCH -->
            <div class="flex items-center bg-gray-100 px-3 py-2 rounded-md">

                <i class="fa fa-search text-gray-400 mr-2">
                </i>

                <input v-model="buscar" placeholder="Buscar trabajador..."
                    class="flex-1 bg-transparent outline-none text-sm" />

                <i v-if="buscar" @click="limpiarBusqueda"
                    class="fa fa-times text-gray-400 cursor-pointer hover:text-red-500 transition">
                </i>

            </div>

            <!-- 🔥 CARRUSEL -->
            <div ref="lettersScroll"
                class="overflow-x-auto pb-2 no-scrollbar cursor-grab active:cursor-grabbing select-none"
                @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp"
                @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">

                <div class="grid grid-rows-2 grid-flow-col gap-2 w-max">

                    <!-- TODOS -->
                    <div @click="selectLetter(null)"
                        class="flex-shrink-0 px-3 py-2 rounded-full text-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
                        :class="activeLetter === null
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-100 text-orange-600'
                            ">

                        🔥 Todos

                    </div>

                    <!-- FAVORITOS -->
                    <div @click="selectLetter('FAVORITOS')"
                        class="flex-shrink-0 px-3 py-2 rounded-full text-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
                        :class="activeLetter === 'FAVORITOS'
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-100 text-pink-600'
                            ">

                        ❤️ Favoritos

                    </div>

                    <!-- LETRAS -->
                    <div v-for="l in letras" :key="l" @click="selectLetter(l)"
                        class="flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold cursor-pointer transition active:scale-95"
                        :class="activeLetter === l
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-100 text-orange-600'
                            ">

                        {{ l }}

                    </div>

                </div>

            </div>

            <!-- 🔥 LISTA -->
            <div class="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">

                <div v-for="t in filtrados" :key="t.usu_id" @click="select(t)"
                    class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer active:scale-[0.98] transition">

                    <!-- IMG -->
                    <img :src="t.img || 'https://picsum.photos/40'" class="w-8 h-8 rounded object-cover" />

                    <!-- NOMBRE -->
                    <div class="flex-1 text-sm">

                        {{ t.nombre }}

                    </div>

                </div>

                <!-- EMPTY -->
                <div v-if="!filtrados.length" class="text-center text-sm text-gray-400 py-10">

                    No existen trabajadores

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    ref,
    computed,
    nextTick
}
    from 'vue'

import axios
    from 'axios'

import gsap
    from 'gsap'

import {
    bus
}
    from '../../../../../services/eventBus.js'

import {
    firma
}
    from '../../../../../services/security'

/* ======================================
   🔥 API
====================================== */

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

/* ======================================
   🔥 PROPS
====================================== */

const props =
    defineProps({

        negId: Number

    })

/* ======================================
   🔥 STATE
====================================== */

const visible =
    ref(false)

const box =
    ref(null)

const buscar =
    ref('')

const trabajadores =
    ref([])

const activeLetter =
    ref(null)

/* ======================================
   🔠 LETRAS
====================================== */

const letras = [

    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'

]

/* ======================================
   🖱️ DRAG SCROLL
====================================== */

const lettersScroll =
    ref(null)

const isDragging =
    ref(false)

let startX = 0

let scrollLeft = 0

function onMouseDown(e) {

    isDragging.value = true

    startX =
        e.pageX
        -
        lettersScroll.value.offsetLeft

    scrollLeft =
        lettersScroll.value.scrollLeft

}

function onMouseMove(e) {

    if (!isDragging.value)
        return

    e.preventDefault()

    const x =
        e.pageX
        -
        lettersScroll.value.offsetLeft

    const walk =
        (x - startX) * 1.2

    lettersScroll.value.scrollLeft =
        scrollLeft - walk

}

function onMouseUp() {

    isDragging.value = false

}

/* ======================================
   📱 TOUCH
====================================== */

function onTouchStart(e) {

    isDragging.value = true

    startX =
        e.touches[0].pageX
        -
        lettersScroll.value.offsetLeft

    scrollLeft =
        lettersScroll.value.scrollLeft

}

function onTouchMove(e) {

    if (!isDragging.value)
        return

    const x =
        e.touches[0].pageX
        -
        lettersScroll.value.offsetLeft

    const walk =
        (x - startX) * 1.2

    lettersScroll.value.scrollLeft =
        scrollLeft - walk

}

function onTouchEnd() {

    isDragging.value = false

}

/* ======================================
   🔥 FILTRADOS
====================================== */

const filtrados =
    computed(() => {

        let lista =
            trabajadores.value || []

        /* ======================================
           ❤️ FAVORITOS
        ====================================== */

        if (
            activeLetter.value === 'FAVORITOS'
        ) {

            return []

        }

        /* ======================================
           🔠 LETRA
        ====================================== */

        if (
            activeLetter.value
        ) {

            lista =
                lista.filter(t => {

                    const nombre =

                        String(
                            t.nombre || ''
                        )
                            .trim()
                            .toUpperCase()

                    return nombre.startsWith(
                        activeLetter.value
                    )

                })

        }

        /* ======================================
           🔎 BUSQUEDA
        ====================================== */

        if (
            buscar.value.trim()
        ) {

            lista =
                lista.filter(t =>

                    String(
                        t.nombre || ''
                    )
                        .toLowerCase()
                        .includes(

                            buscar.value
                                .toLowerCase()

                        )

                )

        }

        return lista

    })

/* ======================================
   🔥 EMITS
====================================== */

const emit =
    defineEmits([

        'selected'

    ])

/* ======================================
   🔥 OPEN
====================================== */

async function open() {

    try {

        /* ======================================
           🔥 CARGAR DATA
        ====================================== */

        await cargarTrabajadores()

        /* ======================================
           🔥 MOSTRAR
        ====================================== */

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

    } catch (e) {

        console.error(e)

    }

}

/* ======================================
   🔥 CLOSE
====================================== */

function close() {

    bus.emit(
        'bottomnav:toggle',
        false
    )

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

/* ======================================
   🧹 LIMPIAR
====================================== */

function limpiarBusqueda() {

    buscar.value = ''

    activeLetter.value = null

}

/* ======================================
   🔠 SELECT LETTER
====================================== */

function selectLetter(
    letter
) {

    activeLetter.value =
        letter

}

/* ======================================
   🔥 CARGAR TRABAJADORES
====================================== */

async function cargarTrabajadores() {

    try {

        /* ======================================
           🔥 FIRMA
        ====================================== */

        const seguridad =
            firma()

        /* ======================================
           🔥 REQUEST
        ====================================== */

        const res =
            await axios.post(

                `${API}/EXiz/trabajador/listar`,

                {

                    neg_id:
                        props.negId,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        /* ======================================
           🔥 OK
        ====================================== */

        trabajadores.value =
            res.data.data || []

    } catch (e) {

        console.error(
            'ERROR TRABAJADORES >>>',
            e
        )

    }

}

/* ======================================
   🔥 SELECT
====================================== */

function select(trabajador) {

    emit(
        'selected',
        trabajador
    )

    close()

}

/* ======================================
   🔥 EXPOSE
====================================== */

defineExpose({

    open

})

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {

    display: none;

}

.no-scrollbar {

    scrollbar-width: none;

}
</style>