<template>

    <div class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50" @click="$emit('click')">

        <div class="flex items-center gap-3">

            <div class="relative">

                <img :src="chat.img" class="w-12 h-12 rounded-full object-cover" />

                <!-- 🔴 BADGE -->
                <span v-if="chat.unread > 0" class="absolute -top-1 -right-1
           bg-red-500 text-white text-[10px]
           min-w-[18px] h-[18px] px-1
           flex items-center justify-center
           rounded-full font-semibold
           shadow">
                    {{ chat.unread }}
                </span>

            </div>


            <div>
                <div class="font-semibold text-sm">
                    {{ chat.name }}
                </div>

                <div class="text-xs text-gray-400 flex items-center gap-1">
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