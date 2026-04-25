<template>

    <div class="flex items-center justify-between">

        <div class="flex gap-3 items-center">

            <img :src="img" class="w-14 h-14 rounded-xl object-cover" />

            <div>
                <div class="text-sm font-medium">{{ name }}</div>

                <div class="text-xs text-gray-400">
                    ₹{{ price }}
                    <span class="line-through ml-1">₹{{ old }}</span>
                </div>
            </div>

        </div>

        <div class="text-sm font-semibold">
            x {{ qty }}
        </div>

    </div>

</template>

<script setup>
defineProps({
    name: String,
    price: String,
    old: String,
    qty: String,
    img: String
})
</script>