<template>

    <div class="bg-white rounded-2xl shadow-md flex items-center gap-3 px-4 h-14">

        <!-- ICON -->
        <i class="fa fa-search text-gray-400"></i>

        <!-- INPUT -->
        <input :value="modelValue" type="text" placeholder="Buscar usuario..."
            class="flex-1 outline-none text-sm bg-transparent" @input="
                $emit(
                    'update:modelValue',
                    $event.target.value
                )
                " />

        <!-- CLEAR -->
        <button v-if="modelValue"
            class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition" @click="
                $emit(
                    'update:modelValue',
                    ''
                )
                ">

            <i class="fa fa-times text-xs text-gray-500"></i>

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
