<template>

    <div class="min-h-screen pattern-background pt-20">

        <HeaderBack />

        <div class="content-container">

            <div class="
                    bg-white
                    rounded-3xl
                    p-6
                    shadow-md
                    max-w-md
                    mx-auto
                ">

                <!-- HEADER -->
                <NegocioHeader />

                <!-- AVATAR -->
                <NegocioAvatar :negocio="negocio" :previewImage="previewImage" :isUploading="isUploadingImage"
                    @select-image="selectImage" @cancel-image="cancelImage" @upload-image="uploadImage" />

                <!-- FORM -->
                <NegocioForm :form="form" v-model:listaYape="listaYape
                    " @invalid-yape="
                        invalidYape
                    " />

                <!-- ACTIONS -->
                <BottomActions @open-membresia="
                    openMembresia
                " />

                <!-- BTN -->
                <SaveButton @click="guardar" />

            </div>

        </div>

        <!-- DIALOG -->
        <MembresiaDialog ref="membresiaRef" />

        <!-- LOADER -->
        <AppLoader :show="loading" text="Guardando negocio..." />

        <!-- SNACK -->
        <AppSnackbar ref="snackbarRef" />

        <!-- FILE -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    </div>

</template>

<script setup>

import {
    ref,
    onMounted
}
    from 'vue'

import axios
    from 'axios'

import HeaderBack
    from '../../../../components/layout/HeaderBack.vue'

import AppLoader
    from '../../../../components/layout/AppLoader.vue'

import AppSnackbar
    from '../../../../components/layout/AppSnackbar.vue'

import YaplinGallery
    from '../../../../components/YaplinGallery.vue'

import YaplinUploader
    from '../../../../components/YaplinUploader.vue'

import {
    firma
}
    from '../../../../services/security'

import {
    useUsuario
}
    from '../../../../services/usuarioService'

import NegocioHeader
    from './components/NegocioHeader.vue'

import NegocioAvatar
    from './components/NegocioAvatar.vue'

import NegocioForm
    from './components/NegocioForm.vue'

import SaveButton
    from './components/SaveButton.vue'

import BottomActions
    from './components/BottomActions.vue'

import MembresiaDialog
    from './components/MembresiaDialog.vue'

/* =========================================
   API
========================================= */

const API =
    import.meta.env
        .VITE_PUBLIC_URL_BASE

const API_FLASK =
    import.meta.env
        .VITE_PUBLIC_URL_FLASK

/* =========================================
   USUARIO
========================================= */

const {
    getNegId
}
    =
    useUsuario()

/* =========================================
   STATE
========================================= */

const negocio =
    ref(null)

const loading =
    ref(false)

const snackbarRef =
    ref(null)

const fileInput =
    ref(null)

const previewImage =
    ref(null)

const selectedFile =
    ref(null)

const uploadedImageUrl =
    ref('')

const isUploadingImage =
    ref(false)

const membresiaRef =
    ref(null)

const listaYape =
    ref([])

const form =
    ref({

        nombre: '',

        celular_informes: '',

        ciudad: '',

        provincia: ''

    })

/* =========================================
   INIT
========================================= */

onMounted(() => {

    cargarNegocio()

})

/* =========================================
   DETALLE
========================================= */

