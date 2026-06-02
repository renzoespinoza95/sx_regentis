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
        " @click.self="close">

        <div ref="box" class="
                bg-white
                rounded-[32px]
                w-full
                max-w-lg
                overflow-hidden
                shadow-xl
            ">

            <div class="
                    px-5
                    py-4
                    text-white
                    flex
                    justify-between
                    items-center
                " style="
                    background:
                    linear-gradient(
                        135deg,
                        #FD7635,
                        #ff995e
                    );
                ">

                <div>

                    📈 Resumen de Ventas

                </div>

                <button @click="close" class="
                        w-9
                        h-9
                        rounded-full
                        bg-white/20
                    ">

                    <i class="fa fa-times"></i>

                </button>

            </div>

            <div class="p-4">

                <div class="
                        text-center
                        font-bold
                        mb-3
                    ">

                    {{ negocio }}

                </div>

                <apexchart height="350" type="bar" :options="chartOptions" :series="series" />

            </div>

        </div>

    </div>

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

import VueApexCharts
    from 'vue3-apexcharts'

import {
    firma
}
    from '../../../../../services/security'

const apexchart =
    VueApexCharts

const visible =
    ref(false)

const negocio =
    ref('')

const box =
    ref(null)

const chartOptions =
    ref({

        chart: {

            type: 'bar',

            toolbar: {

                show: false

            }

        },

        plotOptions: {

            bar: {

                borderRadius: 8,

                columnWidth: '55%'

            }

        },

        dataLabels: {

            enabled: false

        },

        xaxis: {

            categories: []

        },

        yaxis: {

            labels: {

                formatter(value) {

                    return `S/ ${value}`

                }

            }

        }

    })

const series =
    ref([])

function formatDate(
    fecha
) {

    const y =
        fecha.getFullYear()

    const m =
        String(
            fecha.getMonth() + 1
        ).padStart(2, '0')

    const d =
        String(
            fecha.getDate()
        ).padStart(2, '0')

    return `${y}-${m}-${d}`

}

async function open(
    neg_id
) {

    const hoy =
        new Date()

    const inicio =
        new Date()

    inicio.setDate(
        hoy.getDate() - 6
    )

    const seguridad =
        firma()

    const r =
        await axios.post(

            `${import.meta.env.VITE_PUBLIC_URL_BASE}/GHDk/graficoVentas`,

            {

                neg_id,

                fecha_inicio:
                    formatDate(
                        inicio
                    ),

                fecha_fin:
                    formatDate(
                        hoy
                    ),

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

    negocio.value =
        r.data.negocio?.nombre
        || ''

    chartOptions.value = {

        ...chartOptions.value,

        xaxis: {

            categories:

                (r.data.apexcharts?.categories || [])

                    .map(fecha => {

                        const partes =
                            fecha.split('-')

                        return `${partes[2]}/${partes[1]}/${partes[0]}`

                    })

        }

    }

    series.value =
        r.data.apexcharts?.series
        || []

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
            duration: 0.3
        }

    )

}

function close() {

    visible.value =
        false

}

defineExpose({

    open

})

</script>
