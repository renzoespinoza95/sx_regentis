<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-xl p-5 w-72 text-center space-y-4">

            <!-- 🔥 NOMBRE -->
            <div class="font-semibold text-sm">
                {{ producto?.nombre }}
            </div>

            <!-- 🔥 CONTADOR -->
            <div class="flex justify-center items-center gap-3">

                <button class="w-8 h-8 bg-gray-200 rounded" @click="menos">-</button>

                <input v-model="cantidad" type="number" class="w-12 text-center border rounded" />

                <button class="w-8 h-8 bg-gray-200 rounded" @click="mas">+</button>

            </div>

            <!-- 🔥 BOTON PEDIR -->
            <button class="w-full py-2 text-white rounded-md bg-green-500" @click="pedir">
                PEDIR
            </button>

        </div>

    </div>

</template>

<script setup>
import { ref, nextTick } from 'vue'
import gsap from 'gsap'

const visible = ref(false)
const box = ref(null)

const producto = ref(null)
const cantidad = ref(1)

function open(p) {
    producto.value = p
    cantidad.value = 1
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

function mas() {
    cantidad.value++
}

function menos() {
    if (cantidad.value > 1) cantidad.value--
}

function pedir() {
    console.log('PEDIR:', producto.value, cantidad.value)
    close()
}

defineExpose({ open })
</script>
