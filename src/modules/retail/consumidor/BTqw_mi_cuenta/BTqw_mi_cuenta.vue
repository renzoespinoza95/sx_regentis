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
                <ProfileHeader />

                <!-- AVATAR -->
                <ProfileAvatar :usuario="usuario" :previewImage="previewImage" :isUploading="isUploadingImage"
                    @select-image="selectImage" @cancel-image="cancelImage" @upload-image="uploadImage" />

                <!-- FORM -->
                <ProfileForm :form="form" :usu-id-valido="usuIdValido" @crear-tienda="navegarCrearTienda" />

                <!-- BTN -->
                <NextButton :disabled="!usuIdValido" @click="guardarCuenta" />

            </div>

        </div>

        <!-- LOADER -->
        <AppLoader :show="loading" text="Guardando cuenta..." />

        <!-- SNACKBAR -->
        <AppSnackbar ref="snackbarRef" />

        <!-- FILE -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    </div>

</template>
<script setup>

import {
    ref,
    onMounted,
    computed
}
    from 'vue'

import axios
    from 'axios'

import HeaderBack
    from '../../../../components/layout/HeaderBack.vue'

import ProfileHeader
    from './components/ProfileHeader.vue'

import ProfileAvatar
    from './components/ProfileAvatar.vue'

import ProfileForm
    from './components/ProfileForm.vue'

import NextButton
    from './components/NextButton.vue'

import AppLoader
    from '../../../../components/layout/AppLoader.vue'

import AppSnackbar
    from '../../../../components/layout/AppSnackbar.vue'

import {
    useUsuario
}
    from '../../../../services/usuarioService'

import {
    firma
}
    from '../../../../services/security'
import {
    useRouter
}
    from 'vue-router'


/* =========================================
   🔥 API
========================================= */

const API =
    import.meta.env
        .VITE_PUBLIC_URL_BASE
const router =
    useRouter()

const API_FLASK =
    import.meta.env
        .VITE_PUBLIC_URL_FLASK

const usuIdValido =
    computed(() => {

        return Number(
            getUsuId()
        ) > 0

    })

/* =========================================
   🔥 USER
========================================= */

const {

    getUsuId,

    setCampo

} =
    useUsuario()

/* =========================================
   🔥 STATE
========================================= */

const usuario =
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

const form =
    ref({

        nombres_apellidos: '',

        email: '',

        celular: '',

        fecha_nacimiento: ''

    })

/* =========================================
   🔥 INIT
========================================= */

onMounted(() => {

    cargarUsuario()

})

/* =========================================
   🔥 DETALLE
========================================= */

async function cargarUsuario() {

    try {

        const r =
            await axios.post(

                `${API}/ZYhL/detalleUsu`,

                {

                    usu_id:
                        getUsuId()

                }

            )

        if (r.data.ok) {

            usuario.value =
                r.data.usuario

            form.value = {

                nombres_apellidos:
                    r.data.usuario?.nombres_apellidos || '',

                email:
                    r.data.usuario?.email || '',

                celular:
                    r.data.usuario?.celular || '',

                fecha_nacimiento:
                    r.data.usuario?.fecha_nacimiento || ''

            }

        }

    } catch (e) {

        console.error(e)

    }

}

/* =========================================
   🔥 IMAGE PICKER
========================================= */

