<template>

    <div class="mt-6 space-y-4">

        <!-- NOMBRES -->
        <InputField v-model="form.nombres_apellidos" label="Nombres y apellidos" placeholder="Tu nombre completo" />

        <!-- EMAIL -->
        <InputField v-model="form.email" type="email" label="Email" placeholder="correo@email.com" />

        <!-- CELULAR -->
        <InputField v-model="form.celular" label="Celular" placeholder="999999999" />

        <!-- FECHA -->
        <InputField v-model="form.fecha_nacimiento" type="date" label="Fecha nacimiento" />

        <!-- UBICACION -->
        <button class="
                w-full
                h-14
                rounded-2xl
                bg-blue-500
                text-white
                font-bold
                shadow-lg
                active:scale-[0.98]
                transition
            ">

            📍 Ubicación

        </button>

        <!-- TERMINOS -->
        <button class="
                w-full
                h-14
                rounded-2xl
                bg-gray-800
                text-white
                font-bold
                shadow-lg
                active:scale-[0.98]
                transition
            ">

            📄 Términos y condiciones

        </button>

        <!-- PRIVACIDAD -->
        <button class="
                w-full
                h-14
                rounded-2xl
                bg-purple-600
                text-white
                font-bold
                shadow-lg
                active:scale-[0.98]
                transition
            ">

            🔒 Políticas de privacidad

        </button>

    </div>

</template>

<script setup>

import InputField
    from './InputField.vue'

defineProps({

    form: Object

})

defineEmits([

    'crear-tienda'

])

</script>