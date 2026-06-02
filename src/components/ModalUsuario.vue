<template>

    <div v-if="modelValue" class="
            fixed
            inset-0

            bg-black/40

            flex
            items-center
            justify-center

            z-[9999]
        " @click.self="close">

        <div ref="modalRef" class="
                relative
                bg-white
                w-[92%]
                max-w-[460px]
                max-h-[85vh]
                rounded-[24px]
                shadow-2xl
                overflow-hidden
                flex
                flex-col
            ">

            <div class="
                    overflow-y-auto
                    p-6
                ">

                <!-- 🔥 CERRAR -->
                <div class="
                        absolute
                        top-3
                        right-3
                        z-10
                    ">

                    <button @click="close" class="
                            w-8
                            h-8
                            rounded-full
                            bg-red-500
                            text-white
                            shadow-md
                            flex
                            items-center
                            justify-center
                            hover:scale-105
                            active:scale-95
                            transition
                        ">

                        <i class="
                                fa
                                fa-times
                                text-sm
                            "></i>

                    </button>

                </div>

                <!-- HEADER -->
                <div class="
                        text-center
                        mb-4
                    ">

                    <img :src="user?.img_perfil
                        ||
                        'https://picsum.photos/80'
                        " class="
                            w-20
                            h-20
                            rounded-full
                            mx-auto
                            mb-2
                        " />

                    <div class="
                            font-semibold
                            text-lg
                        ">

                        {{ user?.nombres_apellidos }}

                    </div>

                    <div class="
                            text-sm
                            text-gray-500
                        ">

                        {{ user?.email }}

                    </div>

                    <!-- 🔥 BOTÓN PEQUEÑO CERRAR SESIÓN -->
                    <button @click="logout" class="
                            mt-2
                            text-xs
                            bg-red-500
                            text-white
                            px-3
                            py-1
                            rounded-full
                            shadow
                        ">

                        Cerrar sesión

                    </button>

                </div>

                <!-- INFO USUARIO -->
                <div class="
                        text-sm
                        space-y-2
                        mb-4
                    ">

                    <!-- Línea 1 -->
                    <div class="
                            flex
                            justify-between
                        ">

                        <div>

                            <b>Usuario:</b>

                            {{ user?.sobrenombre }}

                        </div>

                        <div>

                            <b>Código:</b>

                            {{ user?.cod_usu }}

                        </div>

                    </div>

                    <!-- Línea 2 -->
                    <div class="
                            flex
                            justify-between
                        ">

                        <div>

                            <b>Rol:</b>

                            {{ user?.rol_nombre }}

                        </div>

                        <div>

                            <b>Tipo Usuario:</b>

                            {{ user?.tipoxusu_descripcion }}

                        </div>

                    </div>

                </div>

                <!-- INFO NEGOCIO -->
                <div class="
                        bg-gray-50
                        rounded-xl
                        p-3
                        mb-4
                    ">

                    <div class="
                            font-semibold
                            mb-2
                        ">

                        Negocio

                    </div>

                    <div class="
                            text-sm
                            space-y-1
                        ">

                        <div>

                            <b>Nombre:</b>

                            {{ user?.negocio_nombre }}

                        </div>

                        <div>

                            <b>Dirección:</b>

                            {{ user?.negocio_direccion }}

                        </div>

                        <div>

                            <b>Ciudad:</b>

                            {{ user?.negocio_ciudad }}

                        </div>

                    </div>

                </div>

                <!-- SCREENS -->
                <div class="
                        mt-4
                    ">

                    <div class="
                            font-semibold
                            mb-2
                        ">

                        Pantallas

                    </div>

                    <div class="
                            flex
                            flex-wrap
                            gap-2
                        ">

                        <span v-for="s in screens" :key="s.screen_id" class="
                                bg-gray-100
                                px-2
                                py-1
                                rounded
                                text-xs
                            ">

                            {{ s.titulo || s.nombre }}

                        </span>

                    </div>

                </div>

                <!-- SUSCRIPCION -->
                <div class="
                        bg-orange-50
                        rounded-xl
                        p-3
                        mt-5
                    ">

                    <div class="
                            font-semibold
                            mb-2
                        ">

                        Suscripción ✨

                    </div>

                    <div class="
                            text-sm
                            space-y-1
                        ">

                        <div>

                            <b>Fecha inicio:</b>

                            {{

                                formatFecha(
                                    user?.fecha_inicio_premium
                                )

                            }}

                        </div>

                        <div>

                            <b>Fecha término:</b>

                            {{

                                formatFecha(
                                    user?.fecha_fin_premium
                                )

                            }}

                            <span v-if="
                                diasRestantes
                                !==
                                null
                            " class="
                                    text-xs
                                    text-green-600
                                    font-semibold
                                    ml-1
                                ">

                                ({{ diasRestantes }} días)

                            </span>

                        </div>

                    </div>

                </div>

                <!-- PIN CODE -->

                <div class="
        mt-5
    ">

                    <button @click="crearPinCode" :disabled="tienePinActivo
                        ||
                        generandoPin
                        " class="
            w-full

            py-3

            rounded-xl

            font-bold

            text-white

            transition
        " :class="tienePinActivo

            ?

            'bg-green-700'

            :

            'bg-green-500 hover:bg-green-600'

            ">

                        {{

                            pinCode

                            ||

                            (

                                generandoPin

                                    ?

                                    'Generando...'

                                    :

                                    'Crear PIN'

                            )

                        }}

                    </button>

                    <div v-if="pinCode" class="
        text-center
        text-sm
        font-bold
        text-red-600
        mt-2
    ">

                        Válido por⏳ {{ tiempoRestanteTexto }}

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    ref,
    watch,
    nextTick,
    computed,
    onUnmounted
}
    from 'vue'

