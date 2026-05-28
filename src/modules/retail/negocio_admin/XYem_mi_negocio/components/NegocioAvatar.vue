<template>

    <div class="
            flex
            flex-col
            items-center
            mt-5
        ">

        <!-- AVATAR -->
        <div class="relative">

            <!-- IMG -->
            <img :src="previewImage

                ||

                negocio?.img_logo

                ||

                'https://barsi-img.b-cdn.net/recursos/sg3f.png'

                " class="
                    w-28
                    h-28

                    rounded-full

                    object-cover

                    border-4
                    border-white

                    shadow-2xl
                " />

            <!-- EDIT -->
            <button v-if="
                !previewImage
            " class="
                    absolute
                    bottom-0
                    right-0

                    w-10
                    h-10

                    rounded-full

                    bg-cyan-500

                    text-white

                    shadow-lg

                    flex
                    items-center
                    justify-center

                    active:scale-95

                    transition
                " @click="
                    $emit('select-image')
                    ">

                <i class="
                        fa
                        fa-camera
                    ">

                </i>

            </button>

            <!-- UPLOAD -->
            <button v-if="
                previewImage
            " class="
                    absolute
                    bottom-0
                    left-0

                    w-10
                    h-10

                    rounded-full

                    bg-emerald-500

                    text-white

                    shadow-lg

                    flex
                    items-center
                    justify-center

                    active:scale-95

                    transition
                " @click="
                    $emit('upload-image')
                    ">

                <i v-if="
                    !isUploading
                " class="
                        fa
                        fa-check
                    ">

                </i>

                <i v-else class="
                        fa
                        fa-spinner
                        fa-spin
                    ">

                </i>

            </button>

            <!-- CANCEL -->
            <button v-if="
                previewImage
            " class="
                    absolute
                    bottom-0
                    right-0

                    w-10
                    h-10

                    rounded-full

                    bg-red-500

                    text-white

                    shadow-lg

                    flex
                    items-center
                    justify-center

                    active:scale-95

                    transition
                " @click="
                    $emit('cancel-image')
                    ">

                <i class="
                        fa
                        fa-times
                    ">

                </i>

            </button>

        </div>

        <!-- INFO -->
        <div class="
                mt-4
                text-center
            ">

            <!-- NAME -->
            <div class="
                    text-xl
                    font-black
                    text-gray-800
                ">

                {{

                    negocio?.nombre

                    ||

                    'Mi Negocio'

                }}

            </div>

            <!-- COD -->
            <div class="
                    mt-1

                    text-sm

                    text-gray-400
                ">

                {{

                    negocio?.cod_neg

                    ||

                    '---'

                }}

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({

    negocio: Object,

    previewImage: String,

    isUploading: Boolean

})

defineEmits([

    'select-image',

    'upload-image',

    'cancel-image'

])

</script>