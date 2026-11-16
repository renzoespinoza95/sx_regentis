<template>

    <div class="space-y-4">

        <div class="
            p-4
            rounded-[24px]
            bg-[#fff4ee]
            border
            border-[#ffd9c5]
        ">

            <div class="
                flex
                items-center
                justify-between
                mb-4
            ">

                <div>

                    <div class="
                        text-sm
                        font-black
                        text-[#FD7635]
                        uppercase
                    ">
                        🧩 Variantes
                    </div>

                    <div class="
                        text-xs
                        text-gray-500
                        mt-1
                    ">
                        Ej: Color, Talla, Tipo USB
                    </div>

                </div>

                <button class="
                        px-3
                        py-2
                        rounded-full
                        bg-white
                        text-[#FD7635]
                        text-xs
                        font-bold
                        shadow-sm
                        active:scale-95
                    " @click="limpiar">
                    Limpiar
                </button>

            </div>

            <div class="mb-4">

                <label class="
                    text-xs
                    font-bold
                    text-gray-500
                    uppercase
                    mb-2
                    block
                ">
                    Atributo
                </label>

                <input v-model="local.atributo" placeholder="Ej: Color" class="
                        w-full
                        h-[48px]
                        rounded-2xl
                        bg-white
                        border-2
                        border-transparent
                        px-4
                        outline-none
                        focus:border-[#FD7635]
                    " @input="emitir">

            </div>

            <div class="
                overflow-x-auto
                rounded-2xl
                bg-white
                border
                border-orange-100
            ">

                <table class="w-full text-sm">

                    <thead>

                        <tr class="bg-orange-50 text-gray-600">

                            <th class="p-2 text-left">
                                Valor
                            </th>

                            <th class="p-2 text-center w-[50px]">
                                X
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr v-for="(op, index) in local.opciones" :key="index" class="border-t">

                            <td class="p-2">

                                <input v-model="op.valor" placeholder="Rojo" class="
                                        w-full
                                        h-[40px]
                                        rounded-xl
                                        bg-[#fff4ee]
                                        px-3
                                        outline-none
                                    " @input="emitir">

                            </td>

                            <td class="p-2 text-center">

                                <button class="
                                        w-8
                                        h-8
                                        rounded-full
                                        bg-red-50
                                        text-red-500
                                        active:scale-90
                                    " @click="eliminarOpcion(index)">
                                    <i class="fa fa-trash"></i>
                                </button>

                            </td>

                        </tr>

                        <tr v-if="local.opciones.length <= 0">

                            <td colspan="2" class="
                                    p-4
                                    text-center
                                    text-gray-400
                                    text-xs
                                ">
                                No hay variantes agregadas
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

            <button class="
                    mt-4
                    w-full
                    h-[46px]
                    rounded-2xl
                    bg-[#FD7635]
                    text-white
                    font-bold
                    active:scale-[0.98]
                    transition
                " @click="agregarOpcion">
                + Agregar opción
            </button>

        </div>

    </div>

</template>

<script setup>

import {
    reactive,
    watch
}
    from 'vue'

const props =
    defineProps({

        modelValue: {
            type: [Object, String, null],
            default: null
        }

    })

const emit =
    defineEmits([

        'update:modelValue'

    ])

const local =
    reactive({

        atributo: '',

        opciones: []

    })

function normalizar(value) {

    if (!value) {

        return {
            atributo: '',
            opciones: []
        }

    }

    if (typeof value === 'string') {

        try {

            return JSON.parse(value)

        } catch (e) {

            return {
                atributo: '',
                opciones: []
            }

        }

    }

    return value

}

watch(
    () => props.modelValue,
    value => {

        const data =
            normalizar(value)

        local.atributo =
            data.atributo || ''

        local.opciones =
            Array.isArray(data.opciones)
                ? data.opciones.map(x => ({
                    valor: x.valor || ''
                }))
                : []

    },
    {
        immediate: true,
        deep: true
    }
)

function emitir() {

    emit(
        'update:modelValue',
        {
            atributo: local.atributo,
            opciones: local.opciones
        }
    )

}

function agregarOpcion() {

    local.opciones.push({
        valor: ''
    })

    emitir()

}

function eliminarOpcion(index) {

    local.opciones.splice(
        index,
        1
    )

    emitir()

}

function limpiar() {

    local.atributo = ''

    local.opciones = []

    emitir()

}

</script>