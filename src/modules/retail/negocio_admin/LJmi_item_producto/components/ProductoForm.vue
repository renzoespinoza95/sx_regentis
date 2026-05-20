<!-- =========================================
ProductoForm.vue
========================================= -->

<template>

    <div class="space-y-5">

        <InputField label="Nombre" v-model="form.nombre" />

        <div class="
                grid
                grid-cols-2
                gap-4
            ">

            <InputField label="Precio" v-model="form.precio" />

            <InputField label="Cantidad" v-model="form.cantidad" />

        </div>

        <CategoriaPills :items="categorias" v-model="seleccionadas" />

        <DescripcionBox v-model="form.descripcion" />

        <ImagenUploader />

        <SaveButton />

    </div>

</template>

<script setup>

import { ref }
    from 'vue'

import InputField
    from './InputField.vue'

import CategoriaPills
    from './CategoriaPills.vue'

import DescripcionBox
    from './DescripcionBox.vue'

import ImagenUploader
    from './ImagenUploader.vue'

import SaveButton
    from './SaveButton.vue'

const form = ref({

    nombre:
        '',

    precio:
        '',

    cantidad:
        '',

    descripcion:
        ''

})

const categorias = ref([

    {
        id: 1,
        nombre: 'abarrotes',
        emoji: '🛒'
    },

    {
        id: 2,
        nombre: 'frutas',
        emoji: '🍎'
    },

    {
        id: 3,
        nombre: 'verduras',
        emoji: '🥬'
    },

    {
        id: 4,
        nombre: 'carnes',
        emoji: '🥩'
    }

])

const seleccionadas = ref([
    1,
    2
])

</script>