<template>

    <div class="bg-white rounded-xl shadow-sm px-3 py-2 flex items-center gap-2">

        <!-- 🔍 ICON -->
        <i class="fa fa-search text-gray-400"></i>

        <!-- INPUT -->
        <input v-model="model" placeholder="Buscar cliente..." class="flex-1 text-sm outline-none" />

        <!-- ❌ CLEAR -->
        <button v-if="model" @click="model = ''" class="
                w-6
                h-6
                rounded-full
                bg-red-100
                text-red-500
                flex
                items-center
                justify-center
                text-[10px]
                active:scale-95
                transition
            ">

            <i class="fa fa-times"></i>

        </button>

    </div>

</template>

<script setup>

const model = defineModel()

</script>