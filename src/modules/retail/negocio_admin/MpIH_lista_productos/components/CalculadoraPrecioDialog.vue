<template>

    <div v-if="visible" class="
            fixed
            inset-0
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-[9999]
            p-4
        " @click.stop>

        <div ref="box" class="
                bg-white
                rounded-[28px]
                w-full
                max-w-5xl
                h-[90vh]
                overflow-hidden
                flex
                flex-col
            " @click.stop>

            <!-- HEADER -->
            <div class="px-5 py-4 text-white" style="
                    background:
                    linear-gradient(
                        135deg,
                        #FD7635 0%,
                        #ff995e 100%
                    );
                ">

                <div class="
                        flex
                        justify-between
                        items-center
                    ">

                    <div>

                        <div class="
                                text-xl
                                font-black
                            ">
                            🧮 Calculadora de precios
                        </div>

                        <div class="
                                text-sm
                                opacity-90
                            ">
                            {{ producto?.name }}
                        </div>

                    </div>

                    <button class="
                            w-10
                            h-10
                            rounded-full
                            bg-white/20
                            text-white
                        " @click="close">

                        <i class="fa fa-times"></i>

                    </button>

                </div>

            </div>

            <!-- PASOS -->
            <div class="
                    px-5
                    py-4
                    border-b
                    bg-gray-50
                ">

                <div class="
                        flex
                        items-center
                        justify-center
                        gap-4
                    ">

                    <button class="
                            px-5
                            py-2
                            rounded-full
                            font-semibold
                        " :class="paso === 1
                            ? 'bg-[#FD7635] text-white'
                            : 'bg-gray-200 text-gray-700'
                            " @click="paso = 1">
                        ① Compra
                    </button>

                    <button class="
                            px-5
                            py-2
                            rounded-full
                            font-semibold
                        " :class="paso === 2
                            ? 'bg-[#FD7635] text-white'
                            : 'bg-gray-200 text-gray-700'
                            " @click="paso = 2">
                        ② Ganancias
                    </button>

                    <button class="
                            px-5
                            py-2
                            rounded-full
                            font-semibold
                        " :class="paso === 3
                            ? 'bg-[#FD7635] text-white'
                            : 'bg-gray-200 text-gray-700'
                            " @click="paso = 3">
                        ③ Resumen
                    </button>

                </div>

            </div>

            <!-- CONTENIDO -->
            <div class="
                    flex-1
                    overflow-auto
                    p-1
                ">

                <!-- PASO 1 -->
                <template v-if="paso === 1">

                    <div class="
                            max-w-xl
                            mx-auto
                            space-y-5
                        ">

                        <div class="
                                bg-white
                                border
                                rounded-2xl
                                p-5
                                shadow-sm
                            ">

                            <div class="
                                    text-lg
                                    font-bold
                                    mb-4
                                ">
                                Compra del producto
                            </div>

                            <div class="
        grid
        grid-cols-2
        gap-4
    ">

                                <!-- COMPRA TOTAL -->
                                <div>

                                    <label class="
                block
                text-sm
                font-semibold
                mb-2
            ">
                                        Compra total
                                    </label>

                                    <input v-model="compraTotal" type="number" step="0.01" placeholder="0" class="
                w-full
                border
                rounded-xl
                px-4
                py-3
            ">

                                </div>

                                <!-- CANTIDAD -->
                                <div>

                                    <label class="
                block
                text-sm
                font-semibold
                mb-2
            ">
                                        Cantidad comprada
                                    </label>

                                    <input v-model="cantidadComprada" type="number" placeholder="0" class="
                w-full
                border
                rounded-xl
                px-4
                py-3
            ">

                                </div>

                            </div>

                            <div class="
                                    bg-green-50
                                    rounded-2xl
                                    p-5
                                ">

                                <div class="
                                        text-sm
                                        text-gray-600
                                    ">
                                    Costo unitario base
                                </div>

                                <div class="
                                        text-4xl
                                        font-black
                                        text-green-600
                                    ">
                                    S/
                                    {{ costoUnitarioBase.toFixed(2) }}
                                </div>

                            </div>

                        </div>

                    </div>

                </template>

                <!-- PASO 2 -->
                <template v-if="paso === 2">

                    <div class="overflow-x-auto">

                        <table class="
                                w-full
                                border-collapse
                            ">

                            <thead>

                                <tr class="bg-gray-100">

                                    <th class="p-3 border">
                                        Venta
                                    </th>

                                    <th class="p-3 border">
                                        Cantidad
                                    </th>

                                    <th class="p-3 border">
                                        Ganancia %
                                    </th>

                                    <th class="p-3 border">
                                        Precio
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                <tr v-for="fila in rangos" :key="fila.nombre_rango">

                                    <td class="border p-3">
                                        {{ fila.nombre_rango }}
                                    </td>

                                    <td class="border p-3 text-center">
                                        {{ fila.cantidad_desde }}
                                    </td>

                                    <td class="border p-3 text-center">

                                        <button class="
                                                px-3
                                                py-2
                                                rounded-xl
                                                bg-[#FD7635]
                                                text-white
                                            " @click="
                                                editarGanancia(
                                                    fila
                                                )
                                                ">
                                            {{ fila.ganancia_porcentaje }}%
                                        </button>

                                    </td>

                                    <td class="border p-3 text-right">
                                        S/
                                        {{ precioFila(fila).toFixed(2) }}
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </template>

                <!-- PASO 3 -->
                <template v-if="paso === 3">

                    <div class="overflow-x-auto">

                        <table class="
                                w-full
                                border-collapse
                            ">

                            <thead>

                                <tr class="bg-gray-100">

                                    <th class="p-3 border">
                                        Venta
                                    </th>

                                    <th class="p-3 border">
                                        Cantidad
                                    </th>

                                    <th class="p-3 border">
                                        Total venta
                                    </th>

                                    <th class="p-3 border">
                                        Costo base
                                    </th>

                                    <th class="p-3 border">
                                        Gana total
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                <tr v-for="fila in rangos" :key="fila.nombre_rango">

                                    <td class="border p-3">
                                        {{ fila.nombre_rango }}
                                    </td>

                                    <td class="border p-3 text-center">
                                        {{ fila.cantidad_desde }}
                                    </td>

                                    <td class="border p-3 text-right">
                                        S/
                                        {{ totalVenta(fila).toFixed(2) }}
                                    </td>

                                    <td class="border p-3 text-right">
                                        S/
                                        {{ costoBaseFila(fila).toFixed(2) }}
                                    </td>

                                    <td class="
                                            border
                                            p-3
                                            text-right
                                            font-bold
                                            text-green-600
                                        ">
                                        S/
                                        {{ gananciaFila(fila).toFixed(2) }}
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </template>

            </div>

            <!-- FOOTER -->
            <div class="
        border-t
        bg-white
        p-4
        flex
        justify-between
        items-center
        gap-4
    ">

                <!-- ANTERIOR -->
                <button v-if="paso > 1" class="
            px-5
            py-3
            rounded-xl
            bg-gray-200
            shrink-0
        " @click="paso--">
                    ← Anterior
                </button>

                <div v-else class="w-[120px]"></div>

                <!-- PRECIO BASE -->
                <div class="
            flex-1
            text-center
        ">

                    <div class="
                text-xs
                text-gray-500
                font-semibold
            ">
                        Precio base
                    </div>

                    <div class="
                text-2xl
                font-black
                text-green-600
            ">
                        S/
                        {{ costoUnitarioBase.toFixed(2) }}
                    </div>

                </div>

                <!-- SIGUIENTE / GUARDAR -->
                <button v-if="paso < 3" class="
            px-5
            py-3
            rounded-xl
            bg-[#FD7635]
            text-white
            shrink-0
        " @click="paso++">
                    Siguiente →
                </button>

                <button v-if="paso === 3" class="
            px-6
            py-3
            rounded-xl
            bg-green-500
            text-white
            font-bold
            shrink-0
        " @click="guardar">
                    Guardar ✨
                </button>

            </div>

        </div>

        <GananciaDialog ref="gananciaDialogRef" @confirm="onGananciaConfirm" />

        <GsapToast ref="toastRef" />

    </div>

</template>
<script setup>

import {
    ref,
    computed,
    nextTick
}
    from 'vue'

import GsapToast
    from '../../../../../components/layout/GsapToast.vue'
import axios
    from 'axios'

import gsap
    from 'gsap'

import {
    firma
}
    from '../../../../../services/security.js'

import {
    useUsuario
}
    from '../../../../../services/usuarioService.js'

import GananciaDialog
    from './GananciaDialog.vue'

const emit =
    defineEmits([

        'saved'

    ])

const visible =
    ref(false)

const box =
    ref(null)

const toastRef =
    ref(null)

const gananciaDialogRef =
    ref(null)

const producto =
    ref(null)

const paso =
    ref(1)

const compraTotal =
    ref(null)

const cantidadComprada =
    ref(null)

const filaEditando =
    ref(null)

const {
    getNegId
}
    =
    useUsuario()

const rangos =
    ref([

        {

            cantidad_desde: 1,

            nombre_rango:
                'Unidad',

            ganancia_porcentaje:
                25

        },

        {

            cantidad_desde: 6,

            nombre_rango:
                '6 unidades',

            ganancia_porcentaje:
                22

        },

        {

            cantidad_desde: 12,

            nombre_rango:
                'Docena',

            ganancia_porcentaje:
                18

        },

        {

            cantidad_desde: 40,

            nombre_rango:
                'Caja',

            ganancia_porcentaje:
                10

        }

    ])




const costoUnitarioBase =
    computed(() => {

        const compra =
            Number(
                compraTotal.value
            )

        const cantidad =
            Number(
                cantidadComprada.value
            )

        if (

            !cantidad

        ) {

            return 0

        }

        return (
            compra /
            cantidad
        )

    })



function precioFila(
    fila
) {

    return (

        costoUnitarioBase.value

        *

        (

            1 +

            (
                Number(
                    fila.ganancia_porcentaje
                ) / 100
            )

        )

    )

}

async function cargarDetalle() {

    try {

        const seguridad =
            firma()

        const r =
            await axios.post(

                '/V8ke/calculadoraPrecioDetalle',

                {

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan,

                    product_id:
                        producto.value
                            ?.product_id,

                    neg_id:
                        getNegId()

                }

            )

        if (

            r.data.status
            !==
            'ok'

        ) {

            return

        }

        compraTotal.value =

            Number(
                r.data.compra_total
            ) || 0

        cantidadComprada.value =

            Number(
                r.data.cantidad_comprada
            ) || 0

        if (

            Array.isArray(
                r.data.rangos
            )

            &&

            r.data.rangos.length

        ) {

            rangos.value =

                r.data.rangos.map(

                    x => ({

                        cantidad_desde:
                            Number(
                                x.cantidad_desde
                            ),

                        nombre_rango:
                            x.nombre_rango,

                        ganancia_porcentaje:
                            Number(
                                x.ganancia_porcentaje
                            )

                    })

                )

        }

    }
    catch (e) {

        console.error(e)

    }

}

function totalVenta(
    fila
) {

    return (

        precioFila(fila)

        *

        fila.cantidad_desde

    )

}




function costoBaseFila(
    fila
) {

    return (

        costoUnitarioBase.value

        *

        fila.cantidad_desde

    )

}



function gananciaFila(
    fila
) {

    return (

        totalVenta(fila)

        -

        costoBaseFila(fila)

    )

}

async function open(p) {

    producto.value =
        p

    paso.value =
        1

    visible.value =
        true

    await nextTick()

    await cargarDetalle()

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

            ease:
                'back.out(1.7)'

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

            }

        }

    )

}



