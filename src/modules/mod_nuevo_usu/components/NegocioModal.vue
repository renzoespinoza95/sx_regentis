<template>
    <TransitionRoot :show="show" as="template">
        <Dialog as="div" class="fixed inset-0 z-50" @close="$emit('close')">

            <!-- BACKDROP -->
            <div ref="backdrop" class="fixed inset-0 bg-black/40"></div>

            <!-- CONTENT -->
            <div class="fixed inset-0 flex items-center justify-center p-4">

                <DialogPanel ref="panel" class="w-full max-w-md bg-white rounded-2xl shadow-xl p-4 origin-center">

                    <DialogTitle class="text-lg font-semibold mb-3">
                        Seleccionar negocio
                    </DialogTitle>

                    <div class="space-y-2 max-h-80 overflow-y-auto">

                        <div v-for="n in negocios" :key="n.neg_id" @click="select(n)"
                            class="p-3 rounded-xl border hover:bg-gray-100 cursor-pointer">
                            <div class="font-medium">{{ n.nombre }}</div>
                            <div class="text-xs text-gray-500">
                                Puesto: {{ n.puesto }}
                            </div>
                        </div>

                    </div>

                </DialogPanel>

            </div>

        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot
} from '@headlessui/vue'

const props = defineProps({
    show: Boolean,
    negocios: Array
})

const emit = defineEmits(['close', 'select'])

const panel = ref(null)
const backdrop = ref(null)

// 🔥 ANIMACIÓN GSAP
watch(() => props.show, async (val) => {
    if (val) {
        await nextTick()

        gsap.fromTo(backdrop.value,
            { opacity: 0 },
            { opacity: 1, duration: 0.2 }
        )

        gsap.fromTo(panel.value,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.35,
                ease: "back.out(1.7)"
            }
        )
    }
})

function select(n) {
    emit('select', n)
}
</script>