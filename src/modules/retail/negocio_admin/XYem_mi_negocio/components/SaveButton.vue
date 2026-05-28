<template>

    <button class="
            w-full

            h-16

            mt-6

            rounded-3xl

            bg-gradient-to-r
            from-cyan-500
            via-teal-500
            to-emerald-500

            text-white

            text-lg

            font-black

            shadow-2xl

            active:scale-[0.98]

            transition
        " @click="
            $emit('click')
            ">

        <i class="
                fa
                fa-save
                mr-2
            ">

        </i>

        Guardar negocio

    </button>

</template>

<script setup>

defineEmits([

    'click'

])

</script>