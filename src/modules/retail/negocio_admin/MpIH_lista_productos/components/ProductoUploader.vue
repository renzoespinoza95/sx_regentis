<template>

    <div class="
            rounded-3xl

            border-2
            border-dashed
            border-[#FD7635]

            bg-[#fff4ee]

            p-5
        ">

        <!-- EMPTY -->
        <div v-if="!preview" class="
                text-center
            ">

            <div class="
                    text-5xl
                    mb-3
                ">

                🖼️

            </div>

            <div class="
                    font-bold
                    text-gray-700
                ">

                Subir imagen

            </div>

            <div class="
                    text-sm
                    text-gray-500
                    mt-1
                ">

                Selecciona 1 imagen

            </div>

        </div>

        <!-- PREVIEW -->
        <div v-if="preview" class="
                relative
            ">

            <img :src="preview" class="
                    w-full

                    h-64

                    object-cover

                    rounded-3xl
                ">

        </div>

        <!-- INPUT -->
        <input ref="fileRef" type="file" accept="image/*" class="hidden" @change="onFile">

        <!-- BUTTONS -->
        <div class="
                flex
                gap-3
                mt-5
            ">

            <!-- SELECT -->
            <button class="
                    flex-1

                    h-[52px]

                    rounded-2xl

                    bg-[#FD7635]

                    text-white

                    font-semibold

                    active:scale-95
                    transition
                " @click="fileRef?.click()">

                Seleccionar imagen

            </button>

            <!-- UPLOAD -->
            <button v-if="preview" :disabled="subiendo" class="
                    flex-1

                    h-[52px]

                    rounded-2xl

                    bg-green-500

                    text-white

                    font-semibold

                    active:scale-95
                    transition

                    disabled:opacity-50
                " @click="subirImagen">

                {{

                    subiendo

                        ?

                        'Subiendo...'

                        :

                        'Subir imagen'

                }}

            </button>

        </div>

    </div>

    <AppSnackbar ref="snackbarRef" />

    <AppLoader :show="loading" :local="true" text="
        Subiendo imagen...
    " />


</template>

<script setup>

import {
    ref
}
    from 'vue'

import axios
    from 'axios'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'

import {
    firma
}
    from '../../../../../services/security'
import AppLoader
    from '../../../../../components/layout/AppLoader.vue'

const props =
    defineProps({

        producto: Object

    })

const fileRef =
    ref(null)

const file =
    ref(null)

const preview =
    ref('')

const subiendo =
    ref(false)

const snackbarRef =
    ref(null)

const loading =
    ref(false)

const emit =
    defineEmits([

        'uploaded'

    ])

/* =========================================
🔥 FILE
========================================= */

function onFile(e) {

    const f =
        e.target.files?.[0]

    if (!f) {
        return
    }

    file.value = f

    preview.value =
        URL.createObjectURL(f)

}

/* =========================================
🔥 SUBIR
========================================= */

async function subirImagen() {

    try {

        if (!file.value) {
            return
        }

        subiendo.value = true
        loading.value = true

        /* =========================================
           🔥 FORM DATA
        ========================================= */

        const fd =
            new FormData()

        /* =========================================
           🔥 REDUCIR
        ========================================= */

        const archivoReducido =

            await reducirImagen(
                file.value
            )

        fd.append(

            'file',

            archivoReducido

        )

        /* =========================================
           🔥 TK
        ========================================= */

        const res =
            await axios.post(

                `${import.meta.env.VITE_PUBLIC_URL_FLASK}/tk_guardar_img`,

                fd,

                {

                    headers: {

                        'Content-Type':
                            'multipart/form-data'

                    }

                }

            )

        const jobId =
            res.data?.job_id

        if (!jobId) {

            throw new Error(
                'No job_id'
            )

        }

        /* =========================================
           🔥 POLLING
        ========================================= */

        pollingJob(
            jobId
        )

    } catch (e) {

        console.error(e)

        subiendo.value = false

        loading.value = false

    }

}

/* =========================================
🔥 POLLING
========================================= */

function pollingJob(jobId) {

    const interval = setInterval(

        async () => {

            try {

                const r =
                    await axios.get(

                        `${import.meta.env.VITE_PUBLIC_URL_FLASK}/jobs/result`,

                        {

                            params: {

                                job_id:
                                    jobId

                            }

                        }

                    )

                /* =========================================
                   🔥 FINISHED
                ========================================= */

                if (

                    r.data?.status === 'finished'

                ) {

                    clearInterval(
                        interval
                    )

                    const bunnyUrl =

                        r.data
                            ?.result
                            ?.url

                    if (!bunnyUrl) {

                        subiendo.value = false

                        loading.value = false

                        return

                    }

                    await guardarImagenProducto(
                        bunnyUrl
                    )

                }

            } catch (e) {

                console.error(e)

                clearInterval(
                    interval
                )

                subiendo.value = false

                loading.value = false

            }

        },

        2000

    )

}

/* =========================================
🔥 REDUCIR IMAGEN
========================================= */

async function reducirImagen(fileOriginal) {

    return new Promise((resolve, reject) => {

        const img =
            new Image()

        const reader =
            new FileReader()

        reader.onload = e => {

            img.src =
                e.target.result

        }

        reader.onerror =
            reject

        img.onload = () => {

            /* =========================================
               🔥 SIZE
            ========================================= */

            const maxWidth =
                600

            let width =
                img.width

            let height =
                img.height

            if (width > maxWidth) {

                height =

                    height
                    *
                    (
                        maxWidth
                        / width
                    )

                width =
                    maxWidth

            }

            /* =========================================
               🔥 CANVAS
            ========================================= */

            const canvas =
                document.createElement(
                    'canvas'
                )

            canvas.width =
                width

            canvas.height =
                height

            const ctx =
                canvas.getContext('2d')

            ctx.drawImage(

                img,

                0,
                0,

                width,
                height

            )

            /* =========================================
               🔥 JPG 70%
            ========================================= */

            canvas.toBlob(

                blob => {

                    if (!blob) {

                        reject()

                        return

                    }

                    const nuevoFile =
                        new File(

                            [

                                blob

                            ],

                            'producto.jpg',

                            {

                                type:
                                    'image/jpeg'

                            }

                        )

                    resolve(
                        nuevoFile
                    )

                },

                'image/jpeg',

                0.7

            )

        }

        img.onerror =
            reject

        reader.readAsDataURL(
            fileOriginal
        )

    })

}

/* =========================================
🔥 GUARDAR PRODUCTO
========================================= */

async function guardarImagenProducto(url) {

    try {

        const seguridad =
            firma()

        const r =
            await axios.post(

                '/M4LT/guardarImagenProducto',

                {

                    product_id:
                        props.producto.product_id,

                    url_imagen:
                        url,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        /* =========================================
    🔥 NUEVA IMAGEN
    ========================================= */

        const nuevaImagen =
            r.data

        if (

            nuevaImagen
                ?.img

        ) {

            /* =========================================
               🔥 PRIMERA
            ========================================= */


            emit(

                'uploaded',

                {

                    product_id:
                        props.producto.product_id,

                    imagen:
                        nuevaImagen

                }

            )

        }

        snackbarRef.value?.open(

            'Imagen cargada exitosamente ✨'

        )

        /* =========================================
🔥 LIMPIAR
========================================= */

        preview.value = ''

        file.value = null

        if (fileRef.value) {

            fileRef.value.value = ''

        }

        subiendo.value = false

        loading.value = false

    } catch (e) {

        console.error(e)

        subiendo.value = false

        loading.value = false

    }

}

</script>