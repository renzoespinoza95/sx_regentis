<template>

    <div class="
            flex
            flex-col
            items-center
            mt-4
        ">

        <!-- FOTO -->
        <div class="relative">

            <img :src="previewImage

                ||

                usuario?.img_perfil

                ||

                'https://i.pravatar.cc/100'

                " class="
                    w-24
                    h-24
                    rounded-full
                    object-cover
                    border-4
                    border-white
                    shadow-xl
                " />

            <!-- EDIT -->
            <div v-if="!previewImage" class="
                    absolute
                    bottom-0
                    right-0
                    bg-white
                    p-2
                    rounded-full
                    shadow
                    cursor-pointer
                " @click="$emit('select-image')">

                <i class="
                        fa
                        fa-pencil
                        text-xs
                        text-gray-600
                    ">

                </i>

            </div>

            <!-- OK -->
            <div v-if="previewImage" class="
                    absolute
                    bottom-0
                    left-0

                    w-8
                    h-8

                    rounded-full

                    bg-green-500

                    flex
                    items-center
                    justify-center

                    text-white

                    shadow-lg

                    cursor-pointer

                    active:scale-95

                    transition
                " @click="$emit('upload-image')">

                <i v-if="!isUploading" class="fa fa-check">

                </i>

                <i v-else class="fa fa-spinner fa-spin">

                </i>

            </div>

            <!-- CANCEL -->
            <div v-if="previewImage" class="
                    absolute
                    bottom-0
                    right-0

                    w-8
                    h-8

                    rounded-full

                    bg-red-500

                    flex
                    items-center
                    justify-center

                    text-white

                    shadow-lg

                    cursor-pointer

                    active:scale-95

                    transition
                " @click="$emit('cancel-image')">

                <i class="fa fa-times">

                </i>

            </div>

        </div>

        <!-- INFO -->
        <div class="mt-4 text-center">

            <div class="
                    font-black
                    text-lg
                    text-gray-800
                ">

                {{
                    usuario?.nombres_apellidos
                    || 'Usuario'
                }}

            </div>

            <div class="
                    text-sm
                    text-gray-400
                    mt-1
                ">

                {{
                    usuario?.cod_usu
                    || '---'
                }}

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({

    usuario: Object,

    previewImage: String,

    isUploading: Boolean

})

defineEmits([

    'select-image',

    'cancel-image',

    'upload-image'

])

</script>