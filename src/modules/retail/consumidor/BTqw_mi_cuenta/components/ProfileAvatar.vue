<template>

    <div class="
            flex
            flex-col
            items-center
            mt-4
        ">

        <!-- FOTO -->
        <div class="relative">

            <img :src="usuario?.img_perfil
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
            <div class="
                    absolute
                    bottom-0
                    right-0
                    bg-white
                    p-2
                    rounded-full
                    shadow
                ">

                <i class="
                        fa
                        fa-pencil
                        text-xs
                        text-gray-600
                    ">

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

    usuario: Object

})

</script>