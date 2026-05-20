<template>

    <div>

        <div class="
            text-sm
            font-semibold
            text-gray-700
            mb-4
        ">

            Es su negocio un restaurante

        </div>

        <div class="flex items-center gap-10">

            <!-- SI -->
            <button class="
                    flex
                    items-center
                    gap-3
                " @click="
                    modelValue = 'si'
                    ">

                <div class="
                        w-8
                        h-8

                        rounded-md

                        border-2

                        flex
                        items-center
                        justify-center

                        transition-all
                    " :class="modelValue === 'si'

                            ?

                            'bg-[#FD7635] border-[#FD7635] text-white'

                            :

                            'bg-white border-gray-400 text-transparent'

                        ">

                    <i class="fa fa-check"></i>

                </div>

                <span class="text-gray-700 font-medium">
                    si
                </span>

            </button>

            <!-- NO -->
            <button class="
                    flex
                    items-center
                    gap-3
                " @click="
                    modelValue = 'no'
                    ">

                <div class="
                        w-8
                        h-8

                        rounded-md

                        border-2

                        flex
                        items-center
                        justify-center

                        transition-all
                    " :class="modelValue === 'no'

                            ?

                            'bg-[#FD7635] border-[#FD7635] text-white'

                            :

                            'bg-white border-gray-400 text-transparent'

                        ">

                    <i class="fa fa-check"></i>

                </div>

                <span class="text-gray-700 font-medium">
                    no
                </span>

            </button>

        </div>

    </div>

</template>

<script setup>

const modelValue =
    defineModel({

        default: 'no'

    })

</script>