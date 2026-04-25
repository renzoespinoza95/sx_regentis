<template>
    <div class="relative group">

        <!-- IMAGEN -->
        <div
            class="w-40 h-40 md:w-48 md:h-48 rounded-full bg-blue-500 overflow-hidden flex items-center justify-center shadow-md">
            <img v-if="preview" :src="preview" class="w-full h-full object-cover" />

            <span v-else class="text-white text-sm">Imagen</span>
        </div>

        <!-- BOTON CAMARA -->
        <label
            class="absolute bottom-2 right-2 bg-black text-white w-8 h-8 flex items-center justify-center rounded-full cursor-pointer shadow">
            <i class="fa fa-camera"></i>
            <input type="file" class="hidden" @change="onFile" />
        </label>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const preview = ref(null)

watch(() => props.modelValue, v => {
    preview.value = v
})

const onFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        preview.value = reader.result
    }
    reader.readAsDataURL(file)

    emit('update:modelValue', file) // 🔥 file real
}
</script>