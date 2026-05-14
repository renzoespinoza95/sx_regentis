<template>

    <div class="bg-white rounded-xl shadow-md p-3 flex items-center gap-3">

        <!-- FOTO -->
        <img :src="item.img_perfil || 'https://picsum.photos/60'" class="w-12 h-12 rounded-lg object-cover" />

        <!-- INFO -->
        <div class="flex-1">

            <!-- TOP -->
            <div class="flex justify-between text-sm font-semibold">

                <span>

                    {{
                        item.nombres_apellidos
                        || item.sobrenombre
                    }}

                </span>

                <span>

                    {{
                        item.celular || '-'
                    }}

                </span>

            </div>

            <!-- BOTTOM -->
            <div class="flex justify-between text-xs text-gray-500 mt-1">

                <span>

                    {{
                        item.tipo_usuario
                        || 'Trabajador'
                    }}

                </span>

                <span>

                    DNI:
                    {{
                        item.dni || '-'
                    }}

                </span>

            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({
    item: Object
})

</script>