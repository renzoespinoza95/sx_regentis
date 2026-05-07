<template>

    <div ref="toast" class="fixed left-1/2 -translate-x-1/2 z-[99999] pointer-events-none" style="top: 0;">

        <div class="px-6 py-3 rounded-b-xl shadow-lg flex items-center gap-2 text-white"
            :style="{ background: bgColor }">

            <i :class="iconClass"></i>

            <span>{{ message }}</span>

        </div>

    </div>

</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { gsap } from 'gsap'

const toast = ref(null)

const message = ref('')
const bgColor = ref('#22c55e') // verde por defecto
const iconClass = ref('fa fa-check-circle')

// 🔥 FUNCIÓN PRO
function show(options = {}) {

    const {
        text = 'Operación exitosa 😏',
        type = 'success'
    } = options

    message.value = text  // 👈 SOLO EL TEXTO

    // colores
    if (type === 'success') {
        bgColor.value = '#22c55e'
        iconClass.value = 'fa fa-check-circle'
    }
    else if (type === 'error') {
        bgColor.value = '#ef4444'
        iconClass.value = 'fa fa-times-circle'
    }

    const el = toast.value
    if (!el) return

    gsap.killTweensOf(el)

    gsap.fromTo(el,
        { y: -120, opacity: 0 },
        { y: 70, opacity: 1, duration: 0.4 }
    )

    gsap.to(el, {
        y: -120,
        opacity: 0,
        delay: 2,
        duration: 0.4
    })
}

defineExpose({ show })
</script>