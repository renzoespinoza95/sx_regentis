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

                    {{ isEdit ? 'Editar cliente' : 'Nuevo cliente' }}

                </div>

            </div>

            <!-- BODY -->
            <div class="
                    p-5
                    space-y-5
                    max-h-[70vh]
                    overflow-y-auto
                    custom-scroll
                ">

                <!-- NOMBRES -->
                <div>

                    <label class="label-title">

                        Nombres y apellidos

                    </label>

                    <input v-model="form.nombres_apellidos" placeholder="Ej: Juan Pérez" class="input-premium" />

                </div>

                <!-- DNI -->
                <div>

                    <label class="label-title">

                        DNI

                    </label>

                    <input v-model="form.dni" placeholder="Ej: 74859621" class="input-premium" />

                </div>

                <!-- CELULAR + PUESTO -->
                <div class="grid grid-cols-2 gap-4">

                    <!-- CELULAR -->
                    <div>

                        <label class="label-title">

                            Celular

                        </label>

                        <input v-model="form.celular" placeholder="999999999" class="input-premium" />

                    </div>

                    <!-- PUESTO -->
                    <div>

                        <label class="label-title">

                            Puesto

                        </label>

                        <input v-model="form.puesto" placeholder="A-12" class="input-premium" />

                    </div>

                </div>

                <!-- DIRECCION -->
                <div>

                    <label class="label-title">

                        Dirección

                    </label>

                    <textarea v-model="form.direccion" rows="3" placeholder="Dirección del cliente..."
                        class="textarea-premium">

                    </textarea>

                </div>

            </div>

            <!-- FOOTER -->
            <div class="p-5 border-t bg-white">

                <button :disabled="!canSave" class="
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
    " @click="guardar">

                    {{ isEdit ? 'Actualizar ✨' : 'Guardar ✨' }}

                </button>

            </div>

        </div>

    </div>
    <GsapToast ref="toastRef" />

</template>

<script setup>

import {
    ref,
    nextTick,
    computed
}
    from 'vue'

import axios
    from 'axios'
import GsapToast
    from '../../../../../components/layout/GsapToast.vue'
import gsap
    from 'gsap'

import {
    firma
}
    from '../../../../../services/security'

import {
    useUsuario
}
    from '../../../../../services/usuarioService'

import {
    bus
}
    from '../../../../../services/eventBus.js'

const emit =
    defineEmits([
        'created'
    ])

const {
    getNegId
} = useUsuario()

const visible =
    ref(false)

const box =
    ref(null)

const toastRef =
    ref(null)

const isEdit =
    ref(false)

const clienteId =
    ref(null)

const form =
    ref({

        nombres_apellidos:
            '',

        dni:
            '',

        celular:
            '',

        puesto:
            '',

        direccion:
            ''

    })

/* =========================================
🔥 VALID
========================================= */

const canSave =
    computed(() => {

        return String(
            form.value.nombres_apellidos || ''
        ).trim().length > 0

    })

/* =========================================
🔥 OPEN
========================================= */

async function open(cliente = null) {

    bus.emit(
        'bottomnav:toggle',
        true
    )

    isEdit.value =
        !!cliente

    clienteId.value =
        cliente?.cliente_id || null

    form.value = {

        nombres_apellidos:
            cliente?.nombre || '',

        dni:
            cliente?.dni || '',

        celular:
            cliente?.celular || '',

        puesto:
            cliente?.puesto || '',

        direccion:
            cliente?.direccion || ''

    }

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
🔥 GUARDAR
========================================= */

async function guardar() {

    try {

        const seguridad =
            firma()

        /* =========================================
        🔥 EDITAR
        ========================================= */

        if (isEdit.value) {

            const r =
                await axios.post(

                    '/H9I8/editarCliente',

                    {

                        cliente_id:
                            clienteId.value,

                        neg_id:
                            getNegId(),

                        nombres_apellidos:
                            form.value.nombres_apellidos,

                        dni:
                            form.value.dni,

                        celular:
                            form.value.celular,

                        puesto:
                            form.value.puesto,

                        direccion:
                            form.value.direccion,

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
                    'Cliente actualizado correctamente',

                type:
                    'success'

            })

        }

        /* =========================================
        🔥 NUEVO
        ========================================= */

        else {

            await axios.post(

                '/C2kb/crearCliente',

                {

                    nombres_apellidos:
                        form.value.nombres_apellidos,

                    dni:
                        form.value.dni,

                    celular:
                        form.value.celular,

                    puesto:
                        form.value.puesto,

                    direccion:
                        form.value.direccion,

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
                    'Cliente creado correctamente',

                type:
                    'success'

            })

        }

        emit(
            'created'
        )

        setTimeout(() => {

            close()

        }, 500)

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                e?.response?.data?.msg
                ||
                'Error guardando cliente',

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
.custom-scroll::-webkit-scrollbar {

    width: 6px;

}

.custom-scroll::-webkit-scrollbar-thumb {

    background:
        rgba(0, 0, 0, 0.15);

    border-radius:
        999px;

}

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

.textarea-premium {

    width: 100%;

    border-radius: 18px;

    background: #fff4ee;

    border: 2px solid transparent;

    padding: 14px 16px;

    outline: none;

    resize: none;

    transition: .2s;

}

.textarea-premium:focus {

    border-color: #FD7635;

    background: white;

}
</style>
