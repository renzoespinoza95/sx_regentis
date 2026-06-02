<template>

    <div class="h-screen flex flex-col">

        <div class="p-3 bg-white border-b flex gap-2">

            <button class="px-4 py-2 bg-green-500 text-white rounded" @click="imprimir">

                Imprimir

            </button>

            <button class="px-4 py-2 bg-red-500 text-white rounded" @click="cerrar">

                Cerrar

            </button>

        </div>

        <iframe :src="pdf" class="flex-1 w-full" />

    </div>

</template>

<script setup>

import {
    useRoute
} from 'vue-router'

const route =
    useRoute()

const pdf =
    route.query.pdf

function imprimir() {

    window.frames[0].print()

}

function cerrar() {

    window.close()

}

</script>
