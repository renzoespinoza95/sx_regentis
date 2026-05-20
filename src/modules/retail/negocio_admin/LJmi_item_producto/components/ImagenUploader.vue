<!-- =========================================
ImagenUploader.vue
========================================= -->

<template>

    <div class="
            flex
            flex-col
            items-center
            gap-4
            py-3
        ">

        <div class="
                flex
                gap-4
            ">

            <img src="https://picsum.photos/80" class="
                    w-14
                    h-14
                    rounded-full
                    object-cover
                " />

            <img src="https://picsum.photos/81" class="
                    w-14
                    h-14
                    rounded-full
                    object-cover
                " />

        </div>

        <div class="
                relative
            ">

            <img src="https://picsum.photos/300" class="
                    w-40
                    h-40
                    rounded-full
                    object-cover
                    border-[8px]
                    border-[#f3ddd3]
                    shadow-[0_10px_22px_rgba(171,115,84,0.10)]
                " />

            <div class="
                    absolute
                    bottom-2
                    right-2
                    w-8
                    h-8
                    rounded-full
                    bg-black
                    text-white
                    flex
                    items-center
                    justify-center
                ">

                <i class="
                        fa
                        fa-camera
                    "></i>

            </div>

        </div>

    </div>

</template>