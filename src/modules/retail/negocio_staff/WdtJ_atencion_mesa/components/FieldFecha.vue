<template>

    <div class="text-sm space-y-1">

        <div class="text-gray-500">
            Fecha
        </div>

        <div class="font-medium text-gray-800">
            {{ fechaFormateada }}
        </div>

    </div>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    value: String
})

const fechaFormateada = computed(() => {
    if (!props.value) return ''

    const d = new Date(props.value)

    const dia = String(d.getDate()).padStart(2, '0')
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const anio = d.getFullYear()

    let horas = d.getHours()
    const minutos = String(d.getMinutes()).padStart(2, '0')

    const ampm = horas >= 12 ? 'pm' : 'am'
    horas = horas % 12 || 12

    return `${dia}/${mes}/${anio} ${horas}:${minutos} ${ampm}`
})
</script>
