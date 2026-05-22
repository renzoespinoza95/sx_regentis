<template>

    <button class="
            mesa-card
            w-full
            rounded-[24px]
            px-3
            py-4
            flex
            flex-col
            items-center
            justify-center
            text-center
            border
            active:scale-[0.97]
            transition-all
            shadow-sm
            min-h-[135px]
        " :class="mesa.estado === 'DISPONIBLE'
                ? 'border-green-200 bg-green-50/70'
                : 'border-orange-200 bg-orange-50/70'
            " @click="$emit('click', mesa)">

        <!-- EMOJI -->
        <div class="
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                text-3xl
                shadow-sm
            " :class="mesa.estado === 'DISPONIBLE'
                    ? 'bg-green-100'
                    : 'bg-orange-100'
                ">

            {{
                mesa.estado === 'DISPONIBLE'
                    ? '🟢'
                    : '🟠'
            }}

        </div>

        <!-- NOMBRE -->
        <div class="
                mt-3
                text-[18px]
                font-black
                leading-none
            " :class="mesa.estado === 'DISPONIBLE'
                    ? 'text-green-600'
                    : 'text-orange-600'
                ">

            {{ mesa.nombre }}

        </div>

        <!-- STATUS -->
        <div class="
                mt-2
                text-xs
                font-semibold
            " :class="mesa.estado === 'DISPONIBLE'
                    ? 'text-green-500'
                    : 'text-orange-500'
                ">

            {{
                mesa.estado === 'DISPONIBLE'
                    ? 'LIBRE'
                    : 'OCUPADO'
            }}

        </div>

    </button>

</template>

<script setup>

defineProps({

    mesa:
        Object

})

defineEmits([
    'click'
])

</script>