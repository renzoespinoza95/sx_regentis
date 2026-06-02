<template>

    <div v-if="visible" class="
            fixed
            inset-0
            z-[999]
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
        ">

        <div ref="box" class="
                relative
                bg-white
                rounded-[32px]
                w-full
                max-w-md
                overflow-hidden
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            ">

            <!-- HEADER -->
            <div class="
                    relative
                    px-5
                    pt-5
                    pb-4
                    text-white
                " style="
                    background:
                    linear-gradient(
                        135deg,
                        #FD7635 0%,
                        #ff995e 100%
                    );
                ">

                <button class="
                        absolute
                        top-4
                        right-4
                        w-10
                        h-10
                        rounded-full
                        bg-white/20
                        backdrop-blur
                        text-white
                        flex
                        items-center
                        justify-center
                        active:scale-95
                        transition
                    " @click="close">

                    <i class="fa fa-times"></i>

                </button>

                <div class="text-2xl font-black">

                    Nuevo trabajador

                </div>

            </div>

            <!-- BODY -->
            <div class="p-5">

                <label class="label-title">

                    Nombres y Apellidos

                </label>

                <input v-model="nombresApellidos" class="input-premium" placeholder="Ej: Juan Perez">

                <button @click="guardar" :disabled="loading
                    ||
                    !nombresApellidos.trim()
                    " class="
                        mt-5
                        w-full
                        h-[56px]
                        rounded-2xl
                        text-white
                        font-bold
                        text-lg
                        shadow-[0_10px_25px_rgba(253,118,53,0.35)]
                        active:scale-[0.98]
                        transition
                        disabled:opacity-40
                    " style="
                        background:
                        linear-gradient(
                            135deg,
                            #FD7635 0%,
                            #ff995e 100%
                        );
                    ">

                    {{

                        loading

                            ?

                            'Guardando...'

                            :

                            'Guardar'

                    }}

                </button>

            </div>

        </div>

    </div>

    <AppSnackbar ref="snackbarRef" />

</template>

<script setup>

import {
    ref,
    nextTick
}
    from 'vue'

import axios
    from 'axios'

import gsap
    from 'gsap'

import {
    firma
}
    from '../../../../../services/security'

import {
    bus
}
    from '../../../../../services/eventBus.js'

import {
    useUsuario
}
    from '../../../../../services/usuarioService.js'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'

const visible =
    ref(false)

const box =
    ref(null)

const snackbarRef =
    ref(null)

const nombresApellidos =
    ref('')

const loading =
    ref(false)

const emit =
    defineEmits([

        'created'

    ])

const {
    getNegId
}
    =
    useUsuario()

async function open() {

    bus.emit(
        'bottomnav:toggle',
        true
    )

    nombresApellidos.value =
        ''

    visible.value =
        true

    await nextTick()

    gsap.fromTo(

        box.value,

        {
            scale: 0.7,
            opacity: 0
        },

        {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        }

    )

}

function close() {

    gsap.to(

        box.value,

        {

            scale: 0.7,

            opacity: 0,

            duration: 0.2,

            onComplete: () => {

                visible.value =
                    false

                bus.emit(
                    'bottomnav:toggle',
                    false
                )

            }

        }

    )

}

async function guardar() {

    try {

        loading.value =
            true

        const seguridad =
            firma()

        const r =
            await axios.post(

                '/Vke6/crearTrabajadorDelivery',

                {

                    nombres_apellidos:
                        nombresApellidos.value,

                    neg_id:
                        getNegId(),

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (

            r.data.status
            !==
            'ok'

        ) {

            throw new Error(
                'Error'
            )

        }

        snackbarRef.value?.open(

            `✅ Trabajador creado

PIN: ${r.data.data.pin_code}

Válido por 4 minutos`

        )

        emit(
            'created'
        )

        setTimeout(() => {

            close()

        }, 800)

    }
    catch (e) {

        snackbarRef.value?.open(

            e?.response?.data?.msg
            ||
            'Error creando trabajador'

        )

    }
    finally {

        loading.value =
            false

    }

}

defineExpose({

    open

})

</script>

<style scoped>
.label-title {

    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 10px;
    display: block;

}

.input-premium {

    width: 100%;
    height: 54px;
    border-radius: 18px;
    background: #fff4ee;
    border: 2px solid transparent;
    padding: 0 16px;
    outline: none;
    transition: .2s;

}

.input-premium:focus {

    border-color: #FD7635;
    background: white;

}
</style>
