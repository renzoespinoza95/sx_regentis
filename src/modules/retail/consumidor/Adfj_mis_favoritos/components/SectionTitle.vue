<template>
    <div class="mb-4 font-semibold text-gray-700">
        {{ title }}
    </div>
</template>

<script setup>
defineProps({
    title: String
})
</script>