<!-- =========================================
HeaderBar.vue
========================================= -->

<template>

    <div class="
            sticky
            top-0
            z-50
            h-[72px]
            px-4
            flex
            items-center
            justify-between
            shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        " style="background:#FD7635">

        <div class="flex items-center gap-3">

            <div class="
                    w-10
                    h-10
                    rounded-full
                    bg-white
                    flex
                    items-center
                    justify-center
                ">

                <i class="
                        fa
                        fa-arrow-left
                        text-[#FD7635]
                    "></i>

            </div>

            <span class="
                    text-white
                    font-semibold
                    text-[18px]
                ">
                Agregar producto
            </span>

        </div>

        <div class="
                w-10
                h-10
                rounded-full
                bg-white
                flex
                items-center
                justify-center
            ">

            <i class="
                    fa
                    fa-ellipsis-v
                    text-[#FD7635]
                "></i>

        </div>

    </div>

</template>