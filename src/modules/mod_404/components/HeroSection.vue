<template>

    <div
        class="bg-white/90 backdrop-blur-xl rounded-[36px] shadow-[0_10px_50px_rgba(0,0,0,.08)] border border-orange-100 p-5 md:p-10">

        <!-- TITLE -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 text-center mb-8">


            <h1 class="text-[1rem] md:text-[1.6rem] font-black text-[#1d293d] leading-tight">
                Tu negocio merece su propia tienda virtual 🚀
            </h1>

        </div>

        <!-- TEXT -->
        <div class="max-w-3xl mx-auto text-center">

            <p class="text-sm md:text-xl text-gray-700 leading-relaxed animate-fade">
                🍊 ¿Tú también quieres una tienda virtual?
            </p>

            <p class="text-gray-600 text-sm md:text-xl mt-5 leading-relaxed animate-fade-delay">
                Lleva tu negocio, restaurante, farmacia o emprendimiento a otro nivel con una tienda virtual moderna,
                rápida y profesional
                ✨
            </p>

            <p class="text-gray-500 text-sm md:text-lg mt-5 animate-fade-delay2">
                Consulta sin compromiso y obtén tu tienda virtual al instante 📲
            </p>

        </div>

        <!-- WHATSAPP -->
        <WhatsappCard />

        <!-- BUTTON -->
        <div class="mt-10 flex justify-center">

            <WhatsappButton />

        </div>

    </div>

</template>

<script setup>

import FeatureCard from './FeatureCard.vue'
import WhatsappCard from './WhatsappCard.vue'
import WhatsappButton from './WhatsappButton.vue'

</script>

<style scoped>
@keyframes fadeInUp {

    from {

        opacity: 0;
        transform: translateY(20px);

    }

    to {

        opacity: 1;
        transform: translateY(0);

    }

}

.animate-fade {

    animation: fadeInUp .7s ease forwards;

}

.animate-fade-delay {

    opacity: 0;
    animation: fadeInUp .7s ease forwards;
    animation-delay: .25s;

}

.animate-fade-delay2 {

    opacity: 0;
    animation: fadeInUp .7s ease forwards;
    animation-delay: .5s;

}
</style>