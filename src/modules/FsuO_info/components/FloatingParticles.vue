<!-- src/modules/FsuO_info/components/FloatingParticles.vue -->
<template>

    <div class="absolute inset-0 overflow-hidden pointer-events-none">

        <div v-for="n in 12" :key="n" class="absolute rounded-full bg-[#FD7635]/10 blur-2xl animate-pulse"
            :style="particleStyle(n)">
        </div>

    </div>

</template>

<script setup>

function particleStyle(n) {

    const size = 80 + (n * 12)

    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${(n * 8) % 100}%`,
        top: `${(n * 13) % 100}%`,
        animationDuration: `${2 + n}s`
    }
}
</script>