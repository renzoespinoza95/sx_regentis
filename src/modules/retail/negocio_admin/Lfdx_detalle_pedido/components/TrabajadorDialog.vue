<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

        <div ref="box" class="bg-white rounded-2xl w-full max-w-md overflow-hidden">

            <!-- HEADER -->
            <div class="px-4 py-4 border-b font-semibold text-gray-800">

                Seleccionar trabajador

            </div>

            <!-- SEARCH -->
            <div class="p-4 border-b">

                <input v-model="search" placeholder="Buscar trabajador..."
                    class="w-full border rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-orange-300" />

            </div>

            <!-- LISTA -->
            <div class="max-h-[400px] overflow-y-auto">

                <button v-for="item in filtrados" :key="item.usu_id" @click="seleccionar(item)"
                    class="w-full text-left px-4 py-4 border-b hover:bg-gray-50 transition">

                    <div class="font-medium text-gray-800">

                        {{ item.nombre }}

                    </div>

                    <div class="text-sm text-gray-500">

                        {{ item.tipo_trabajador || 'Sin tipo' }}

                    </div>

                </button>

            </div>

            <!-- FOOTER -->
            <div class="p-4">

                <button @click="close" class="w-full py-3 rounded-xl bg-red-500 text-white font-semibold">

                    Cerrar

                </button>

            </div>

        </div>

    </div>

</template>

<script setup>
import {
    ref,
    computed,
    nextTick
} from 'vue'

import axios from 'axios'
import gsap from 'gsap'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const props = defineProps({
    negId: Number
})

const emit = defineEmits([
    'selected'
])

const visible = ref(false)

const box = ref(null)

const search = ref('')

const trabajadores = ref([])

const filtrados = computed(() => {

    const txt =
        search.value.toLowerCase()

    return trabajadores.value.filter(x => {

        return (
            x.nombre?.toLowerCase().includes(txt)
        )
    })
})

async function cargarTrabajadores() {

    try {

        const r = await axios.post(
            `${API}/EXiz/trabajador/listar`,
            {
                neg_id: props.negId
            }
        )

        trabajadores.value =
            r.data.data || []

    } catch (e) {

        console.error(e)
    }
}

async function open() {

    visible.value = true

    await cargarTrabajadores()

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

function seleccionar(item) {

    emit(
        'selected',
        item
    )

    close()
}

defineExpose({
    open
})
</script>
