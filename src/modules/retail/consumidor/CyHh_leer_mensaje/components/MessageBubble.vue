<template>

    <div class="flex" :class="message.from === 'me' ? 'justify-end' : 'justify-start'">

        <div class="px-4 py-2 rounded-2xl text-sm max-w-[70%]" :class="message.from === 'me'
            ? 'bg-[#FD7635] text-white rounded-br-none'
            : 'bg-white text-gray-700 rounded-bl-none shadow'">
            {{ message.text }}
        </div>

    </div>

</template>

<script setup>
defineProps({
    message: Object
})
</script>