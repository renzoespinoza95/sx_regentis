<template>

    <div class="flex items-center justify-center mb-1 md:mb-2">

        <div class="relative w-full max-w-[210px] flex items-center justify-center">

            <!-- BG -->
            <div class="absolute
                       w-[160px]
                       h-[160px]
                       md:w-[210px]
                       md:h-[210px]
                       rounded-full
                       bg-gradient-to-br
                       from-orange-100
                       to-pink-100
                       opacity-70
                       blur-sm">
            </div>

            <!-- ICONS -->
            <FloatingIcon icon="fa-shopping-cart" bg="#ff8a3d" class="left-2 md:left-0 top-5 z-20 scale-75" />

            <FloatingIcon icon="fa-check" bg="#62d26f" class="right-2 md:right-0 top-12 z-20 scale-75" :delay="true" />

            <!-- LOGO -->
            <img src="https://barsi-img.b-cdn.net/recursos/logo-regentis.png" class="relative z-10
                       w-full
                       max-w-[190px]
                       h-auto
                       drop-shadow-2xl" />

        </div>

    </div>

</template>

<script setup>

import FloatingIcon from './FloatingIcon.vue'

</script>