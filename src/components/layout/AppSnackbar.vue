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

                    <template v-if="actions.length">

                        <button v-for="(a, index) in actions" :key="index"
                            class="px-3 py-1 rounded text-white text-xs bg-green-600" @click="a.action()">

                            {{ a.text }}

                        </button>

                    </template>

                    <template v-else>

                        <button v-if="showConfirm" class="bg-green-500 px-3 py-1 rounded text-white text-xs"
                            @click="confirmar">

                            Sí

                        </button>

                        <button class="bg-red-500 px-3 py-1 rounded text-white text-xs" @click="cerrar">

                            {{ showConfirm ? 'No' : 'Cerrar' }}

                        </button>

                    </template>

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

const box = ref(null)

const showConfirm = ref(false)

const actions = ref([])

let callback = null

function open(
    msg,
    onConfirm = null,
    customActions = []
) {

    message.value = msg

    showConfirm.value =
        !!onConfirm

    callback =
        onConfirm

    actions.value =
        customActions

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

    if (callback) {

        cerrar()

        setTimeout(() => {

            callback()

        }, 250)

    }
    else {

        cerrar()

    }

}

defineExpose({

    open,

    cerrar

})
</script>