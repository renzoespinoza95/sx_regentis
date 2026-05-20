<template>

    <HeaderBack />

    <div
        class="min-h-screen bg-[#fff8f2] overflow-hidden relative px-4 py-10 md:py-16 flex items-center justify-center pt-20">

        <BackgroundGlow />

        <div class="w-full max-w-5xl mx-auto relative z-10">

            <!-- HERO -->
            <LottieHero />

            <!-- MAIN CARD -->
            <HeroSection />

        </div>

    </div>

</template>

<script setup>

import BackgroundGlow from './components/BackgroundGlow.vue'
import LottieHero from './components/LottieHero.vue'
import HeroSection from './components/HeroSection.vue'
import NegpresHeader from '../../components/layout/HeaderBack.vue'
</script>