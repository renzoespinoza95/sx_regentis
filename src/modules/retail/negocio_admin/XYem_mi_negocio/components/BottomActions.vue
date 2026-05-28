<template>

    <div class="
            mt-5

            flex
            gap-3
        ">

        <!-- UBICACION -->
        <button class="
                flex-1

                h-14

                rounded-2xl

                bg-cyan-500

                text-white

                font-black

                shadow-lg

                active:scale-[0.98]

                transition
            ">

            <i class="
                    fa
                    fa-map-marker
                    mr-2
                ">

            </i>

            Ubicación

        </button>

        <!-- MEMBRESIA -->
        <button class="
                flex-1

                h-14

                rounded-2xl

                bg-gradient-to-r
                from-yellow-400
                via-amber-400
                to-orange-400

                text-black

                font-black

                shadow-xl

                active:scale-[0.98]

                transition
            " @click="
                $emit('open-membresia')
                ">

            <i class="
                    fa
                    fa-diamond
                    mr-2
                ">

            </i>

            Membresía

        </button>

    </div>

</template>

<script setup>

defineEmits([

    'open-membresia'

])

</script>