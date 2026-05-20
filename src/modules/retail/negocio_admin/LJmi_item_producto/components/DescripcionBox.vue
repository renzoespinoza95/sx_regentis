<!-- =========================================
DescripcionBox.vue
========================================= -->

<template>

    <div>

        <label class="
                text-sm
                text-gray-600
                block
                mb-2
            ">
            Descripción
        </label>

        <textarea v-model="model" rows="4" class="
                w-full
                rounded-[20px]
                border-0
                p-4
                bg-[#f7efec]
                shadow-[0_6px_16px_rgba(0,0,0,0.10)]
                outline-none
                resize-none
            "></textarea>

    </div>

</template>

<script setup>

const model = defineModel()

</script>