<template>

    <div class="min-h-screen pt-20" :style="fondoStyle">

        <!-- NAVBAR -->
        <RegHeader :titulo="tienda?.data?.value?.negocio?.nombre
            || 'Dashboard'
            " />

        <!-- CONTENIDO -->
        <div class="content-container">

            <DashScreenList :screens="screens" :titulo="tipoDescripcion" />

        </div>

    </div>

</template>
<script setup>
import axios from 'axios'
import { watchEffect, onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import RegHeader from '../reg_principal/components/RegHeader.vue'
import DashScreenList from './components/DashScreenList.vue'

import { useUsuario } from '../../services/usuarioService.js'

// 🔥 IMPORTS CONSISTENTES
import { useMercado } from '../../services/useMercado.js'
import { cssToObject } from '../../services/useCss.js'

import {
    useTienda
} from '../../services/useTienda.js'

/* =========================================
   🔥 SECURITY
========================================= */

import {
    firma
} from '../../services/security.js'

const router = useRouter()

const { usuario } = useUsuario()

const screens = ref([])

let intervalId = null

const tienda = useTienda()

// =========================
// 🔥 FONDO DINÁMICO
// =========================

const { mercado } = useMercado()

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) {
        return {}
    }

    return cssToObject(
        mercado.value.patron_fondo
    )

})

/* =========================================
   FETCH SCREENS
========================================= */

async function fetchScreens() {

    try {

        /* =========================
        🔥 FIRMA
        ========================= */

        const seguridad =
            firma()

        console.log(
            'FIRMA >>>',
            seguridad
        )

        const res = await axios.post(

            '/WAsQ/usuario/screens',

            {

                xin: seguridad.xin,

                yuan: seguridad.yuan,

                usu_id: usuario.value?.user?.usu_id

            }

        )

        if (res.data?.status !== 'ok') {
            return
        }

        const newScreens = res.data.screens || []

        /* =========================================
           EVITAR RE-RENDER
        ========================================= */

        if (

            JSON.stringify(newScreens)

            !==

            JSON.stringify(screens.value)

        ) {

            screens.value = newScreens

            /* =========================================
               🔥 LOCALSTORAGE
            ========================================= */

            const nuevo = {

                ...usuario.value,

                screens: newScreens

            }

            localStorage.setItem(
                'usuario',
                JSON.stringify(nuevo)
            )

        }

    } catch (e) {

        console.error(
            'Error cargando screens',
            e
        )

    }

}

watchEffect(() => {

    console.log(
        'TIENDA >>>',
        tienda
    )

})

// =========================
// INIT
// =========================

onMounted(() => {

    /* =========================================
       VALIDAR LOGIN
    ========================================= */

    if (

        !usuario.value ||

        !usuario.value.user

    ) {

        router.replace('/login')

        return

    }

    /* =========================================
       ⚡ CARGA RÁPIDA
    ========================================= */

    screens.value = usuario.value.screens || []

    /* =========================================
       REFRESH INMEDIATO
    ========================================= */

    fetchScreens()

    /* =========================================
       INTERVAL
    ========================================= */

    const minutos = parseInt(

        import.meta.env
            .VITE_PUBLIC_RQ_POLLING || '5'

    )

    const intervaloMs = minutos * 60 * 1000

    intervalId = setInterval(
        fetchScreens,
        intervaloMs
    )

})

onUnmounted(() => {

    if (intervalId) {

        clearInterval(intervalId)

    }

})

/* =========================================
   TIPO DESCRIPCIÓN
========================================= */

const tipoDescripcion = computed(() => {

    const u = usuario.value?.user

    return (

        u?.tipoxusu_descripcion ||

        u?.tipoxusu?.descripcion ||

        'Tus módulos'

    )

})
</script>


<style scoped>
.content-container {
    width: 100%;
    max-width: 1400px;
    margin: auto;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 40px;
}
</style>