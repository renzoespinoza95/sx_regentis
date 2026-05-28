<template>

    <div v-if="visible" class="
            fixed
            inset-0

            bg-black/40
            backdrop-blur-sm

            z-50

            flex
            items-center
            justify-center

            p-4
        ">

        <div class="
                bg-white

                rounded-3xl

                p-5

                w-full
                max-w-lg

                max-h-[90vh]

                overflow-y-auto
            ">

            <!-- TITLE -->
            <div class="
                    text-xl
                    font-black
                    mb-4
                ">

                Membresía 💎

            </div>

            <!-- GALERIA -->
            <YaplinGallery :yaplins="[]" />

            <!-- UPLOADER -->
            <YaplinUploader />

            <!-- CLOSE -->
            <button class="
                    w-full
                    mt-4
                    h-14

                    rounded-2xl

                    bg-red-500

                    text-white

                    font-bold
                " @click="close">

                Cerrar

            </button>

        </div>

    </div>

</template>

<script setup>

import {
    ref
}
    from 'vue'

import YaplinGallery
    from '../../../../../components/YaplinGallery.vue'

import YaplinUploader
    from '../../../../../components/YaplinUploader.vue'

const visible =
    ref(false)

function open() {

    visible.value =
        true

}

function close() {

    visible.value =
        false

}

defineExpose({

    open

})

</script>