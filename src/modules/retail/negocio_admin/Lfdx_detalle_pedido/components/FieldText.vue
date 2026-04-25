<template>

    <div class="text-sm space-y-1">

        <!-- LABEL -->
        <div class="text-gray-500">
            {{ label }}
        </div>

        <!-- 🔥 VALOR -->
        <div class="font-medium text-gray-800">
            {{ value }}
        </div>

    </div>

</template>

<script setup>
defineProps({
    label: String,
    value: String
})
</script>