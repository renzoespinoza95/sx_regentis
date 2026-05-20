<template>

    <div class="flex justify-between items-center text-sm">

        <!-- LABEL -->
        <span class="text-gray-500">
            {{ label }}
        </span>

        <!-- VALOR -->
        <span class="font-medium text-gray-800">
            {{ value }}
        </span>

    </div>

</template>

<script setup>
defineProps({
    label: String,
    value: String
})
</script>