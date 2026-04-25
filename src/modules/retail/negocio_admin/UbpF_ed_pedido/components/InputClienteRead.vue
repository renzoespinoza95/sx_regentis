<template>

    <div>
        <label class="text-sm text-gray-600">Cliente</label>

        <!-- 🔥 INPUT SOLO LECTURA PREMIUM -->
        <div
            class="mt-1 border rounded-md px-3 py-2 text-sm bg-gray-100 flex items-center justify-between cursor-not-allowed">

            <!-- TEXTO -->
            <span class="text-gray-700">
                {{ value }}
            </span>

            <!-- 🔥 ICONO BLOQUEADO -->
            <div class="ml-2 flex items-center">

                <div class="w-6 h-6 rounded-full flex items-center justify-center bg-gray-200">
                    <i class="fa fa-lock text-xs text-gray-500"></i>
                </div>

            </div>

        </div>

    </div>

</template>

<script setup>
defineProps({
    value: String
})
</script>