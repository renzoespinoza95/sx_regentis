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

                <div v-for="c in filtrados" :key="c.id" class="flex items-center gap-2 p-2 rounded hover:bg-gray-100">

                    <img src="https://picsum.photos/40" class="w-8 h-8 rounded object-cover" />

                    <div class="flex-1 text-sm">
                        {{ c.nombre }}
                    </div>

                    <!-- 🔥 BOTON ELEGIR -->
                    <button class="text-white text-xs px-2 py-1 rounded"
                        :style="{ background: mercado.topnavbar_color }" @click="select(c)">
                        elegir
                    </button>

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
import { ref, computed, nextTick } from 'vue'
import gsap from 'gsap'
import { useMercado } from '../../../../../services/useMercado.js'

const { mercado } = useMercado()

const visible = ref(false)
const box = ref(null)
const buscar = ref('')

// 🔥 DATA DEMO
const clientes = [
    { id: 1, nombre: 'Bilbo Bolson' },
    { id: 2, nombre: 'Frodo Bolson' },
    { id: 3, nombre: 'Samwise Gamgee' },
    { id: 4, nombre: 'Gandalf Gris' }
]

// 🔥 FILTRO
const filtrados = computed(() => {
    if (!buscar.value) return clientes
    return clientes.filter(c =>
        c.nombre.toLowerCase().includes(buscar.value.toLowerCase())
    )
})

const emit = defineEmits(['select'])

function open() {
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

function select(cliente) {
    emit('select', cliente)
    close()
}

defineExpose({ open })
</script>
