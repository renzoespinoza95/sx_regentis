<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-xl p-4 w-80 space-y-3">

            <!-- 🔥 SEARCH -->
            <div class="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                <i class="fa fa-search text-gray-400 mr-2"></i>
                <input placeholder="Buscar producto..." class="flex-1 bg-transparent outline-none text-sm" />
            </div>

            <!-- 🔥 CATEGORIAS -->
            <div class="flex gap-2 overflow-x-auto pb-2">

                <div v-for="cat in categorias" :key="cat.id"
                    class="flex-shrink-0 px-3 py-2 rounded-full text-xs flex items-center gap-1 cursor-pointer transition bg-orange-100 text-orange-600 active:scale-95">
                    <span class="text-base leading-none">{{ cat.emoji }}</span>
                    <span>{{ cat.nombre }}</span>
                </div>

            </div>

            <!-- 🔥 LISTA -->
            <div class="space-y-2">

                <div v-for="p in productos" :key="p.id" class="flex items-center gap-2 p-2 rounded hover:bg-gray-100">

                    <img src="https://picsum.photos/40" class="w-8 h-8 rounded object-cover" />

                    <div class="flex-1 text-sm">
                        {{ p.nombre }}
                    </div>

                    <span class="text-xs text-gray-500">
                        S/ {{ p.precio }}
                    </span>

                    <!-- 🔥 BOTON ELEGIR -->
                    <button class="text-white text-xs px-2 py-1 rounded bg-green-500" @click="selectProducto(p)">
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

    <CantidadDialog ref="cantRef" />

</template>

<script setup>
import { ref, nextTick } from 'vue'
import gsap from 'gsap'
import CantidadDialog from './CantidadDialog.vue'

const visible = ref(false)
const box = ref(null)

const productos = [
    { id: 1, nombre: 'Palta hass', precio: 20 },
    { id: 2, nombre: 'Membrillo', precio: 10 },
    { id: 3, nombre: 'Tinte cabello', precio: 16 },
    { id: 4, nombre: 'Shampoo tio', precio: 18 }
]

const categorias = [
    { id: 1, nombre: 'Entradas', emoji: '🥗' },
    { id: 2, nombre: 'Platos', emoji: '🍛' },
    { id: 3, nombre: 'Bebidas', emoji: '🥤' },
    { id: 4, nombre: 'Postres', emoji: '🍰' },
    { id: 5, nombre: 'Café', emoji: '☕' },
    { id: 6, nombre: 'Jugos', emoji: '🍹' },
    { id: 7, nombre: 'Cervezas', emoji: '🍺' },
    { id: 8, nombre: 'Vinos', emoji: '🍷' },
    { id: 9, nombre: 'Parrillas', emoji: '🥩' },
    { id: 10, nombre: 'Pizzas', emoji: '🍕' },
    { id: 11, nombre: 'Hamburguesas', emoji: '🍔' },
    { id: 12, nombre: 'Pastas', emoji: '🍝' },
    { id: 13, nombre: 'Mariscos', emoji: '🦐' },
    { id: 14, nombre: 'Sopas', emoji: '🍲' },
    { id: 15, nombre: 'Desayunos', emoji: '🍳' },
    { id: 16, nombre: 'Sandwich', emoji: '🥪' },
    { id: 17, nombre: 'Helados', emoji: '🍨' },
    { id: 18, nombre: 'Snacks', emoji: '🍿' },
    { id: 19, nombre: 'Vegano', emoji: '🥦' },
    { id: 20, nombre: 'Kids', emoji: '🧸' }
]

const cantRef = ref(null)

function selectProducto(p) {
    cantRef.value.open(p)
}

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
