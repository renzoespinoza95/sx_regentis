<template>

    <div class="
        header-hex

        fixed
        top-0
        left-0
        right-0

        z-50

        flex
        justify-between
        items-center

        px-4
        py-4

        shadow-md
    ">

        <!-- LEFT -->
        <div class="
                flex
                items-center
                gap-3
            ">

            <!-- LOGO -->
            <div class="
                w-10
                h-10

                rounded-full

                overflow-hidden

                bg-white

                shadow-lg

                border
                border-yellow-500/30

                shrink-0
            ">

                <img src="https://barsi-img.b-cdn.net/recursos/logo-regentis.png" class="
        w-full
        h-full
        object-cover
    " />

            </div>

            <!-- TITULO -->
            <span class="
                gold-text

                text-lg

                font-black

                tracking-wide
            ">

                UnionComercial

            </span>

        </div>

        <!-- RIGHT -->
        <div class="
            flex
            items-center
            gap-2
        ">

            <!-- OPTIONS -->
            <div class="
                    w-9
                    h-9

                    bg-black/50

                    rounded-full

                    flex
                    items-center
                    justify-center

                    cursor-pointer

                    border
                    border-yellow-500/40

                    active:scale-95

                    transition
                " @click="openOptions">

                <i class="
                    fa
                    fa-ellipsis-v
                    text-sm
                    gold-text
                ">

                </i>

            </div>

        </div>

    </div>

    <!-- DIALOG -->
    <OptionsDialog ref="optionsDialogRef" />

</template>

<script setup>

import {
    ref
}
    from 'vue'

import OptionsDialog
    from './OptionsDialog.vue'

/* =========================================
   🔥 DIALOG
========================================= */

const optionsDialogRef =
    ref(null)

/* =========================================
   🔥 OPEN
========================================= */

function openOptions() {

    optionsDialogRef.value?.open()

}

</script>

<style scoped>
/* =========================================
   🔥 HEADER
========================================= */

.header-hex {

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

    color: white;

    border-bottom:
        1px solid rgba(255, 215, 0, 0.18);

    box-shadow:
        0 4px 14px rgba(0, 0, 0, 0.45);

}

/* =========================================
   🔥 TEXTO DORADO
========================================= */

.gold-text {

    background:
        linear-gradient(180deg,
            #fff6b7 0%,
            #ffd700 45%,
            #c89b00 100%);

    -webkit-background-clip: text;

    -webkit-text-fill-color: transparent;

    text-shadow:
        0 1px 2px rgba(0, 0, 0, 0.5),
        0 0 10px rgba(255, 215, 0, 0.2);

}
</style>