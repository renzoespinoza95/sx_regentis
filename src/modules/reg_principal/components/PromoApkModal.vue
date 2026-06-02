<template>

    <transition name="fade">

        <div v-if="visible" class="
                fixed
                inset-0
                z-[99999]

                flex
                items-center
                justify-center

                overflow-hidden
            ">

            <!-- OVERLAY -->
            <div class="
                absolute
                inset-0

                bg-black/70

                backdrop-blur-md
            ">
            </div>

            <!-- MODAL -->
            <div ref="box" class="
                    relative

                    w-full
                    h-full

                    overflow-hidden

                    flex
                    flex-col

                    items-center
                    justify-center
                " :style="{
                    background:
                        fondo
                }">

                <!-- CIRCULOS -->
                <div class="circle c1"></div>

                <div class="circle c2"></div>

                <div class="circle c3"></div>

                <!-- TEXTO -->
                <div ref="subtituloRef" class="
                        relative
                        z-30
mt-[8vh]
                        px-6

                        text-center

                        leading-tight

                        max-w-[1100px]

                        font-black

                        text-transparent

                        bg-clip-text

                        bg-gradient-to-r
                        from-yellow-200
                        via-white
                        to-yellow-400

                        drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]
                    " style="
                        font-size:
                            clamp(22px, 2.8vw, 58px);
                    ">

                    Tu mercado más moderno, rápido y fácil
                    desde una sola aplicación

                </div>

                <!-- HERO -->
                <div class="
                    relative

                    w-full

                    flex-1

                    flex
                    items-center
                    justify-center

                    overflow-hidden
                ">

                    <!-- IMAGEN -->
                    <img ref="productosRef" src="/01.png" class="
                            relative

                            z-20

                            w-[340px]

                            sm:w-[420px]

                            md:w-[520px]

                            lg:w-[620px]

                            xl:w-[720px]

                            max-h-[100vh]

                            object-contain

                            pointer-events-auto
                            select-none

                            cursor-pointer
                        " @click="goPlay">

                    <!-- PLAY -->
                    <button ref="playRef" class="
                            absolute

                            bottom-[10%]

                            left-1/2

                            -translate-x-1/2

                            z-40

                            transition

                            active:scale-95
                        " @click="goPlay">

                        <img src="/03.png" class="
                                w-[180px]

                                sm:w-[220px]

                                lg:w-[280px]

                                object-contain

                                cursor-pointer

                                drop-shadow-[0_0_45px_rgba(255,255,255,0.35)]
                            ">

                    </button>

                </div>

                <!-- CLOSE -->
                <button class="
                        absolute

                        top-6
                        right-6

                        z-50

                        w-12
                        h-12

                        rounded-full

                        bg-white/15

                        text-white

                        backdrop-blur-md

                        border
                        border-white/20

                        text-xl

                        hover:bg-white/20

                        active:scale-95

                        transition
                    " @click="close">

                    ✕

                </button>

            </div>

        </div>

    </transition>

</template>

<script setup>

import {
    ref,
    computed,
    nextTick
}
    from 'vue'

import gsap
    from 'gsap'
import {
    usePrincipal
}
    from '../../../services/usePrincipal'

const q =
    usePrincipal()

const visible =
    ref(false)

const box =
    ref(null)

const productosRef =
    ref(null)

const phoneRef =
    ref(null)

const playRef =
    ref(null)

const tituloRef =
    ref(null)

const subtituloRef =
    ref(null)

/* =========================================
🔥 DATA
========================================= */

const playstore =
    computed(() => {

        return (

            q.data?.value?.playstore

            ||

            q.data?.value?.data?.playstore

            ||

            'https://play.google.com'

        )

    })

const urlTexto =
    computed(() => {

        try {

            return window.location.host

        } catch {

            return 'www.huamantanga.lat'

        }

    })

/* =========================================
🔥 FONDO
========================================= */

