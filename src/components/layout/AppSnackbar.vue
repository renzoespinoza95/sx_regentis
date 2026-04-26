<template>

    <teleport to="body">

        <div v-if="visible" class="fixed inset-0 flex items-start justify-center z-[9999] pointer-events-none">

            <!-- SNACKBAR -->
            <div ref="box"
                class="mt-20 bg-[#FD7635] text-white px-5 py-4 rounded-xl shadow-lg flex items-center gap-4 pointer-events-auto">

                <!-- TEXTO -->
                <span class="text-sm font-medium">
                    {{ message }}
                </span>

                <!-- BOTONES -->
                <div class="flex items-center gap-2">

                    <button v-if="showConfirm" class="bg-green-500 px-3 py-1 rounded text-white text-xs"
                        @click="confirmar">
                        Sí
                    </button>

                    <button class="bg-red-500 px-3 py-1 rounded text-white text-xs" @click="cerrar">
                        {{ showConfirm ? 'No' : 'Cerrar' }}
                    </button>

                </div>

            </div>

        </div>

    </teleport>

</template>

<script setup>
import { ref, nextTick } from 'vue'
import gsap from 'gsap'

const visible = ref(false)
const message = ref('')
const showConfirm = ref(false)

const box = ref(null)

let callback = null

function open(msg, onConfirm = null) {
    message.value = msg
    showConfirm.value = !!onConfirm
    callback = onConfirm
    visible.value = true

    nextTick(() => {
        gsap.fromTo(
            box.value,
            {
                y: -120,
                opacity: 0,
                scale: 0.95
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power3.out'
            }
        )
    })
}

function cerrar() {
    gsap.to(box.value, {
        y: -120,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: 'power3.in',
        onComplete: () => visible.value = false
    })
}

function confirmar() {
    if (callback) callback()
    cerrar()
}

defineExpose({ open })
</script>