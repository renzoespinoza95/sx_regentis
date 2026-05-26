<template>

    <div>

        <!-- EMPTY -->
        <div v-if="!imagenes.length" class="
                h-32

                rounded-3xl

                bg-[#fff4ee]

                flex
                items-center
                justify-center

                text-gray-400

                text-sm
            ">

            Sin imágenes 😢

        </div>

        <!-- GRID -->
        <div v-else class="
                grid
                grid-cols-4
                gap-2
            ">

            <div v-for="img in imagenes" :key="img.product_image_id" class="
                    relative

                    rounded-2xl

                    overflow-hidden

                    bg-[#fff4ee]

                    aspect-[3/4]

                    shadow-[0_4px_12px_rgba(0,0,0,0.08)]

                    group
                ">

                <!-- IMAGE -->
                <img :src="img.img" class="
                        w-full
                        h-full

                        object-cover

                        transition

                        group-hover:scale-105
                    ">

                <!-- PRINCIPAL -->
                <div v-if="
                    Number(img.orden) === 1
                " class="
                        absolute

                        top-1
                        left-1

                        px-2
                        py-1

                        rounded-full

                        bg-[#FD7635]

                        text-white

                        text-[10px]

                        font-bold

                        shadow-lg
                    ">

                    Principal

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({

    imagenes: {

        type: Array,

        default: () => []

    }

})

</script>