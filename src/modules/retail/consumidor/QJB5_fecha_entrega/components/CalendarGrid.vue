<template>

    <div class="mt-4">

        <!-- DIAS -->
        <div class="grid grid-cols-7 text-xs text-gray-500 mb-2 text-center">
            <span v-for="d in dias" :key="d">{{ d }}</span>
        </div>

        <!-- GRID -->
        <div class="grid grid-cols-7 gap-2 text-center">

            <DayItem v-for="(d, i) in diasMes" :key="i" :day="d" :active="d === 5" />

        </div>

    </div>

</template>

<script setup>
import DayItem from './DayItem.vue'

const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const diasMes = [
    28, 29, 30, 31, 1, 2, 3,
    4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 1
]
</script>