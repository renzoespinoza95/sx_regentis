<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
        @click.self="close">

        <div ref="box" class="relative bg-white w-[90%] max-w-sm rounded-2xl shadow-2xl p-5">

            <!-- ❌ -->
            <div class="absolute top-3 right-3">

                <button @click="close"
                    class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition">

                    <i class="fa fa-times"></i>

                </button>

            </div>

            <!-- TITLE -->
            <div class="text-lg font-semibold mb-4">

                Nuevo cliente

            </div>

            <!-- INPUT -->
            <input v-model="nombres" type="text" placeholder="Nombres y apellidos"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none" />

            <!-- BTN -->
            <button @click="guardar" :disabled="loading"
                class="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition disabled:opacity-50">

                <template v-if="loading">

                    Creando...

                </template>

                <template v-else>

                    Crear cliente

                </template>

            </button>

        </div>

    </div>

    <!-- 🔥 TOAST -->
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
import GsapToast
    from '../../../../../components/layout/GsapToast.vue'

import {
    useUsuario
}
    from '../../../../../services/usuarioService'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const visible =
    ref(false)

const box =
    ref(null)

const nombres =
    ref('')

const loading =
    ref(false)

const toastRef =
    ref(null)

const emit =
    defineEmits([

        'created'

    ])

const {
    getNegId
} = useUsuario()

/* ======================================
   🔥 OPEN
====================================== */

function open() {

    visible.value = true

    nextTick(() => {

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

    })

}

/* ======================================
   🔥 CLOSE
====================================== */

function close() {

    gsap.to(

        box.value,

        {

            scale: 0.7,

            opacity: 0,

            duration: 0.2,

            onComplete: () => {

                visible.value = false

            }

        }

    )

}

/* ======================================
   💾 GUARDAR
====================================== */

async function guardar() {

    try {

        if (
            !nombres.value.trim()
        ) {

            toastRef.value.show({

                text:
                    'Ingrese nombres',

                type:
                    'error'

            })

            return

        }

        loading.value = true

        /* ======================================
           🔐 FIRMA
        ====================================== */

        const seguridad =
            firma()

        /* ======================================
           🚀 REQUEST
        ====================================== */

        const r =
            await axios.post(

                `${API}/C2kb/crearCliente`,

                {

                    neg_id:
                        getNegId(),

                    nombres_apellidos:
                        nombres.value,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        /* ======================================
           ✅ OK
        ====================================== */

        if (
            r.data.status === 'ok'
        ) {

            toastRef.value.show({

                text:
                    'Cliente creado',

                type:
                    'success'

            })

            emit(

                'created',

                {

                    cliente_id:
                        r.data.cliente_id,

                    nombres_apellidos:
                        nombres.value

                }

            )

            nombres.value = ''

            setTimeout(() => {

                close()

            }, 700)

        }

    } catch (e) {

        console.error(e)

        toastRef.value.show({

            text:
                e?.response?.data?.msg
                ||
                'Error creando cliente',

            type:
                'error'

        })

    } finally {

        loading.value = false

    }

}

defineExpose({

    open

})

</script>
