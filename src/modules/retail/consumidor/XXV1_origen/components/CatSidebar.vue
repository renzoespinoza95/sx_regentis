<template>

    <div ref="sidebar" class="
        w-24
        flex
        flex-col
        items-center
        gap-4
        pt-2
        overflow-y-auto
        no-scrollbar
        cursor-grab
    " style="
            max-height:
                calc(100vh - 140px);
        ">

        <div v-for="(cat, i) in categorias" :key="i" @click="$emit('change', i)" class="
                flex
                flex-col
                items-center
                cursor-pointer
            ">

            <!-- ICON -->
            <div class="
                    w-14
                    h-14

                    rounded-full

                    overflow-hidden

                    flex
                    items-center
                    justify-center

                    text-2xl

                    bg-white

                    shadow-md

                    transition

                    relative
                " :class="i === active

                    ?

                    'rainbow-border scale-105'

                    :

                    'opacity-70'
                    ">

                🏪

            </div>

            <!-- TEXTO -->
            <div class="
        text-[10px]
        mt-1
        text-center
        leading-tight
        transition
    " :class="i === active

        ?

        'text-[#FFD700] font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.55)]'

        :

        'text-white'
        ">

                {{ cat.nombre }}

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({

    categorias: Array,
    active: Number

})

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {

    display: none;

}

.no-scrollbar {

    scrollbar-width: none;

}

/* =========================================
   ✨ GOLD BORDER
========================================= */

.rainbow-border {

    position: relative;

    padding: 3px;

    border-radius: 9999px;

    background-image:

        radial-gradient(circle at center center,
            rgba(33, 33, 33, 0),
            rgb(33, 33, 33)),

        repeating-linear-gradient(135deg,
            rgb(33, 33, 33) 0px,
            rgb(33, 33, 33) 1px,
            transparent 1px,
            transparent 4px),

        repeating-linear-gradient(45deg,
            rgb(56, 56, 56) 0px,
            rgb(56, 56, 56) 5px,
            transparent 5px,
            transparent 6px),

        linear-gradient(90deg,
            rgb(33, 33, 33),
            rgb(33, 33, 33));

    box-shadow:

        0 0 12px rgba(255, 215, 0, 0.22),

        inset 0 0 8px rgba(255, 255, 255, 0.04);

}

/* =========================================
   ✨ BORDE DORADO ANIMADO
========================================= */

.rainbow-border::before {

    content: "";

    position: absolute;

    inset: 0;

    border-radius: inherit;

    padding: 2px;

    background:

        linear-gradient(45deg,

            #fffdf2 0%,

            #fff6c7 12%,

            #ffe27a 24%,

            #ffd700 36%,

            #fff7d1 50%,

            #c89b00 64%,

            #fff4b0 76%,

            #ffffff 88%,

            #ffd700 100%);

    background-size:
        300% 300%;

    animation:
        goldMove 4s linear infinite;

    -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);

    -webkit-mask-composite: xor;

    mask-composite: exclude;

    box-shadow:

        0 0 12px rgba(255, 215, 0, 0.45),

        0 0 24px rgba(255, 255, 255, 0.15);

}

/* =========================================
   ✨ BRILLO EXTERIOR
========================================= */

.rainbow-border::after {

    content: "";

    position: absolute;

    inset: -5px;

    border-radius: inherit;

    background:

        radial-gradient(circle,

            rgba(255, 215, 0, 0.35) 0%,

            rgba(255, 255, 255, 0.15) 35%,

            transparent 75%);

    filter: blur(8px);

    opacity: 0.9;

    z-index: -1;

}

/* =========================================
   ✨ ANIMACION DORADA
========================================= */

@keyframes goldMove {

    0% {

        background-position:
            0% 50%;

    }

    100% {

        background-position:
            300% 50%;

    }

}
</style>