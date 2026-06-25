<template>

    <div class="mt-6">

        <!-- NOMBRE -->
        <div class="mb-4">

            <div class="
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                ">

                Nombre del negocio

            </div>

            <input v-model="form.nombre
                " class="
                    w-full
                    h-14

                    rounded-2xl

                    border

                    px-4

                    outline-none

                    bg-gray-50
                " placeholder="
                    Mi negocio
                " />

        </div>

        <!-- CELULAR -->
        <div class="mb-4">

            <div class="
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                ">

                Celular informes

            </div>

            <input v-model="form.celular_informes
                " class="
                    w-full
                    h-14

                    rounded-2xl

                    border

                    px-4

                    outline-none

                    bg-gray-50
                " placeholder="
                    999888777
                " />

        </div>

        <!-- URL AMIGABLE -->
        <div class="mb-6">

            <div class="
        text-sm
        font-semibold
        text-gray-700
        mb-2
    ">

                Dirección para compartir

            </div>

            <div class="
        rounded-3xl

        bg-gradient-to-r
        from-cyan-50
        to-emerald-50

        border-2
        border-cyan-200

        p-4
    ">

                <div class="
            text-xs
            text-gray-500
            mb-2
        ">

                    URL pública de tu negocio

                </div>

                <div class="
            flex
            items-center
            gap-2
        ">

                    <div class="
                flex-1

                text-lg
                md:text-xl

                font-black

                text-cyan-700

                break-all
            ">

                        {{ urlAmigable }}

                    </div>

                    <button @click="copiarUrl" type="button" class="
                    w-12
                    h-12

                    rounded-2xl

                    bg-cyan-500

                    text-white

                    shadow-lg

                    active:scale-95

                    transition
                ">

                        <i class="
                    fa
                    fa-copy
                ">
                        </i>

                    </button>

                </div>

            </div>

        </div>


        <!-- CIUDAD -->
        <div class="mb-4">

            <div class="
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                ">

                Ciudad

            </div>

            <input v-model="form.ciudad
                " class="
                    w-full
                    h-14

                    rounded-2xl

                    border

                    px-4

                    outline-none

                    bg-gray-50
                " placeholder="
                    Lima
                " />

        </div>

        <!-- PROVINCIA -->
        <div class="mb-4">

            <div class="
                    text-sm
                    font-semibold
                    text-gray-700
                    mb-2
                ">

                Provincia

            </div>

            <input v-model="form.provincia
                " class="
                    w-full
                    h-14

                    rounded-2xl

                    border

                    px-4

                    outline-none

                    bg-gray-50
                " placeholder="
                    Lima
                " />

        </div>

        <!-- YAPE -->
        <ListaYapeInput :modelValue="listaYape
            " @update:modelValue="
                updateYape
            " @invalid="
                $emit('invalid-yape')
                " />

        <GsapToast ref="toastRef" />

    </div>

</template>

<script setup>

import ListaYapeInput
    from './ListaYapeInput.vue'

import {
    computed,
    ref
}
    from 'vue'

import GsapToast
    from '../../../../../components/layout/GsapToast.vue'

function slugify(texto) {

    return String(
        texto || ''
    )

        .normalize('NFD')

        .replace(
            /[\u0300-\u036f]/g,
            ''
        )

        .toLowerCase()

        .replace(
            /[^a-z0-9\s-]/g,
            ''
        )

        .replace(
            /\s+/g,
            '-'
        )

        .replace(
            /-+/g,
            '-'
        )

        .trim()

}

const toastRef =
    ref(null)

const urlAmigable =
    computed(() => {

        const slug =
            slugify(
                props.form?.nombre
            )

        return slug
            ? `https://ofer.lat/${slug}`
            : 'https://ofer.lat/mi-negocio'

    })

async function copiarUrl() {

    await navigator
        .clipboard
        .writeText(
            urlAmigable.value
        )

    toastRef.value?.show({

        text:
            'Dirección copiada',

        type:
            'success'

    })

}

const props =
    defineProps({

        form: Object,

        listaYape: {

            type: Array,

            default: () => []

        }

    })

const emit =
    defineEmits([

        'update:listaYape',

        'invalid-yape'

    ])

function updateYape(v) {

    emit(
        'update:listaYape',
        v
    )

}

</script>