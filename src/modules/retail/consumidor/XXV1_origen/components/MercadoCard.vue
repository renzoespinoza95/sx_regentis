<template>

    <div class="
        mercado-card

        h-[250px]

        rounded-2xl

        overflow-hidden

        flex
        flex-col

        border
        border-yellow-500/20

        hover:scale-[1.02]

        transition
    ">

        <!-- IMG -->
        <div class="
    relative

    h-28

    flex
    items-center
    justify-center

    p-4
">

            <!-- FONDO PREMIUM -->
            <div class="
        absolute
        inset-0
    " style="
        background-color: #d8c78d;

        background-image:

            radial-gradient(circle at center center,
                rgba(120, 90, 20, 0.10) 2px,
                transparent 2px),

            repeating-linear-gradient(45deg,
                rgba(120, 90, 20, 0.08) 0px,
                rgba(120, 90, 20, 0.08) 2px,
                transparent 2px,
                transparent 12px),

            repeating-linear-gradient(-45deg,
                rgba(255, 255, 255, 0.18) 0px,
                rgba(255, 255, 255, 0.18) 2px,
                transparent 2px,
                transparent 12px),

            linear-gradient(180deg,
                #efe2b2 0%,
                #d8c78d 45%,
                #c7b16f 100%);
    ">

            </div>

            <!-- LOGO -->
            <img :src="mercado.logo
                ||
                'https://barsi-img.b-cdn.net/recursos/sg3f.png'
                " class="
            relative
            z-10

            w-full
            h-full

            object-contain

            drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)]
        " />

        </div>

        <!-- BODY -->
        <div class="p-1 flex-1">

            <!-- TITULO -->
            <div class="
    text-sm
    font-black

    text-white

    tracking-wide

    leading-tight

    min-h-[38px]

    overflow-hidden

    text-ellipsis

    line-clamp-2

    break-words
">

                {{ mercado.nombre }}

            </div>

            <!-- DIRECCION -->
            <div class="
    text-xs

    text-white/80

    mt-2

    leading-tight

    min-h-[20px]

    overflow-hidden

    text-ellipsis

    line-clamp-2

    break-words
">

                📍 {{ mercado.ciudad }}

            </div>

            <!-- UBICACION -->
            <div class="
                text-xs

                text-white/60

                mt-1
            ">
                {{ mercado.departamento }}

            </div>

        </div>

        <!-- BTN -->
        <div class="p-3 pt-0">

            <button class="
                    gold-btn

                    w-full

                    py-2

                    rounded-xl

                    text-sm

                    font-black

                    tracking-wide

                    active:scale-95

                    transition
                " @click="entrarMercado">

                Entrar

            </button>

        </div>

    </div>

</template>

<script setup>

import {
    useRouter
}
    from 'vue-router'

import {
    setMercadoId
}
    from '../../../../../services/usePrincipal.js'

const router =
    useRouter()

const props =
    defineProps({

        mercado: Object

    })

/* =========================================
   🔥 ENTRAR MERCADO
========================================= */

function entrarMercado() {

    /* =========================================
       🔥 GUARDAR MERCADO_ID
    ========================================= */

    setMercadoId(

        props.mercado.mercado_id

    )

    console.log(

        '🏪 mercado_id guardado =>',

        props.mercado.mercado_id

    )

    /* =========================================
       🔥 LIMPIAR CACHE
    ========================================= */

    localStorage.removeItem(
        'regentis_principal_cache'
    )

    /* =========================================
       🔥 IR PRINCIPAL
    ========================================= */

    router.push(
        '/principal'
    )

}

</script>
<style scoped>
/* =========================================
   🔥 CARD
========================================= */

.mercado-card {

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

        0 10px 30px rgba(0, 0, 0, 0.35),

        0 0 20px rgba(255, 215, 0, 0.06);

}

/* =========================================
   ✨ BOTON DORADO
========================================= */

.gold-btn {

    color: #000000;

    font-weight: 900;

    background-color: #d8c78d;

    background-image:

        radial-gradient(circle at center center,
            rgba(120, 90, 20, 0.10) 2px,
            transparent 2px),

        repeating-linear-gradient(45deg,
            rgba(120, 90, 20, 0.08) 0px,
            rgba(120, 90, 20, 0.08) 2px,
            transparent 2px,
            transparent 12px),

        repeating-linear-gradient(-45deg,
            rgba(255, 255, 255, 0.18) 0px,
            rgba(255, 255, 255, 0.18) 2px,
            transparent 2px,
            transparent 12px),

        linear-gradient(180deg,
            #efe2b2 0%,
            #d8c78d 45%,
            #c7b16f 100%);

    background-size:
        20px 20px,
        24px 24px,
        24px 24px,
        100% 100%;

    border:
        1px solid rgba(120, 90, 20, 0.18);

    box-shadow:

        inset 0 1px 0 rgba(255, 255, 255, 0.45),

        0 0 10px rgba(255, 215, 0, 0.15),

        0 4px 14px rgba(0, 0, 0, 0.18);

    text-shadow:

        0 1px 0 rgba(255, 255, 255, 0.45);

}

/* =========================================
   ✨ HOVER
========================================= */

.gold-btn:hover {

    filter:
        brightness(1.06);

    box-shadow:

        0 0 18px rgba(255, 215, 0, 0.65),

        0 0 40px rgba(255, 215, 0, 0.30),

        inset 0 1px 1px rgba(255, 255, 255, 0.55);

}
</style>