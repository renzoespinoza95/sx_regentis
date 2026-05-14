<template>

    <div @click="emit('select')"
        class="bg-white rounded-2xl shadow-md p-4 flex items-center gap-3 transition cursor-pointer"
        :class="selected ? 'ring-2 ring-[#FD7635] scale-[1.02]' : 'hover:scale-[1.02]'">

        <!-- RADIO VISUAL -->
        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :class="selected ? 'border-[#FD7635]' : 'border-gray-400'">

            <div v-if="selected" class="w-2.5 h-2.5 bg-[#FD7635] rounded-full"></div>

        </div>

        <!-- FOTO -->
        <img :src="usuario.foto" class="w-12 h-12 rounded-lg object-cover" />

        <!-- INFO -->
        <div class="flex-1">

            <div class="flex justify-between text-sm font-semibold">
                <span>{{ usuario.nombre }}</span>
                <span class="text-gray-500">{{ usuario.tienda }}</span>
            </div>

            <div class="text-xs text-gray-500 mt-1">
                {{ usuario.rol }}
            </div>

        </div>

    </div>

</template>

<script setup>

const props = defineProps({
    usuario: Object,
    selected: Boolean
})

const emit = defineEmits(['select'])

</script>