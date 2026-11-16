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

            <div ref="modalRef" class="menu-modal-box">

                <button @click="registrarse" class="menu-item-btn">

                    📝 Registrarse

                </button>

                <button @click="codigoPin" class="menu-item-btn">

                    🔑 Código PIN

                </button>

                <button @click="quieroTienda" class="menu-item-btn">

                    🏪 Quiero una tienda virtual

                </button>

                <button @click="cerrar" class="menu-cancel-btn">

                    Cancelar

                </button>

            </div>

        </div>

    </transition>

</template>

<script setup>

import {
    ref,
    nextTick,
    watch
}
    from 'vue'

import {
    gsap
}
    from 'gsap'

import {
    useRouter
}
    from 'vue-router'

const props =
    defineProps({

        modelValue: Boolean

    })

const emit =
    defineEmits([

        'update:modelValue',

        'registrarse',

        'pin'

    ])

const modalRef =
    ref(null)

const router =
    useRouter()

watch(

    () => props.modelValue,

    (v) => {

        if (!v) return

        nextTick(() => {

            gsap.fromTo(

                modalRef.value,

                {
                    scale: .7,
                    opacity: 0,
                    y: 30
                },

                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: .25
                }

            )

        })

    }

)

function quieroTienda() {

    cerrar()

    router.push(

        '/'

    )

}

function cerrar() {

    emit(
        'update:modelValue',
        false
    )

}

function registrarse() {

    cerrar()

    emit(
        'registrarse'
    )

}

function codigoPin() {

    cerrar()

    emit(
        'pin'
    )

}

</script>

<style scoped>
.menu-modal-box {

    width: 320px;
    background: white;
    border-radius: 24px;
    padding: 20px;

}

.menu-item-btn {

    width: 100%;
    height: 50px;

    border-radius: 18px;

    background: #f7f7f7;

    color: #111827;

    margin-bottom: 10px;

    font-weight: 700;

}

.menu-cancel-btn {

    width: 100%;
    height: 50px;
    border-radius: 18px;
    background: #ef4444;
    color: white;
    font-weight: 700;

}
</style>
