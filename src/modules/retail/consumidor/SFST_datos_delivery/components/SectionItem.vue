<template>

    <div class="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm cursor-pointer">

        <div class="flex items-center gap-3">

            <div class="text-[#4DB6AC] text-lg">
                <i :class="['fa', icon]"></i>
            </div>

            <div>
                <div class="text-sm font-semibold text-gray-700">
                    {{ title }}
                </div>
                <div class="text-xs text-gray-400">
                    {{ subtitle }}
                </div>
            </div>

        </div>

        <i class="fa fa-chevron-right text-gray-400"></i>

    </div>

</template>

<script setup>
defineProps({
    icon: String,
    title: String,
    subtitle: String
})
</script>