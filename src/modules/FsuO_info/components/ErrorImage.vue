<!-- src/modules/FsuO_info/components/ErrorImage.vue -->
<template>

    <div class="bg-white rounded-[30px] p-4 shadow-xl border border-gray-100
           max-w-[520px]">

        <img src="https://picsum.photos/900/700" class="w-full h-[260px] md:h-[320px] object-cover rounded-[24px]">

        <div class="mt-4">

            <div class="flex items-center gap-2 text-gray-700 font-semibold text-lg">

                <i class="fa fa-map-signs text-[#FD7635]"></i>

                Ruta no encontrada

            </div>

            <p class="text-gray-500 text-sm mt-2 leading-relaxed">

                Parece que esta página ya no existe o fue movida.
                Puedes volver al inicio y seguir navegando normalmente.

            </p>

        </div>

    </div>

</template>

<script setup>
</script>