const fondo = `
linear-gradient(
    180deg,
    #ff5a00 0%,
    #ff4b00 30%,
    #ff6a00 100%
)
`

/* =========================================
🔥 OPEN
========================================= */

async function open() {

    visible.value = true

    await nextTick()

    runAnimations()

}

/* =========================================
🔥 CLOSE
========================================= */

function close() {

    gsap.to(

        box.value,

        {

            opacity: 0,

            scale: 0.92,

            duration: 0.35,

            ease: 'power3.in',

            onComplete: () => {

                visible.value = false

            }

        }

    )

}

/* =========================================
🔥 PLAYSTORE
========================================= */

function goPlay() {

    // Sin acción

}

/* =========================================
🔥 ANIMACIONES
========================================= */
/* =========================================
🔥 ANIMACIONES
========================================= */

function runAnimations() {

    gsap.set(

        [

            productosRef.value,
            playRef.value,
            subtituloRef.value

        ],

        {

            opacity: 0

        }

    )

    /* =========================================
       🔥 PRODUCTOS
    ========================================= */

    gsap.fromTo(

        productosRef.value,

        {

            scale: 0.82,

            opacity: 0,

            y: 120

        },

        {

            scale: 1,

            opacity: 1,

            y: 0,

            duration: 1.4,

            ease: 'power4.out'

        }

    )

    /* =========================================
       🔥 SUBTITULO
    ========================================= */

    gsap.fromTo(

        subtituloRef.value,

        {

            scale: 0.7,

            opacity: 0,

            y: -60

        },

        {

            scale: 1,

            opacity: 1,

            y: 0,

            duration: 1,

            delay: 0.5,

            ease: 'back.out(2.2)'

        }

    )

    /* =========================================
       ✨ BRILLO DORADO
    ========================================= */

    gsap.to(

        subtituloRef.value,

        {

            backgroundPosition:
                '200% center',

            duration: 2.8,

            repeat: -1,

            ease: 'none'

        }

    )

    /* =========================================
       🔥 PLAYSTORE
    ========================================= */

    gsap.fromTo(

        playRef.value,

        {

            x: -700,

            opacity: 0,

            rotate: -8,

            scale: 0.85

        },

        {

            x: 0,

            opacity: 1,

            rotate: 0,

            scale: 1,

            duration: 1.3,

            delay: 0.9,

            ease: 'power4.out'

        }

    )

    /* =========================================
       🔥 LEVITAR IMAGEN
    ========================================= */

    gsap.to(

        productosRef.value,

        {

            y: '-=28',

            duration: 3.2,

            repeat: -1,

            yoyo: true,

            ease: 'sine.inOut'

        }

    )

    /* =========================================
       🔥 RESPIRAR PLAYSTORE
    ========================================= */
    /*
        gsap.to(
    
            playRef.value,
    
            {
    
                scale: 1.05,
    
                duration: 1.4,
    
                repeat: -1,
    
                yoyo: true,
    
                ease: 'sine.inOut'
    
            }
    
        )
            */

}


/* =========================================
🔥 EXPOSE
========================================= */

defineExpose({

    open,
    close

})

</script>

<style scoped>
.circle {

    position: absolute;

    border-radius: 999px;

    filter: blur(10px);

    opacity: 0.18;

}

.c1 {

    width: 700px;
    height: 700px;

    background: #ff9800;

    top: -180px;
    left: -180px;

}

.c2 {

    width: 900px;
    height: 900px;

    background: #ff6a00;

    bottom: -320px;
    right: -320px;

}

.c3 {

    width: 450px;
    height: 450px;

    background: #ffd54f;

    top: 50%;
    left: 50%;

    transform:
        translate(-50%, -50%);

}

.fade-enter-active,
.fade-leave-active {

    transition:
        opacity 0.35s ease;

}

.fade-enter-from,
.fade-leave-to {

    opacity: 0;

}
</style>
