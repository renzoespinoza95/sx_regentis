<template>

    <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none">

        <div ref="box" class="lottie-box">
            <DotLottieVue autoplay loop style="width: 220px; height: 220px" src="/confetti.lottie" />
        </div>

    </div>

</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const visible = ref(false)
const box = ref(null)

// 🔥 FUNCIÓN SIMPLE
function show(duration = 2000) {

    visible.value = true

    setTimeout(() => {
        visible.value = false
    }, duration)
}

defineExpose({ show })
</script>