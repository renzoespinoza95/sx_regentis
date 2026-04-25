<template>
    <div class="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
        <canvas ref="canvas" class="w-full h-[80vh]"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'

const canvas = ref(null)
let audioContext, analyser, dataArray, source, raf

const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256

    source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)

    const ctx = canvas.value.getContext('2d')

    const draw = () => {
        raf = requestAnimationFrame(draw)

        analyser.getByteFrequencyData(dataArray)

        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

        const barWidth = canvas.value.width / bufferLength

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2
            ctx.fillStyle = '#22c55e'
            ctx.fillRect(i * barWidth, canvas.value.height - barHeight, barWidth - 1, barHeight)
        }
    }

    draw()
}

const stop = () => {

    cancelAnimationFrame(raf)

    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close()
    }

    audioContext = null
}

defineExpose({ start, stop })

onUnmounted(stop)
</script>
