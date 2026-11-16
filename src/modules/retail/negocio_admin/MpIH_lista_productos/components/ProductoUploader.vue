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
        <!-- EMPTY -->
        <div v-if="!previews.length" class="
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

                Subir imágenes

            </div>

            <div class="
        text-sm
        text-gray-500
        mt-1
    ">

                Puedes seleccionar varias imágenes

            </div>

        </div>

        <!-- PREVIEW -->
        <div v-if="previews.length" class="
        grid
        grid-cols-4
        gap-3
    ">

            <div v-for="(

img,

    index

        )

        in

        previews" :key="index" class="
            relative
        ">

                <img :src="img" class="
                w-full

                aspect-[3/4]

                object-cover

                rounded-2xl

                border
            ">

                <!-- ELIMINAR -->
                <button class="
                absolute

                -top-2
                -right-2

                w-7
                h-7

                rounded-full

                bg-red-500

                text-white

                text-xs

                shadow-lg

                active:scale-90
            " @click="
                eliminarPreview(
                    index
                )
                ">

                    ✕

                </button>

            </div>

        </div>

        <!-- INPUT -->
        <input ref="fileRef" type="file" accept="image/*" multiple class="hidden" @change="onFile">

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

                Seleccionar imágenes

            </button>

            <!-- UPLOAD -->
            <button v-if="previews.length" :disabled="subiendo" class="
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

                        'Subir imagenes'

                }}

            </button>

        </div>

    </div>

    <GsapToast ref="toastRef" />

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

import {
    firma
}
    from '../../../../../services/security'
import AppLoader
    from '../../../../../components/layout/AppLoader.vue'

import GsapToast
    from '../../../../../components/layout/GsapToast.vue'
import { useUsuario } from '../../../../../services/usuarioService.js'

/* =========================================
🔥 VARIABLES DE ENTORNO BUNNY CDN
========================================= */
const BUNNY_ZONE = import.meta.env.VITE_PUBLIC_BUNNY_STORAGE_ZONE
const BUNNY_KEY = import.meta.env.VITE_PUBLIC_BUNNY_STORAGE_ACCESSKEY
const BUNNY_HOST = import.meta.env.VITE_PUBLIC_BUNNY_STORAGE_HOST
const BUNNY_CDN_BASE = import.meta.env.VITE_PUBLIC_BUNNY_CDN_BASE

// 👈 EXTRAER LA FUNCIÓN
const { getNegIdTienda } = useUsuario()

const props =
    defineProps({

        producto: Object

    })

const fileRef =
    ref(null)

const files =
    ref([])

const previews =
    ref([])

const subiendo =
    ref(false)

const toastRef =
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

    const lista =

        Array.from(

            e.target.files || []

        )

    if (

        !lista.length

    ) {

        return

    }

    files.value.push(

        ...lista

    )

    previews.value.push(

        ...lista.map(

            x =>

                URL.createObjectURL(

                    x

                )

        )

    )

    if (

        fileRef.value

    ) {

        fileRef.value.value = ''

    }

}

function eliminarPreview(index) {

    URL.revokeObjectURL(

        previews.value[index]

    )

    previews.value.splice(

        index,

        1

    )

    files.value.splice(

        index,

        1

    )

}

/* =========================================
🔥 SUBIR IMÁGENES A BUNNY (REEMPLAZO DIRECTO)
========================================= */
async function subirImagen() {
    try {
        if (!files.value.length) return;

        subiendo.value = true;
        loading.value = true;

        // 1. Obtener neg_id dinámico de la tienda activa (o desde el producto como fallback)
        const rawNegId = getNegIdTienda() || props.producto?.neg_id || 0;
        const folderName = String(rawNegId).padStart(4, '0');

        console.log('📁 Carpeta destino Bunny CDN:', folderName); // Para verificar en consola

        // 2. Subir cada imagen procesada al Storage de Bunny
        for (const archivoOriginal of files.value) {
            const archivoReducido = await reducirImagen(archivoOriginal);

            // Generar nombre único
            const hashUnico = Math.random().toString(36).substring(2, 10);
            const fileName = `${Date.now()}_${hashUnico}.jpg`;

            const uploadUrl = `https://${BUNNY_HOST}/${BUNNY_ZONE}/${folderName}/${fileName}`;

            // Petición PUT directa al Storage de Bunny CDN
            await axios.put(uploadUrl, archivoReducido, {
                headers: {
                    'AccessKey': BUNNY_KEY,
                    'Content-Type': 'application/octet-stream'
                }
            });

            // 3. Construir la URL pública y guardarla en MariaDB
            const urlPublicaCDN = `${BUNNY_CDN_BASE}/${folderName}/${fileName}`;
            await guardarImagenProducto(urlPublicaCDN);
        }

        // Limpiar el estado visual
        previews.value.forEach(x => URL.revokeObjectURL(x));
        previews.value = [];
        files.value = [];

        if (fileRef.value) fileRef.value.value = '';

        toastRef.value?.show({
            text: 'Imágenes subidas a Bunny CDN correctamente ✨',
            type: 'success'
        });

    } catch (e) {
        console.error("Error al subir a Bunny CDN:", e);
        toastRef.value?.show({
            text: 'Ocurrió un error al subir la imagen ❌',
            type: 'error'
        });
    } finally {
        loading.value = false;
        subiendo.value = false;
    }
}

/* =========================================
🔥 VERIFICAR Y CREAR DIRECTORIO EN BUNNY
========================================= */
async function asegurarDirectorioBunny(folderName) {
    // La barra final '/' indica a Bunny que es un directorio
    const dirUrl = `https://${BUNNY_HOST}/${BUNNY_ZONE}/${folderName}/`;

    try {
        await axios.get(dirUrl, {
            headers: { AccessKey: BUNNY_KEY }
        });
    } catch (error) {
        // Si devuelve 404, el directorio no existe; lo creamos
        if (error.response && error.response.status === 404) {
            await axios.put(dirUrl, null, {
                headers: { AccessKey: BUNNY_KEY }
            });
        } else {
            throw error;
        }
    }
}

/* =========================================
🔥 REDUCIR IMAGEN
========================================= */

async function reducirImagen(fileOriginal) {

    return new Promise((resolve, reject) => {

        const img = new Image()
        const reader = new FileReader()

        reader.onload = e => {
            img.src = e.target.result
        }

        reader.onerror = reject

        img.onload = () => {

            /* =========================================
               🔥 SIZE (Actualizado a 1200px)
            ========================================= */

            const maxWidth = 1200; // Antes 800

            let width = img.width
            let height = img.height

            if (width > maxWidth) {
                height = height * (maxWidth / width)
                width = maxWidth
            }

            /* =========================================
               🔥 CANVAS
            ========================================= */

            const canvas = document.createElement('canvas')

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)

            /* =========================================
               🔥 JPG 90% (Actualizado a 0.9)
            ========================================= */

            canvas.toBlob(
                blob => {
                    if (!blob) {
                        reject()
                        return
                    }

                    const nuevoFile = new File(
                        [blob],
                        'producto.jpg',
                        { type: 'image/jpeg' }
                    )

                    resolve(nuevoFile)
                },
                'image/jpeg',
                0.9 // Antes 0.7
            )
        }

        img.onerror = reject
        reader.readAsDataURL(fileOriginal)
    })
}

/* =========================================
🔥 GUARDAR PRODUCTO
========================================= */
async function guardarImagenProducto(url) {

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

    const nuevaImagen =

        r.data

    if (

        nuevaImagen?.img

    ) {

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

}

</script>