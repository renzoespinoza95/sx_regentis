<template>

    <teleport to="body">

        <div v-if="visible" class="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center">

            <div ref="box" class="
                    bg-white
                    w-[98vw]
                    h-[95vh]
                    rounded-2xl
                    overflow-hidden
                    shadow-2xl
                    flex
                    flex-col
                ">

                <!-- ======================================
                     HEADER
                ====================================== -->

                <div class="
                        px-4
                        py-3
                        border-b
                        flex
                        items-center
                        justify-between
                        gap-2
                        bg-white
                    ">

                    <div class="
                            font-semibold
                            text-gray-700
                        ">

                        Voucher de venta

                    </div>

                    <div class="
                            flex
                            items-center
                            gap-2
                        ">

                        <!-- IMPRIMIR -->

                        <button class="
                                px-4
                                py-2
                                rounded-lg
                                bg-green-500
                                text-white
                                text-sm
                                font-medium
                            " @click="imprimir">

                            🖨 Imprimir

                        </button>

                        <!-- DESCARGAR -->

                        <a :href="urlPdf" target="_blank" class="
                                px-4
                                py-2
                                rounded-lg
                                bg-blue-500
                                text-white
                                text-sm
                                font-medium
                            ">

                            ⬇ Descargar

                        </a>

                        <!-- CERRAR -->

                        <button class="
                                px-4
                                py-2
                                rounded-lg
                                bg-red-500
                                text-white
                                text-sm
                                font-medium
                            " @click="close">

                            ✖ Cerrar

                        </button>

                    </div>

                </div>

                <!-- ======================================
                     PDF
                ====================================== -->

                <iframe ref="iframeRef" :src="urlPdf" class="
                        flex-1
                        w-full
                        bg-gray-100
                    " />

            </div>

        </div>

    </teleport>

</template>

<script setup>

import {
    ref,
    nextTick
}
    from 'vue'

import gsap
    from 'gsap'

const visible =
    ref(false)

const box =
    ref(null)

const iframeRef =
    ref(null)

const urlPdf =
    ref('')

function open(pdfUrl) {

    if (!pdfUrl) {
        return
    }

    urlPdf.value =
        pdfUrl

    visible.value =
        true

    nextTick(() => {

        gsap.fromTo(

            box.value,

            {
                scale: 0.95,
                opacity: 0
            },

            {
                scale: 1,
                opacity: 1,
                duration: 0.25,
                ease: 'power3.out'
            }

        )

    })

}

function close() {

    gsap.to(

        box.value,

        {

            scale: 0.95,

            opacity: 0,

            duration: 0.20,

            ease: 'power3.in',

            onComplete: () => {

                visible.value =
                    false

                urlPdf.value =
                    ''

            }

        }

    )

}

function imprimir() {

    try {

        iframeRef.value
            ?.contentWindow
            ?.print()

    }
    catch (e) {

        window.open(

            urlPdf.value,

            '_blank'

        )

    }

}

defineExpose({

    open,

    close

})

</script>