import {
    gsap
}
    from 'gsap'

import {
    useUsuario
}
    from '../services/usuarioService.js'

import {
    bus
}
    from '../services/eventBus.js'
import axios
    from 'axios'

import {
    firma
}
    from '../services/security.js'

/* =========================
   PROPS / EMITS
========================= */

const props = defineProps({

    modelValue:
        Boolean

})

const emit =
    defineEmits([

        'update:modelValue'

    ])

/* =========================
   STATE
========================= */

const modalRef =
    ref(null)

const {
    usuario,
    clearUsuario
} = useUsuario()

const user =
    computed(() =>

        usuario.value?.user
        || null

    )

const tiempoRestante =
    ref(0)

let timerPin =
    null

const screens =
    computed(() =>

        usuario.value?.screens
        || []

    )

const pinCode =
    ref('')

const pinCodeFechaFin =
    ref('')

const generandoPin =
    ref(false)

/* =========================
   ANIMACIÓN
========================= */

watch(

    () => props.modelValue,

    (val) => {

        if (val) {

            bus.emit(

                'bottomnav:toggle',

                true

            )

            nextTick(() => {

                gsap.fromTo(

                    modalRef.value,

                    {

                        scale: 0.7,

                        opacity: 0,

                        y: 30

                    },

                    {

                        scale: 1,

                        opacity: 1,

                        y: 0,

                        duration: 0.28,

                        ease: 'back.out(1.7)'

                    }

                )

            })

        } else {

            bus.emit(

                'bottomnav:toggle',

                false

            )

        }

    }

)

/* =========================
   METHODS
========================= */

const tiempoRestanteTexto =
    computed(() => {

        const total =
            tiempoRestante.value

        const minutos =
            Math.floor(
                total / 60
            )

        const segundos =
            total % 60

        return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`

    })

function iniciarContador() {

    if (

        !pinCodeFechaFin.value

    ) {

        return

    }

    if (

        timerPin

    ) {

        clearInterval(
            timerPin
        )

    }

    timerPin =
        setInterval(() => {

            const ahora =
                new Date()

            const fin =
                new Date(
                    pinCodeFechaFin.value
                )

            const diff =
                Math.floor(

                    (
                        fin.getTime()
                        -
                        ahora.getTime()
                    )

                    / 1000

                )

            tiempoRestante.value =
                Math.max(
                    diff,
                    0
                )

            if (

                diff <= 0

            ) {

                clearInterval(
                    timerPin
                )

                timerPin =
                    null

                pinCode.value =
                    ''

                pinCodeFechaFin.value =
                    ''

                tiempoRestante.value =
                    0

            }

        }, 1000)

}

function close() {

    bus.emit(

        'bottomnav:toggle',

        false

    )

    gsap.to(

        modalRef.value,

        {

            scale: 0.85,

            opacity: 0,

            y: 20,

            duration: 0.2,

            ease: 'power2.in',

            onComplete: () => {

                emit(

                    'update:modelValue',

                    false

                )

            }

        }

    )

}

const tienePinActivo =
    computed(() => {

        return !!pinCode.value

    })

/* =========================
   📅 FECHAS
========================= */

function formatFecha(fecha) {

    if (!fecha) {

        return '—'

    }

    const d =
        new Date(fecha)

    if (isNaN(d.getTime())) {

        return '—'

    }

    const dia =
        String(d.getDate())
            .padStart(2, '0')

    const mes =
        String(d.getMonth() + 1)
            .padStart(2, '0')

    const anio =
        d.getFullYear()

    return `${dia}/${mes}/${anio}`

}

const diasRestantes =
    computed(() => {

        const fechaFin =
            user.value?.fecha_fin_premium

        if (!fechaFin) {

            return null

        }

        const hoy =
            new Date()

        const fin =
            new Date(fechaFin)

        const diff =
            Math.ceil(

                (
                    fin.getTime()
                    -
                    hoy.getTime()
                )

                /

                (
                    1000 * 60 * 60 * 24
                )

            )

        return diff

    })

async function crearPinCode() {

    if (

        generandoPin.value
        ||
        tienePinActivo.value

    ) {

        return

    }

    try {

        generandoPin.value =
            true

        const seguridad =
            firma()

        const r =
            await axios.post(

                `${import.meta.env.VITE_PUBLIC_URL_BASE}/Sp07/crearPinCode`,

                {

                    usu_id:
                        user.value?.usu_id,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        pinCode.value =
            r.data.pin_code || ''

        pinCodeFechaFin.value =
            r.data.pin_code_fecha_fin || ''

        iniciarContador()

    }
    catch (e) {

        console.error(e)

    }
    finally {

        generandoPin.value =
            false

    }

}

function logout() {

    clearUsuario()

    localStorage.removeItem(
        'screens'
    )

    localStorage.removeItem(
        'login_data'
    )

    const mercadoId =
        parseInt(

            import.meta.env
                .VITE_PUBLIC_MERCADO_ID
            || '0'

        )

    if (mercadoId === 0) {

        window.location.href =
            '/'

    } else {

        window.location.href =
            '/principal'

    }

}

onUnmounted(() => {

    if (

        timerPin

    ) {

        clearInterval(
            timerPin
        )

    }

})

</script>