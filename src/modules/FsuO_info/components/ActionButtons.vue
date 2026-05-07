<!-- src/modules/FsuO_info/components/ActionButtons.vue -->
<template>

    <div class="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">

        <!-- HOME -->
        <button @click="goHome" class="h-14 px-8 rounded-2xl bg-[#FD7635]
             text-white font-bold shadow-lg
             hover:scale-[1.03] active:scale-95
             transition-all duration-200">

            <i class="fa fa-home mr-2"></i>

            Ir al inicio

        </button>

        <!-- BACK -->
        <button @click="goBack" class="h-14 px-8 rounded-2xl bg-white
             border border-gray-200
             text-gray-700 font-bold shadow-sm
             hover:bg-gray-50
             active:scale-95
             transition-all duration-200">

            <i class="fa fa-arrow-left mr-2"></i>

            Regresar

        </button>

    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
    router.push('/principal')
}

function goBack() {

    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/principal')
    }
}
</script>