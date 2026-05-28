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

    </div>

</template>

<script setup>

import ListaYapeInput
    from './ListaYapeInput.vue'

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