<template>

    <div class="flex justify-between items-center px-4 py-4"
        :style="{ background: mercado.topnavbar_color || '#FD7635' }">

        <div class="flex items-center gap-2 cursor-pointer" @click="goBack">

            <div class="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                <i class="fa fa-arrow-left text-sm" :style="{ color: mercado.topnavbar_color }"></i>
            </div>

            <span class="text-white font-semibold">
                Editar trabajador
            </span>

        </div>

        <!-- 🔥 MISMO ESTILO -->
        <div class="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer"
            @click="$emit('openOptions')">
            <i class="fa fa-ellipsis-v text-sm" :style="{ color: mercado.topnavbar_color }"></i>
        </div>

    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMercado } from '../../../../../services/useMercado.js'

const router = useRouter()
const { mercado } = useMercado()

function goBack() {
    if (window.history.length > 1) router.back()
    else router.push('/')
}
</script>