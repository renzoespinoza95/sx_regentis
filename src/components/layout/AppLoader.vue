<template>

    <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[99999]">

        <div class="bg-white rounded-3xl shadow-2xl px-8 py-7 flex flex-col items-center gap-5">

            <!-- 🔥 LOADER -->
            <div class="loader"></div>

            <!-- TEXTO -->
            <div class="text-sm font-semibold text-gray-600 text-center">

                {{ text }}

            </div>

        </div>

    </div>

</template>

<script setup>
import {
    watch
}
    from 'vue'

import {
    bus
}
    from '../../services/eventBus.js'

const props = defineProps({

    show: Boolean,

    text: {

        type: String,

        default: 'Procesando...'

    }

})

/* =========================================
   🔥 TOGGLE BOTTOMNAV
========================================= */

watch(

    () => props.show,

    (v) => {

        bus.emit(

            'bottomnav:toggle',

            !!v

        )

    },

    {

        immediate: true

    }

)

</script>

<style scoped>
/* =========================================
   🔥 LOADER PREMIUM
========================================= */

.loader {

    width: 40px;
    height: 40px;

    position: relative;

    color: #FD7635;

    background:

        conic-gradient(from -45deg at top 20px left 50%,
            transparent,
            #FD7635 1deg 90deg,
            transparent 91deg),

        conic-gradient(from 45deg at right 20px top 50%,
            transparent,
            #FD7635 1deg 90deg,
            transparent 91deg),

        conic-gradient(from 135deg at bottom 20px left 50%,
            transparent,
            #FD7635 1deg 90deg,
            transparent 91deg),

        conic-gradient(from -135deg at left 20px top 50%,
            transparent,
            #FD7635 1deg 90deg,
            transparent 91deg);

    animation:
        l4 1.5s infinite cubic-bezier(0.3, 1, 0, 1);

}

/* =========================================
   🔥 ANIMATION
========================================= */

@keyframes l4 {

    50% {

        width: 60px;
        height: 60px;

        transform:
            rotate(180deg);

    }

    100% {

        transform:
            rotate(360deg);

    }

}
</style>