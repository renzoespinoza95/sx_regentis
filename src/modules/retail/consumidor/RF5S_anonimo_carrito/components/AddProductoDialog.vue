<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-xl p-4 w-80 space-y-3">

            <!-- 🔥 SEARCH -->
            <div class="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                <i class="fa fa-search text-gray-400 mr-2"></i>
                <input placeholder="Buscar producto..." class="flex-1 bg-transparent outline-none text-sm" />
            </div>

            <!-- 🔥 LISTA -->
            <div class="space-y-2">

                <div v-for="p in productos" :key="p.id"
                    class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">

                    <img src="https://picsum.photos/40" class="w-8 h-8 rounded object-cover" />

                    <div class="flex-1 text-sm">
                        {{ p.nombre }}
                    </div>

                    <span class="text-xs text-gray-500">
                        S/ {{ p.precio }}
                    </span>

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
import { ref, nextTick } from 'vue'
import gsap from 'gsap'

const visible = ref(false)
const box = ref(null)

const productos = [
    { id: 1, nombre: 'Palta hass', precio: 20 },
    { id: 2, nombre: 'Membrillo', precio: 10 },
    { id: 3, nombre: 'Tinte cabello', precio: 16 },
    { id: 4, nombre: 'Shampoo tio', precio: 18 }
]

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

defineExpose({ open })
</script>
