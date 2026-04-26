<template>

    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">

        <!-- overlay -->
        <div class="absolute inset-0 bg-black/40" @click="cerrar"></div>

        <!-- modal -->
        <div ref="box" class="relative bg-white w-[90%] max-w-md rounded-3xl shadow-2xl p-4">

            <!-- SEARCH -->
            <div class="mb-3">
                <input v-model="search" placeholder="Buscar puesto..."
                    class="w-full border rounded-xl px-3 py-2 text-sm outline-none" />
            </div>

            <!-- LISTA -->
            <div class="max-h-[300px] overflow-y-auto">

                <button v-for="n in filtered" :key="n" @click="seleccionar(n)"
                    class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
                    Puesto {{ n }}
                </button>

            </div>

        </div>

    </div>

</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
    open: Boolean
})

const emit = defineEmits(['close', 'select'])

const search = ref('')
const box = ref(null)

const puestos = Array.from({ length: 44 }, (_, i) => i + 1)

const filtered = computed(() => {
    if (!search.value) return puestos
    return puestos.filter(n =>
        String(n).includes(search.value)
    )
})

function cerrar() {
    emit('close')
}

function seleccionar(n) {
    emit('select', n)
}

watch(() => props.open, async (val) => {

    if (val) {
        await nextTick()

        gsap.fromTo(
            box.value,
            { scale: 0.7, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            }
        )
    }

})
</script>
