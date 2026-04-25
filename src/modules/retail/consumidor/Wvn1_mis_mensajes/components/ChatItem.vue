<template>

    <div class="flex items-center justify-between px-4 py-3">

        <div class="flex items-center gap-3">

            <img :src="chat.img" class="w-12 h-12 rounded-full object-cover" />

            <div>
                <div class="font-semibold text-sm">
                    {{ chat.name }}
                </div>

                <div class="text-xs text-gray-400 flex items-center gap-1">
                    <i class="fa fa-check text-orange-500"></i>
                    {{ chat.msg }}
                </div>
            </div>

        </div>

        <div class="text-xs text-[#FD7635]">
            {{ chat.time }}
        </div>

    </div>

</template>

<script setup>
defineProps({
    chat: Object
})
</script>