function selectImage() {

    fileInput.value?.click()

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
   🔥 CANCEL IMAGE
========================================= */

function cancelImage() {

    previewImage.value =
        null

    selectedFile.value =
        null

    uploadedImageUrl.value =
        ''

}

/* =========================================
   🔥 UPLOAD IMAGE
========================================= */

async function uploadImage() {

    if (!selectedFile.value) {
        return
    }

    try {

        isUploadingImage.value =
            true

        /* =========================================
           🔥 CONVERTIR JPG
        ========================================= */

        const optimizedFile =
            await optimizeImage(
                selectedFile.value
            )

        /* =========================================
           🔥 FORMDATA
        ========================================= */

        const fd =
            new FormData()

        fd.append(
            'file',
            optimizedFile
        )

        /* =========================================
           🔥 UPLOAD
        ========================================= */

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

        if (!job_id) {

            throw new Error(
                'job_id inválido'
            )

        }

        /* =========================================
           🔥 POLLING
        ========================================= */

        await pollJob(job_id)

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
   🔥 OPTIMIZE IMAGE
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

                        /* =========================================
                           🔥 SIZE
                        ========================================= */

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

                            (blob) => {

                                if (!blob) {

                                    reject(
                                        new Error(
                                            'No se pudo convertir imagen'
                                        )
                                    )

                                    return

                                }

                                const optimized =
                                    new File(

                                        [blob],

                                        'avatar.jpg',

                                        {

                                            type:
                                                'image/jpeg'

                                        }

                                    )

                                console.log(

                                    '🖼️ ORIGINAL:',
                                    file.size

                                )

                                console.log(

                                    '✨ OPTIMIZED:',
                                    optimized.size

                                )

                                resolve(
                                    optimized
                                )

                            },

                            'image/jpeg',

                            0.7

                        )

                    }

                img.onerror =
                    reject

                img.src =
                    e.target.result

            }

        reader.onerror =
            reject

        reader.readAsDataURL(
            file
        )

    })

}

/* =========================================
   🔥 POLLING
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

                    const status =
                        r.data.status

                    console.log(
                        '📦 STATUS:',
                        status
                    )

                    /* =========================================
                       🔥 FINISHED
                    ========================================= */

                    if (status === 'finished') {

                        clearInterval(interval)

                        const result =
                            r.data.result

                        if (

                            result?.ok

                            &&

                            result?.url

                        ) {

                            uploadedImageUrl.value =
                                result.url

                            previewImage.value =
                                result.url

                            snackbarRef.value?.open(
                                'Imagen subida correctamente'
                            )

                            resolve(result)

                            return

                        }

                        reject(result)

                    }

                    /* =========================================
                       🔥 FAILED
                    ========================================= */

                    if (status === 'failed') {

                        clearInterval(interval)

                        reject(
                            r.data
                        )

                    }

                } catch (e) {

                    clearInterval(interval)

                    reject(e)

                }

            }, 2000)

    })

}

function navegarCrearTienda() {

    router.push(
        '/TyB3_crear_tienda'
    )

}

/* =========================================
   🔥 GUARDAR
========================================= */

async function guardarCuenta() {

    try {

        loading.value = true

        const seguridad =
            firma()

        const payload = {

            usu_id:
                getUsuId(),

            nombres_apellidos:
                form.value.nombres_apellidos,

            email:
                form.value.email,

            celular:
                form.value.celular,

            fecha_nacimiento:
                form.value.fecha_nacimiento,

            img_perfil:
                uploadedImageUrl.value
                ||
                usuario.value?.img_perfil
                ||
                '',

            xin:
                seguridad.xin,

            yuan:
                seguridad.yuan

        }

        console.log(
            '📦 guardarCuenta:',
            payload
        )

        const r =
            await axios.post(

                `${API}/RhM4/editarCuentaUsu`,

                payload

            )

        console.log(
            '✅ guardarCuenta:',
            r.data
        )

        /* =========================================
           🔥 OK
        ========================================= */

        if (r.data.res === 'ok') {

            /* =========================================
               🔥 UPDATE STORAGE
            ========================================= */

            setCampo(
                'nombres_apellidos',
                form.value.nombres_apellidos
            )

            setCampo(
                'email',
                form.value.email
            )

            setCampo(
                'celular',
                form.value.celular
            )

            if (uploadedImageUrl.value) {

                setCampo(
                    'img_perfil',
                    uploadedImageUrl.value
                )

            }

            snackbarRef.value?.open(

                r.data.msg
                ||
                'Cuenta actualizada'

            )

            return

        }

        /* =========================================
           🔥 ERROR
        ========================================= */

        snackbarRef.value?.open(

            r.data.msg
            ||
            'Ocurrió un error'

        )

    } catch (e) {

        console.error(e)

        snackbarRef.value?.open(
            'Error guardando cuenta'
        )

    } finally {

        loading.value = false

    }

}

</script>

<style scoped>
.content-container {

    width: 100%;

    max-width: 1400px;

    margin: auto;

    padding-top: 50px;

    padding-left: 20px;

    padding-right: 20px;

    padding-bottom: 40px;

}

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
</style>