<template>

    <div class="
            bg-white
            rounded-xl
            shadow-md
            p-3
            flex
            items-center
            gap-3
            cursor-pointer
            active:scale-[0.98]
            transition
        " @click="$emit('edit', item)">

        <!-- 🔥 AVATAR -->
        <img src="https://picsum.photos/60" class="w-10 h-10 rounded-full object-cover" />

        <!-- 🔥 CONTENIDO -->
        <div class="flex-1 flex justify-between items-start gap-3 min-w-0">

            <!-- LEFT -->
            <div class="min-w-0 flex-1">

                <!-- NOMBRE -->
                <div class="font-semibold text-gray-800 truncate">

                    {{ item.nombre }}

                </div>

                <!-- PUESTO -->
                <div class="text-xs text-gray-500 mt-1">

                    <span class="font-semibold">

                        Puesto:

                    </span>

                    <span :class="!item.puesto ? 'text-green-400 font-semibold' : ''">

                        {{ item.puesto || '—' }}

                    </span>

                </div>

                <!-- 💸 POR PAGAR -->
                <div v-if="item.por_pagar" class="
        mt-2
        inline-flex
        items-center
        gap-1
        px-2
        py-1
        rounded-full
        bg-red-100
        text-red-600
        text-[10px]
        font-bold
    ">

                    💸
                    Por pagar

                </div>

            </div>

            <!-- RIGHT -->
            <div class="text-right text-xs shrink-0">

                <!-- CELULAR -->
                <div class="text-gray-500">

                    <span class="font-semibold">

                        Cel:

                    </span>

                    <span :class="!item.celular ? 'text-green-400 font-semibold' : ''">

                        {{ item.celular || '—' }}

                    </span>

                </div>

                <!-- DNI -->
                <div class="text-gray-500 mt-1">

                    <span class="font-semibold">

                        DNI:

                    </span>

                    <span :class="!item.dni ? 'text-green-400 font-semibold' : ''">

                        {{ item.dni || '—' }}

                    </span>

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({

    item: Object

})

defineEmits([
    'edit'
])

</script>