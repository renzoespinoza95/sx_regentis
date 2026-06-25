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
                max-w-md
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

                    📄 Exportar PDF

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

            <div class="p-5 space-y-4">

                <div>

                    <div class="
                            text-sm
                            font-semibold
                            mb-2
                        ">

                        Fecha inicio

                    </div>

                    <input v-model="ini" type="date" class="
                            w-full
                            border
                            rounded-xl
                            p-3
                        " />

                </div>

                <div>

                    <div class="
                            text-sm
                            font-semibold
                            mb-2
                        ">

                        Fecha término

                    </div>

                    <input v-model="fin" type="date" class="
                            w-full
                            border
                            rounded-xl
                            p-3
                        " />

                </div>

                <button @click="generarPdf" :disabled="loading" class="
                        w-full
                        bg-[#FD7635]
                        text-white
                        rounded-2xl
                        py-3
                        font-bold
                    ">

                    <i v-if="loading" class="
                            fa
                            fa-spinner
                            fa-spin
                        "></i>

                    <span v-else>

                        Descargar PDF

                    </span>

                </button>

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

const visible =
    ref(false)

const box =
    ref(null)

const loading =
    ref(false)

const ini =
    ref('')

const fin =
    ref('')

function hoy() {

    const d =
        new Date()

    return d
        .toISOString()
        .substring(0, 10)

}

async function open() {

    ini.value =
        hoy()

    fin.value =
        hoy()

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

async function generarPdf() {

    try {

        loading.value =
            true

        const r =
            await axios.post(

                `${import.meta.env.VITE_PUBLIC_URL_BASE}/XGdi/imp_ventas_fecha`,

                {

                    ini:
                        ini.value,

                    fin:
                        fin.value

                }

            )

        if (

            r.data.status === 'ok'

            &&

            r.data.url

        ) {

            window.open(

                r.data.url,

                '_blank'

            )

        }

    }
    catch (e) {

        console.error(e)

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