async function cargarNegocio() {

    try {

        loading.value =
            true

        const seguridad =
            firma()

        const r =
            await axios.post(

                `${API}/XQzQ/detalleNeg`,

                {

                    neg_id:
                        getNegId(),

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (

            r.data.res === 'ok'

        ) {

            negocio.value =
                r.data.data

            form.value = {

                nombre:
                    r.data.data.nombre || '',

                celular_informes:
                    r.data.data.celular_informes || '',

                ciudad:
                    r.data.data.ciudad || '',

                provincia:
                    r.data.data.provincia || ''

            }

            try {

                listaYape.value =
                    JSON.parse(

                        r.data.data.lista_yape
                        ||
                        '[]'

                    )

            } catch {

                listaYape.value = []

            }

        }

    } catch (e) {

        console.error(e)

    } finally {

        loading.value =
            false

    }

}

/* =========================================
   INVALID YAPE
========================================= */

function invalidYape() {

    snackbarRef.value?.open(
        'El número debe tener 9 dígitos'
    )

}

/* =========================================
   IMAGE PICKER
========================================= */

function selectImage() {

    fileInput.value?.click()

}

function cancelImage() {

    previewImage.value =
        null

    selectedFile.value =
        null

    uploadedImageUrl.value =
        ''

}

function onFileChange(e) {

    const file =
        e.target.files?.[0]

    if (!file) {
        return
    }

    selectedFile.value =
        file

    previewImage.value =
        URL.createObjectURL(file)

}

/* =========================================
   OPTIMIZE IMAGE
========================================= */

function optimizeImage(file) {

    return new Promise((resolve, reject) => {

        const reader =
            new FileReader()

        reader.onload =
            (e) => {

                const img =
                    new Image()

                img.onload =
                    () => {

                        let width =
                            img.width

                        let height =
                            img.height

                        const MAX =
                            600

                        if (width > height) {

                            if (width > MAX) {

                                height =
                                    height
                                    *
                                    (
                                        MAX
                                        /
                                        width
                                    )

                                width =
                                    MAX

                            }

                        } else {

                            if (height > MAX) {

                                width =
                                    width
                                    *
                                    (
                                        MAX
                                        /
                                        height
                                    )

                                height =
                                    MAX

                            }

                        }

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

                        canvas.toBlob(

                            (blob) => {

                                const optimized =
                                    new File(

                                        [blob],

                                        'logo.jpg',

                                        {

                                            type:
                                                'image/jpeg'

                                        }

                                    )

                                resolve(
                                    optimized
                                )

                            },

                            'image/jpeg',

                            0.7

                        )

                    }

                img.src =
                    e.target.result

            }

        reader.readAsDataURL(
            file
        )

    })

}

/* =========================================
   UPLOAD IMAGE
========================================= */

async function uploadImage() {

    try {

        if (!selectedFile.value) {
            return
        }

        isUploadingImage.value =
            true

        const optimized =
            await optimizeImage(
                selectedFile.value
            )

        const fd =
            new FormData()

        fd.append(
            'file',
            optimized
        )

        const r =
            await axios.post(

                `${API_FLASK}/tk_guardar_img`,

                fd,

                {

                    headers: {

                        'Content-Type':
                            'multipart/form-data'

                    }

                }

            )

        const job_id =
            r.data.job_id

        await pollJob(
            job_id
        )

    } catch (e) {

        console.error(e)

        snackbarRef.value?.open(
            'Error subiendo imagen'
        )

    } finally {

        isUploadingImage.value =
            false

    }

}

/* =========================================
   POLLING
========================================= */

async function pollJob(job_id) {

    return new Promise((resolve, reject) => {

        const interval =
            setInterval(async () => {

                try {

                    const r =
                        await axios.get(

                            `${API_FLASK}/jobs/result`,

                            {

                                params: {

                                    job_id

                                }

                            }

                        )

                    if (

                        r.data.status ===
                        'finished'

                    ) {

                        clearInterval(
                            interval
                        )

                        uploadedImageUrl.value =
                            r.data.result.url

                        previewImage.value =
                            r.data.result.url

                        snackbarRef.value?.open(
                            'Imagen subida'
                        )

                        resolve()

                    }

                } catch (e) {

                    clearInterval(
                        interval
                    )

                    reject(e)

                }

            }, 2000)

    })

}

/* =========================================
   GUARDAR
========================================= */

async function guardar() {

    try {

        loading.value =
            true

        const seguridad =
            firma()

        const payload = {

            neg_id:
                getNegId(),

            nombre:
                form.value.nombre,

            celular_informes:
                form.value.celular_informes,

            ciudad:
                form.value.ciudad,

            provincia:
                form.value.provincia,

            img_logo:

                uploadedImageUrl.value

                ||

                negocio.value?.img_logo

                ||

                '',

            lista_yape:
                listaYape.value,

            xin:
                seguridad.xin,

            yuan:
                seguridad.yuan

        }

        const r =
            await axios.post(

                `${API}/Fw7L/editarMiNeg`,

                payload

            )

        snackbarRef.value?.open(

            r.data.msg
            ||
            'Negocio actualizado'

        )

    } catch (e) {

        console.error(e)

        snackbarRef.value?.open(
            'Error guardando negocio'
        )

    } finally {

        loading.value =
            false

    }

}

/* =========================================
   MEMBRESIA
========================================= */

function openMembresia() {

    membresiaRef.value?.open()

}

</script>

<style scoped>
.pattern-background {

    background-color: #eefcf9;

    opacity: 0.95;

    background-image:

        linear-gradient(135deg,
            #c7f3eb 25%,
            transparent 25%),

        linear-gradient(225deg,
            #c7f3eb 25%,
            transparent 25%),

        linear-gradient(45deg,
            #c7f3eb 25%,
            transparent 25%),

        linear-gradient(315deg,
            #c7f3eb 25%,
            #eefcf9 25%);

    background-position:
        10px 0,
        10px 0,
        0 0,
        0 0;

    background-size:
        10px 10px;

    background-repeat:
        repeat;

}

.content-container {

    padding:
        20px;

}
</style>