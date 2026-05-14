<template>

    <div class="flex flex-col items-center justify-center py-20 px-6 text-center">

        <div class="letter-wrapper">

            <div class="letter-image auto-open">

                <div class="animated-mail">

                    <div class="back-fold"></div>

                    <div class="letter">

                        <div class="letter-border"></div>

                        <!-- MENSAJE -->
                        <div class="mensaje-box">

                            <div class="titulo">
                                {{ titulo }}
                            </div>

                            <div class="texto">
                                {{ texto }}
                            </div>

                        </div>

                    </div>

                    <div class="top-fold"></div>

                    <div class="body"></div>

                    <div class="left-fold"></div>

                </div>

                <div class="shadow"></div>

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({

    titulo: {
        type: String,
        default: 'No hay pedidos'
    },

    texto: {
        type: String,
        default: 'Cuando lleguen nuevos pedidos aparecerán aquí 😏'
    }

})

</script>

<style scoped>
.letter-wrapper {

    position: relative;

    width: 100%;

    height: 340px;

    display: flex;

    justify-content: center;

    align-items: center;

}

/* =========================================
   ✉️ CARTA
========================================= */

.letter-image {

    position: relative;

    width: 200px;

    height: 200px;

}

/* =========================================
   ✉️ ANIMATED MAIL
========================================= */

.animated-mail {

    position: absolute;

    height: 150px;

    width: 200px;

    transition: .4s;

    animation:
        floatMail 3s ease-in-out infinite;

}

/* =========================================
   ✉️ BODY
========================================= */

.body {

    position: absolute;

    bottom: 0;

    width: 0;

    height: 0;

    border-style: solid;

    border-width: 0 0 100px 200px;

    border-color:
        transparent transparent #e95f55 transparent;

    z-index: 2;

}

/* =========================================
   ✉️ TOP
========================================= */

.top-fold {

    position: absolute;

    top: 50px;

    width: 0;

    height: 0;

    border-style: solid;

    border-width: 50px 100px 0 100px;

    transform-origin: 50% 0%;

    border-color:
        #cf4a43 transparent transparent transparent;

    z-index: 2;

    animation:
        openFold 5s infinite;

}

/* =========================================
   ✉️ BACK
========================================= */

.back-fold {

    position: absolute;

    bottom: 0;

    width: 200px;

    height: 100px;

    background: #cf4a43;

    z-index: 0;

}

/* =========================================
   ✉️ LEFT
========================================= */

.left-fold {

    position: absolute;

    bottom: 0;

    width: 0;

    height: 0;

    border-style: solid;

    border-width: 50px 0 50px 100px;

    border-color:
        transparent transparent transparent #e15349;

    z-index: 2;

}

/* =========================================
   ✉️ LETTER
========================================= */

.letter {

    left: 20px;

    bottom: 0;

    position: absolute;

    width: 160px;

    height: 60px;

    background: white;

    z-index: 1;

    overflow: hidden;

    border-radius: 10px;

    transition: .4s .2s;

    animation:
        openLetter 5s infinite;

}

/* =========================================
   ✉️ BORDER
========================================= */

.letter-border {

    height: 10px;

    width: 100%;

    background:
        repeating-linear-gradient(-45deg,

            #cb5a5e,
            #cb5a5e 8px,

            transparent 8px,
            transparent 18px);

}

/* =========================================
   💌 MENSAJE
========================================= */

.mensaje-box {

    padding: 14px;

    display: flex;

    flex-direction: column;

    align-items: center;

    text-align: center;

}

.titulo {

    font-size: 14px;

    font-weight: 700;

    color: #374151;

}

.texto {

    margin-top: 8px;

    font-size: 11px;

    line-height: 1.4;

    color: #6b7280;

}

/* =========================================
   🌑 SHADOW
========================================= */

.shadow {

    position: absolute;

    top: 200px;

    left: 50%;

    width: 220px;

    height: 30px;

    transform: translateX(-50%);

    border-radius: 100%;

    background:
        radial-gradient(rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0));

    animation:
        shadowMove 3s ease-in-out infinite;

}

/* =========================================
   ✨ FLOAT
========================================= */

@keyframes floatMail {

    0%,
    100% {

        transform:
            translateY(0px);

    }

    50% {

        transform:
            translateY(10px);

    }

}

/* =========================================
   ✨ OPEN LETTER
========================================= */

@keyframes openLetter {

    0%,
    20% {

        height: 60px;

    }

    30%,
    70% {

        height: 180px;

    }

    100% {

        height: 60px;

    }

}

/* =========================================
   ✨ OPEN FOLD
========================================= */

@keyframes openFold {

    0%,
    20% {

        transform:
            rotateX(0deg);

        z-index: 2;

    }

    30%,
    70% {

        transform:
            rotateX(180deg);

        z-index: 0;

    }

    100% {

        transform:
            rotateX(0deg);

        z-index: 2;

    }

}

/* =========================================
   ✨ SHADOW MOVE
========================================= */

@keyframes shadowMove {

    0%,
    100% {

        transform:
            translateX(-50%) scale(1);

    }

    50% {

        transform:
            translateX(-50%) scale(0.9);

    }

}
</style>
