<template>

    <Transition name="ira">

        <button v-if="visible" type="button" class="ira-btn" :class="{ 'ira-con-menu': isLogged }"
            aria-label="Ir al inicio" title="Ir al inicio" @click="irArriba">

            <i class="fa fa-arrow-up"></i>

        </button>

    </Transition>

</template>

<script setup>

import { onMounted, onUnmounted, ref } from 'vue'
import { useUsuario } from '../../../../../services/usuarioService.js'

/* =========================================
   CONSTANTES
========================================= */

/* Píxeles que hay que bajar para que aparezca el botón */
const UMBRAL = 300

/* =========================================
   ESTADO
========================================= */

const { isLogged } = useUsuario()

const visible = ref(false)

/* =========================================
   ACCIONES
========================================= */

function actualizar() {

    visible.value = window.scrollY > UMBRAL

}

function irArriba() {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })

}

/* =========================================
   CICLO DE VIDA
========================================= */

onMounted(() => {

    window.addEventListener('scroll', actualizar, { passive: true })

    actualizar()

})

onUnmounted(() => {

    window.removeEventListener('scroll', actualizar)

})

</script>

<style scoped>
.ira-btn {
    position: fixed;
    right: 1.25rem;
    bottom: 1.5rem;
    z-index: 40;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 50%;
    background: var(--primary, #fd7635);
    color: var(--on-primary, #fff);
    font-size: 1.15rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    transition: filter 0.2s;
}

.ira-btn:hover {
    filter: brightness(1.1);
}

.ira-btn:active {
    filter: brightness(0.95);
}

/* Con sesión iniciada hay barra inferior y botón de chat:
   se coloca encima de ambos. */
.ira-con-menu {
    bottom: 10.25rem;
}

/* ---------- Transición ---------- */

.ira-enter-active,
.ira-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.ira-enter-from,
.ira-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>