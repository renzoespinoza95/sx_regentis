<template>

    <transition name="fade">

        <div v-if="modelValue" class="
                fixed
                inset-0
                bg-black/40
                flex
                items-center
                justify-center
                z-[9999]
            " @click.self="cerrar">

            <div class="
                    bg-white
                    rounded-[24px]
                    p-5
                    w-[92%]
                    max-w-[380px]
                ">

                <div class="
                        text-center
                        font-bold
                        text-lg
                        mb-4
                    ">

                    🔑 Código PIN

                </div>

                <input v-model="pinCode" maxlength="6" placeholder="Ingrese PIN" class="
                        w-full
                        border
                        rounded-xl
                        p-3
                        text-center
                        text-xl
                        mb-4
                    ">

                <button @click="ingresar" :disabled="loading" class="
                        w-full
                        bg-[#FD7635]
                        text-white
                        py-3
                        rounded-xl
                        font-bold
                    ">

                    {{ loading ? 'Procesando...' : 'Ingresar' }}

                </button>

            </div>

        </div>

    </transition>
    <AppSnackbar ref="snackbarRef" />

</template>

<script setup>

import {
    ref
}
    from 'vue'

import axios
    from 'axios'

import {
    useRouter
}
    from 'vue-router'

import {
    useUsuario
}
    from '../../../../../services/usuarioService.js'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'


const props =
    defineProps({

        modelValue: Boolean

    })

const emit =
    defineEmits([

        'update:modelValue'

    ])

const router =
    useRouter()

const {
    setLoginData
}
    =
    useUsuario()

const pinCode =
    ref('')

const loading =
    ref(false)

const snackbarRef =
    ref(null)

function cerrar() {

    emit(
        'update:modelValue',
        false
    )

}

async function ingresar() {

    try {

        if (

            !pinCode.value

        ) {

            snackbarRef.value?.open(

                'Debe ingresar un PIN'

            )

            return

        }

        loading.value =
            true

        const r =
            await axios.post(

                `${import.meta.env.VITE_PUBLIC_URL_BASE}/K5jX/ingresarConPinCode`,

                {

                    pin_code:
                        pinCode.value

                }

            )

        if (

            r.data.status
            !==
            'ok'

        ) {

            snackbarRef.value?.open(

                r.data.msg
                ||
                'PIN inválido'

            )

            return

        }

        setLoginData(
            r.data
        )

        cerrar()

        router.replace(
            '/principal'
        )

    }

    catch (e) {

        console.error(e)

        snackbarRef.value?.open(

            e?.response?.data?.msg

            ||

            'PIN inválido o expirado'

        )

    }

    finally {

        loading.value =
            false

    }

}

</script>
