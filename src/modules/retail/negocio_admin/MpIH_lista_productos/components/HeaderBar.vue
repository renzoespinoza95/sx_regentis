<template>

    <div class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 pt-4 pb-3 shadow-md" :style="{
        background: mercado.topnavbar_color || '#FD7635',
        '--header-color': mercado.topnavbar_color || '#FD7635'
    }">

        <!-- LEFT -->
        <div class="flex items-center gap-2 cursor-pointer" @click="goBack">

            <div class="w-9 h-9 bg-white rounded-full flex items-center justify-center active:scale-90 transition">

                <i class="fa fa-arrow-left text-sm" :style="{
                    color:
                        mercado.topnavbar_color
                        || '#FD7635'
                }"></i>

            </div>

            <span class="font-semibold text-lg text-white">

                Lista de Productos

            </span>

        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-3">

            <!-- ➕ -->
            <div class="icon-btn" @click="$emit('nuevo')">

                <i class="fa fa-plus"></i>

            </div>

            <!-- ⋮ -->
            <div class="icon-btn" @click="$emit('openOptions')">

                <i class="fa fa-ellipsis-v"></i>

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    useMercado
} from '../../../../../services/useMercado.js'

import {
    useRouter
} from 'vue-router'

const emit = defineEmits([
    'nuevo',
    'openOptions'
])

const router = useRouter()

const {
    mercado
} = useMercado()

function goBack() {

    if (window.history.length > 1) {

        router.back()

    } else {

        router.push('/')

    }

}

</script>

<style scoped>
.icon-btn {

    width: 36px;

    height: 36px;

    background: white;

    border-radius: 50%;

    display: flex;

    align-items: center;

    justify-content: center;

    color: var(--header-color, #FD7635);

    cursor: pointer;

    transition: all 0.2s ease;

}

.icon-btn:active {

    transform: scale(0.9);

}
</style>