<template>

    <div class="rounded-[28px] border border-orange-100 bg-[#fff9f5] p-5 flex items-start gap-4 shadow-sm">

        <div class="w-16 h-16 rounded-2xl bg-[#ff7c38] text-white flex items-center justify-center shrink-0">
            <i :class="`fa ${icon} text-3xl`"></i>
        </div>

        <div>

            <h3 class="text-2xl font-black text-[#1d293d]">
                {{ title }}
            </h3>

            <p class="text-gray-500 text-lg mt-2 leading-relaxed">
                {{ text }}
            </p>

        </div>

    </div>

</template>

<script setup>

defineProps({

    icon: String,
    title: String,
    text: String

})

</script>