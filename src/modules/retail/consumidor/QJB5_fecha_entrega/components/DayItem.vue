<template>

    <div class="w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer" :class="active
        ? 'bg-[#FD7635] text-white'
        : 'text-gray-700'">
        {{ day }}
    </div>

</template>

<script setup>
defineProps({
    day: Number,
    active: Boolean
})
</script>