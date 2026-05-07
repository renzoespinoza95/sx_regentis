<!-- src/modules/FsuO_info/FsuO_info.vue -->
<template>

    <div class="min-h-screen bg-[#f5f5f5] relative overflow-hidden flex flex-col">

        <!-- FX -->
        <FloatingParticles />

        <!-- CONTENT -->
        <div class="flex-1 flex items-center justify-center px-5 py-10">

            <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                <!-- LEFT -->
                <div class="flex flex-col items-center lg:items-start text-center lg:text-left">

                    <ErrorHero />

                    <ErrorMessage />

                    <ActionButtons />

                </div>

                <!-- RIGHT -->
                <div class="flex justify-center">

                    <ErrorImage />

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>
import ErrorHero from './components/ErrorHero.vue'
import ErrorImage from './components/ErrorImage.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import ActionButtons from './components/ActionButtons.vue'
import FloatingParticles from './components/FloatingParticles.vue'
</script>