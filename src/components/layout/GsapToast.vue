<template>

    <div v-if="visible" ref="toast" class="fixed left-1/2 -translate-x-1/2 z-[99999] pointer-events-none"
        style="top: 0;">

        <div class="px-6 py-3 rounded-b-xl shadow-lg flex items-center gap-2 text-white"
            :style="{ background: bgColor }">

            <i :class="iconClass"></i>

            <span>{{ message }}</span>

        </div>

    </div>

</template>

<script setup>

import { ref, defineExpose, nextTick } from 'vue'
import { gsap } from 'gsap'

const toast = ref(null)

const visible = ref(false)

const message = ref('')

const bgColor = ref('#22c55e')

const iconClass = ref('fa fa-check-circle')

/* =========================================
   🔥 SHOW
========================================= */

async function show(options = {}) {

    const {
        text = 'Operación exitosa 😏',
        type = 'success'
    } = options

    message.value = text

    // 🔥 colores
    if (type === 'success') {

        bgColor.value = '#22c55e'
        iconClass.value = 'fa fa-check-circle'

    }
    else if (type === 'error') {

        bgColor.value = '#ef4444'
        iconClass.value = 'fa fa-times-circle'

    }

    // 🔥 mostrar
    visible.value = true

    await nextTick()

    const el = toast.value

    if (!el) return

    gsap.killTweensOf(el)

    // 🔥 entrada
    gsap.fromTo(el,

        {
            y: -120,
            opacity: 0
        },

        {
            y: 70,
            opacity: 1,
            duration: 0.4
        }

    )

    // 🔥 salida
    gsap.to(el, {

        y: -120,
        opacity: 0,

        delay: 2,
        duration: 0.4,

        onComplete: () => {

            visible.value = false

        }

    })

}

defineExpose({
    show
})

</script>