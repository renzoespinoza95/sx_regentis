<!-- =========================================
InputField.vue
========================================= -->

<template>

    <div>

        <label class="
                text-sm
                text-gray-600
                mb-1
                block
            ">
            {{ label }}
        </label>

        <input v-model="model" class="
                w-full
                h-[48px]
                rounded-[16px]
                border-0
                px-4
                bg-[#f7efec]
                shadow-[0_6px_16px_rgba(0,0,0,0.10)]
                outline-none
            " />

    </div>

</template>

<script setup>

const props = defineProps({

    label: String

})

const model = defineModel()

</script>