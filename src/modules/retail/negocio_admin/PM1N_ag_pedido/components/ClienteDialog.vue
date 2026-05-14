<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-xl p-4 w-80 space-y-3">

            <!-- 🔥 SEARCH -->
            <div class="flex items-center bg-gray-100 px-3 py-2 rounded-md">

                <i class="fa fa-search text-gray-400 mr-2"></i>

                <input v-model="buscar" placeholder="Buscar cliente..."
                    class="flex-1 bg-transparent outline-none text-sm" />

            </div>

            <!-- 🔥 LISTA -->
            <div class="space-y-2 max-h-60 overflow-y-auto">
                <div v-for="c in filtrados" :key="c.cliente_id" @click="select(c)"
                    class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer active:scale-[0.98] transition">

                    <img src="https://picsum.photos/40" class="w-8 h-8 rounded object-cover" />

                    <div class="flex-1 text-sm">

                        {{ c.nombre }}

                    </div>

                </div>

            </div>

            <!-- 🔥 CERRAR -->
            <button class="w-full text-white py-2 rounded-md bg-red-500" @click="close">

                Cerrar

            </button>

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

import {
    enc_barsi,
    des_barsi,
    firma
}
    from '../../../../../services/security'

import {
    useUsuario
} from '../../../../../services/usuarioService'

import {
    useMercado
} from '../../../../../services/useMercado.js'

const { mercado } = useMercado()

const {
    getNegId
} = useUsuario()

const visible = ref(false)

const box = ref(null)

const buscar = ref('')

const clientes = ref([])

/* ======================================
   🔥 FILTRADOS
====================================== */

const filtrados = computed(() => {

    if (!buscar.value) {

        return clientes.value

    }

    return clientes.value.filter(c =>

        (c.nombre || '')
            .toLowerCase()
            .includes(
                buscar.value.toLowerCase()
            )

    )

})

const emit = defineEmits([
    'select'
])

/* ======================================
   🔥 OPEN
====================================== */

async function open() {

    visible.value = true

    await cargarClientes()

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
   🔥 CARGAR CLIENTES
====================================== */

async function cargarClientes() {

    try {

        /* ======================================
           🔥 FIRMA
        ====================================== */

        const seguridad =
            firma()

        console.log(
            'FIRMA CLIENTES >>>',
            seguridad
        )

        /* ======================================
           🔥 REQUEST
        ====================================== */

        const res = await axios.post(

            '/FjeU/clienteListar',

            {

                neg_id:
                    getNegId(),

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

        console.log(
            'CLIENTES >>>',
            res.data
        )

        /* ======================================
           🔥 OK
        ====================================== */

        if (res.data.status === 'ok') {

            clientes.value =
                res.data.data || []

        }

    } catch (e) {

        console.error(
            'ERROR CLIENTES >>>',
            e
        )

    }

}

/* ======================================
   🔥 SELECT
====================================== */

function select(cliente) {

    emit('select', cliente)

    close()

}

defineExpose({
    open
})

</script>