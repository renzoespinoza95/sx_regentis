<template>

    <footer class="tn-footer">

        <div class="tn-container">

            <div class="tn-brand">

                <img class="tn-brand-logo" :src="negocio?.img_logo || LOGO_DEFAULT" alt="Logo">

                <span class="tn-brand-name">{{ negocio?.nombre }}</span>

            </div>

            <p v-if="negocio?.descripcion" class="tn-footer-text">
                {{ negocio.descripcion }}
            </p>

            <p v-if="direccionTexto" class="tn-footer-line">
                <i class="fa fa-map-marker"></i> {{ direccionTexto }}
            </p>

            <a v-if="whatsappUrl" :href="whatsappUrl" target="_blank" rel="noopener" class="tn-btn-pill tn-btn-pill-lg">

                <i class="fa fa-whatsapp"></i> Escríbenos

            </a>

            <p class="tn-copy">
                © {{ anio }} {{ negocio?.nombre }}. Todos los derechos reservados.
            </p>

        </div>

    </footer>

</template>

<script setup>

import { computed } from 'vue'

const LOGO_DEFAULT =
    'https://barsi-img.b-cdn.net/recursos/logo-regentis.png'

const props = defineProps({

    negocio: {
        type: Object,
        default: null
    }

})

const anio = new Date().getFullYear()

const direccionTexto = computed(() => {

    const n = props.negocio || {}

    return [

        n.direccion,

        n.ciudad

    ]
        .map(t => String(t || '').trim())
        .filter(Boolean)
        .join(', ')

})

const whatsappUrl = computed(() => {

    const numero = String(
        props.negocio?.celular_informes || ''
    ).replace(/\D/g, '')

    if (!numero) return ''

    const completo = numero.length <= 9
        ? '51' + numero
        : numero

    return `https://wa.me/${completo}`

})

</script>