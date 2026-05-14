<template>

    <div class="absolute text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center"
        :class="delay ? 'animate-float2' : 'animate-float'" :style="{ background: bg }">

        <i :class="`fa ${icon} text-2xl`"></i>

    </div>

</template>

<script setup>

defineProps({

    icon: String,
    bg: String,
    delay: Boolean

})

</script>

<style scoped>
@keyframes floaty {

    0%,
    100% {

        transform: translateY(0px);

    }

    50% {

        transform: translateY(-12px);

    }

}

@keyframes floaty2 {

    0%,
    100% {

        transform: translateY(0px);

    }

    50% {

        transform: translateY(-8px);

    }

}

.animate-float {

    animation: floaty 3s ease-in-out infinite;

}

.animate-float2 {

    animation: floaty2 2.6s ease-in-out infinite;

}
</style>