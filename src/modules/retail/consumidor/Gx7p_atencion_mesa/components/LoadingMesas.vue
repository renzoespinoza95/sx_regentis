<!-- LoadingMesas.vue -->

<template>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">

        <div v-for="i in 8" :key="i" class="bg-white rounded-2xl shadow overflow-hidden animate-pulse">

            <div class="w-full h-28 bg-gray-200"></div>

            <div class="p-3 space-y-2">

                <div class="h-4 bg-gray-200 rounded"></div>

                <div class="h-3 w-20 bg-gray-200 rounded"></div>

            </div>

        </div>

    </div>

</template>

<script setup>
</script>