function editarGanancia(
    fila
) {

    filaEditando.value =
        fila

    gananciaDialogRef
        .value
        ?.open({

            titulo:
                fila.nombre_rango,

            valor:
                fila.ganancia_porcentaje

        })

}




function onGananciaConfirm(

    porcentaje

) {

    if (

        !filaEditando.value

    ) {

        return

    }

    filaEditando.value
        .ganancia_porcentaje =
        porcentaje

}




async function guardar() {

    try {

        const seguridad =
            firma()

        const payload = {

            xin:
                seguridad.xin,

            yuan:
                seguridad.yuan,

            product_id:
                producto.value
                    ?.product_id,

            neg_id:
                getNegId(),

            compra_total:
                Number(
                    compraTotal.value
                ),

            cantidad_comprada:
                Number(
                    cantidadComprada.value
                ),

            rangos:

                rangos.value.map(

                    r => ({

                        cantidad_desde:
                            r.cantidad_desde,

                        nombre_rango:
                            r.nombre_rango,

                        ganancia_porcentaje:

                            Number(

                                r.ganancia_porcentaje

                            )

                    })

                )

        }

        const r =
            await axios.post(

                '/W4ta/calculadoraPrecio',

                payload

            )

        if (

            r.data.status
            !==
            'ok'

        ) {

            throw new Error()

        }

        toastRef.value?.show({

            text:
                'Precios guardados ✨',

            type:
                'success'

        })

        emit(
            'saved'
        )

        setTimeout(

            () => {

                close()

            },

            700

        )

    }
    catch (e) {

        toastRef.value?.show({

            text:
                'Error guardando precios',

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
table {

    min-width: 380px;

}

th {

    font-weight: 700;

}

td,
th {

    border-color:
        #e5e7eb;

}
</style>