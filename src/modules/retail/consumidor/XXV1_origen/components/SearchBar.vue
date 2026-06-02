<template>

    <div class="
        bg-white
        rounded-2xl
        shadow
        px-4
        py-2
        flex
        items-center
        gap-2
    ">

        <i class="fa fa-search text-gray-400"></i>

        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="
                flex-1
                outline-none
                text-sm
            " placeholder="Buscar mercados..." />

        <button v-if="modelValue" @click="$emit('update:modelValue', '')" class="
                w-7
                h-7

                rounded-full

                bg-gray-200

                hover:bg-gray-300

                flex
                items-center
                justify-center

                transition
            ">

            <i class="fa fa-times text-xs text-gray-600"></i>

        </button>

    </div>

</template>

<script setup>

defineProps({

    modelValue: {

        type: String,

        default: ''

    }

})

defineEmits([

    'update:modelValue'

])

</script>