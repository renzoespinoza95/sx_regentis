<template>

    <div class="text-center text-xs text-gray-400 my-2">
        {{ text }}
    </div>

</template>

<script setup>
defineProps({
    text: String
})
</script>