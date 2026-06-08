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

        px-3
        py-3

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

    shrink-0

    flex
    items-center
    justify-center
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

            <!-- RIGHT -->
            <div class="
    flex
    items-center
    gap-2
">

                <!-- LOGIN -->
                <button v-if="!isUsuarioLogeado" @click="irLogin" class="
        gold-btn

        px-4
        py-2

        rounded-full

        text-xs

        font-black

        tracking-wide

        active:scale-95

        transition
    ">

                    Ingresar

                </button>

                <!-- MENU -->


            </div>

        </div>

    </div>
    <AppSnackbar ref="snackbarRef" />
    <ModalMenuUsuario v-model="showMenuUsuario" />
    <LoginSelectorDialog v-model="showLoginSelector" @registrarse="loginFirebase" @pin="
        showPinDialog = true
        " />

    <PinCodeDialog v-model="showPinDialog" />

</template>

<script setup>
import {
    ref,
    computed
}
    from 'vue'

import ModalMenuUsuario
    from '../../../../../components/ModalMenuUsuario.vue'

import {
    useUsuario
}
    from '../../../../../services/usuarioService.js'

import {
    useRouter
}
    from 'vue-router'

import axios
    from 'axios'

import {
    signInWithPopup
}
    from "firebase/auth"

import {
    auth,
    provider
}
    from '../../../../../services/firebase.js'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'
import LoginSelectorDialog
    from './LoginSelectorDialog.vue'

import PinCodeDialog
    from './PinCodeDialog.vue'

/* =========================================
   🔥 DIALOG
========================================= */

const showMenuUsuario =
    ref(false)

const {

    isLogged,

    setLoginData

} = useUsuario()

const isUsuarioLogeado =
    computed(() => {

        return !!isLogged.value

    })

const router =
    useRouter()

const showLoginSelector =
    ref(false)

const showPinDialog =
    ref(false)

const snackbarRef =
    ref(null)

const api =
    axios.create({

        baseURL:
            import.meta.env.VITE_PUBLIC_URL_BASE

    })

function irLogin() {

    showLoginSelector.value =
        true

}

async function loginFirebase() {

    try {

        const result =
            await signInWithPopup(

                auth,
                provider

            )

        const user =
            result.user

        const idToken =
            await user.getIdToken()

        const res =
            await api.post(

                '/coral/crearUsuarioFirebase',

                {

                    token:
                        idToken

                }

            )

        if (

            res.data.status
            ===
            'ok'

        ) {

            setLoginData(
                res.data
            )

            const usu_id =
                res.data?.data?.usu_id

            router.replace(
                `/mod_registro/${usu_id}`
            )

        }

    }
    catch (e) {

        console.error(e)

    }

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

.gold-btn:hover {

    filter:
        brightness(1.06);

    box-shadow:

        0 0 18px rgba(255, 215, 0, 0.65),

        0 0 40px rgba(255, 215, 0, 0.30),

        inset 0 1px 1px rgba(255, 255, 255, 0.55);

}
</style>