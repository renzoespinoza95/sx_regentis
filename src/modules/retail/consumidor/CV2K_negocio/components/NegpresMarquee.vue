<template>

    <div v-if="items.length" class="tn-topbar" aria-label="Anuncios">

        <div class="tn-marquee">

            <span v-for="(t, i) in loop" :key="i">

                <i class="fa fa-star"></i>{{ t }}

            </span>

        </div>

    </div>

</template>

<script setup>

import { computed } from 'vue'

const props = defineProps({

    negocio: {
        type: Object,
        default: null
    }

})

const items = computed(() => {

    const n = props.negocio || {}

    return [

        n.nombre ? `Bienvenido a ${n.nombre}` : '',

        n.puesto ? `Puesto ${n.puesto}` : '',

        n.direccion || '',

        n.ciudad || ''

    ]
        .map(t => String(t).trim())
        .filter(Boolean)

})

/* Cada mitad es identica => el bucle no da saltos */
const loop = computed(() => {

    const base = Array.from(
        { length: 3 },
        () => items.value
    ).flat()

    return [...base, ...base]

})

</script>