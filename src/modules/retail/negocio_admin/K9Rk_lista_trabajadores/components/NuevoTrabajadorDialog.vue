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

                <!-- CLOSE -->
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

                <!-- TITLE -->
                <div class="text-2xl font-black">

                    Buscar trabajador

                </div>

            </div>

            <!-- BODY -->
            <div class="p-5 space-y-5">

                <!-- SEARCH -->
                <div>

                    <label class="label-title">

                        Buscar código

                    </label>

                    <div class="flex items-center gap-2">

                        <!-- INPUT -->
                        <input v-model="codUsu" placeholder="Ej: RGX2025" class="input-premium flex-1" />

                        <!-- CLEAR -->
                        <button v-if="codUsu" @click="limpiar" class="
                                w-12
                                h-12
                                rounded-full
                                bg-red-100
                                text-red-500
                                flex
                                items-center
                                justify-center
                                active:scale-95
                                transition
                            ">

                            <i class="fa fa-times"></i>

                        </button>

                        <!-- SEARCH -->
                        <button @click="buscar" class="
                                w-12
                                h-12
                                rounded-full
                                bg-[#FD7635]
                                text-white
                                flex
                                items-center
                                justify-center
                                shadow-lg
                                active:scale-95
                                transition
                            ">

                            <i class="fa fa-search"></i>

                        </button>

                    </div>

                </div>

                <!-- RESULT -->
                <div v-if="usuario" class="
                        bg-[#fff4ee]
                        rounded-3xl
                        p-4
                        border
                        border-orange-100
                    ">

                    <div class="flex items-center gap-3">

                        <!-- FOTO -->
                        <img :src="usuario.img_perfil || 'https://picsum.photos/100'" class="
                                w-16
                                h-16
                                rounded-2xl
                                object-cover
                            " />

                        <!-- INFO -->
                        <div class="flex-1 min-w-0">

                            <!-- NOMBRE -->
                            <div class="font-bold text-gray-800">

                                {{
                                    usuario.nombres_apellidos
                                    ||
                                    usuario.sobrenombre
                                }}

                            </div>

                            <!-- CODIGO -->
                            <div class="text-sm text-gray-500 mt-1">

                                Código:
                                {{ usuario.cod_usu }}

                            </div>

                            <!-- CEL -->
                            <div class="text-sm text-gray-500 mt-1">

                                Cel:
                                {{ usuario.celular || '—' }}

                            </div>

                            <!-- NEG -->
                            <div class="text-sm text-gray-500 mt-1">

                                {{
                                    usuario.negocio_nombre
                                    || '—'
                                }}

                            </div>

                        </div>

                    </div>

                </div>

                <!-- FOOTER -->
                <div class="pt-2">

                    <button :disabled="!usuario || loadingContratar" @click="contratar" class="
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
            disabled:shadow-none
            disabled:cursor-not-allowed
        " style="
            background:
            linear-gradient(
                135deg,
                #FD7635 0%,
                #ff995e 100%
            );
        ">

                        <template v-if="loadingContratar">

                            Contratando...

                        </template>

                        <template v-else>

                            🤝 Contratar

                        </template>

                    </button>

                </div>

                <!-- ERROR -->
                <div v-if="errorMsg" class="
                        bg-red-50
                        border
                        border-red-200
                        text-red-500
                        text-sm
                        rounded-2xl
                        px-4
                        py-3
                    ">

                    {{ errorMsg }}

                </div>

            </div>

        </div>

    </div>

    <GsapToast ref="toastRef" />

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

import GsapToast
    from '../../../../../components/layout/GsapToast.vue'
import {
    useUsuario
}
    from '../../../../../services/usuarioService.js'

const visible =
    ref(false)

const box =
    ref(null)

const codUsu =
    ref('')

const usuario =
    ref(null)

const errorMsg =
    ref('')

const toastRef =
    ref(null)

const {
    getNegId
} = useUsuario()

const loadingContratar =
    ref(false)

const emit =
    defineEmits([
        'created'
    ])

/* =========================================
🔥 OPEN
========================================= */

async function open() {

    bus.emit(
        'bottomnav:toggle',
        true
    )

    codUsu.value = ''

    usuario.value = null

    errorMsg.value = ''

    visible.value = true

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

/* =========================================
🔥 CLOSE
========================================= */

function close() {

    gsap.to(

        box.value,

        {

            scale: 0.7,

            opacity: 0,

            duration: 0.2,

            onComplete: () => {

                visible.value = false

                bus.emit(
                    'bottomnav:toggle',
                    false
                )

            }

        }

    )

}

/* =========================================
🔥 CONTRATAR
========================================= */

async function contratar() {

    try {

        if (!usuario.value?.usu_id) {

            return

        }

        loadingContratar.value = true

        const seguridad =
            firma()

        const r =
            await axios.post(

                '/Ko3d/agregarTrabajador',

                {

                    usu_id:
                        usuario.value.usu_id,

                    neg_id:
                        getNegId(),

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        toastRef.value?.show({

            text:
                r.data?.msg
                ||
                'Trabajador agregado correctamente',

            type:
                'success'

        })

        emit(
            'created'
        )

        setTimeout(() => {

            close()

        }, 700)

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                e?.response?.data?.msg
                ||
                'Error contratando trabajador',

            type:
                'error'

        })

    } finally {

        loadingContratar.value = false

    }

}

/* =========================================
🔥 LIMPIAR
========================================= */

function limpiar() {

    codUsu.value = ''

    usuario.value = null

    errorMsg.value = ''

}

/* =========================================
🔥 BUSCAR
========================================= */

async function buscar() {

    try {

        usuario.value = null

        errorMsg.value = ''

        const seguridad =
            firma()

        const r =
            await axios.post(

                '/GbaX/buscarCodigo',

                {

                    cod_usu:
                        codUsu.value,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (r.data.ok) {

            usuario.value =
                r.data.usuario

            toastRef.value?.show({

                text:
                    'Usuario encontrado ✨',

                type:
                    'success'

            })

        }

    } catch (e) {

        console.error(e)

        errorMsg.value =

            e?.response?.data?.msg
            ||
            'No encontrado'

        toastRef.value?.show({

            text:
                errorMsg.value,

            type:
                'error'

        })

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
