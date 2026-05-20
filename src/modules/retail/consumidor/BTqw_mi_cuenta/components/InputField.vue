<template>

    <div>

        <!-- LABEL -->
        <label class="
                text-xs
                text-gray-400
                ml-2
            ">

            {{ label }}

        </label>

        <!-- INPUT -->
        <input v-model="model" :type="type" :placeholder="placeholder" class="
                w-full
                mt-1
                px-4
                py-3
                rounded-full
                border
                border-gray-200
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#FD7635]
            " />

    </div>

</template>

<script setup>

const model =
    defineModel()

defineProps({

    label: String,

    placeholder: String,

    type: {

        type: String,

        default: 'text'

    }

})

</script>