<template>

  <section class="tn-hero">

    <!-- Slides: solo la imagen, sin capas ni textos encima -->
    <div ref="scrollContainer" class="tn-hero-scroll" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"
      @mouseleave="stopDrag" @scroll.passive="onScroll">

      <div v-for="(item, index) in slides" :key="index" class="tn-slide" @click="abrirStory(index)">

        <img v-if="item.img" :src="item.img" :alt="item.alt" draggable="false">

        <!-- Sin banners: portada simple con el nombre -->
        <div v-else class="hero-vacio">
          {{ item.alt }}
        </div>

      </div>

    </div>

    <!-- Flechas e indicadores -->
    <template v-if="slides.length > 1">

      <button class="tn-arrow prev" type="button" aria-label="Anterior" @click="goToSlide(currentIndex - 1)">
        <i class="fa fa-chevron-left"></i>
      </button>

      <button class="tn-arrow next" type="button" aria-label="Siguiente" @click="goToSlide(currentIndex + 1)">
        <i class="fa fa-chevron-right"></i>
      </button>

      <div class="tn-dots">
        <button v-for="(s, i) in slides" :key="i" type="button" :class="{ active: currentIndex === i }"
          :aria-label="'Ir a ' + (i + 1)" @click="goToSlide(i)"></button>
      </div>

    </template>

    <!-- Olas -->
    <svg class="tn-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path class="tn-w1" d="M0,30 C240,90 480,0 720,35 S1200,90 1440,30 V120 H0Z" />
      <path class="tn-w2" d="M0,50 C240,110 480,20 720,55 S1200,110 1440,50 V120 H0Z" />
      <path class="tn-w3" d="M0,68 C240,125 480,38 720,72 S1200,125 1440,68 V120 H0Z" />
      <path class="tn-w4" d="M0,90 C240,135 480,58 720,92 S1200,135 1440,88 V120 H0Z" />
    </svg>

    <!-- Visor de imágenes -->
    <StoryViewer v-model="storyVisible" :imagenes="imagenesStory" />

  </section>

</template>

<script setup>

import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import StoryViewer from '../../../../../components/StoryViewer.vue'

/* =========================================
   PROPS
========================================= */

const props = defineProps({

  banners: {
    type: Array,
    default: () => []
  },

  negocio: {
    type: Object,
    default: null
  }

})

/* =========================================
   ESTADO
========================================= */

const scrollContainer = ref(null)
const currentIndex = ref(0)
const storyVisible = ref(false)

let autoTimer = null
let raf = 0

/* Arrastre con mouse (en táctil el scroll es nativo) */
let isDown = false
let dragged = false
let startX = 0
let startScroll = 0

/* =========================================
   SLIDES
========================================= */

const slides = computed(() => {

  const lista = (props.banners || []).map(b => ({
    img: b.img || '',
    alt: b.titulo_superior || props.negocio?.nombre || 'Banner'
  }))

  if (lista.length) {
    return lista
  }

  /* Sin banners: una portada con el nombre del negocio */
  return [{
    img: '',
    alt: props.negocio?.nombre || ''
  }]

})

const imagenesStory = computed(() => {

  return slides.value
    .map(s => s.img)
    .filter(Boolean)

})

/* =========================================
   VISOR DE IMÁGENES
========================================= */

function abrirStory(i) {

  /* Si se estaba arrastrando, no es un click */
  if (dragged) {
    dragged = false
    return
  }

  if (!slides.value[i]?.img) {
    return
  }

  currentIndex.value = i
  storyVisible.value = true

}

/* =========================================
   NAVEGACIÓN
========================================= */

function goToSlide(index) {

  const el = scrollContainer.value

  if (!el) {
    return
  }

  const n = slides.value.length
  const i = ((index % n) + n) % n

  el.scrollTo({
    left: el.clientWidth * i,
    behavior: 'smooth'
  })

  currentIndex.value = i

}

function onScroll() {

  if (raf) {
    return
  }

  raf = requestAnimationFrame(() => {

    raf = 0

    const el = scrollContainer.value

    if (!el || !el.clientWidth) {
      return
    }

    currentIndex.value = Math.round(el.scrollLeft / el.clientWidth)

  })

}

/* =========================================
   AUTOPLAY
========================================= */

function stopAuto() {

  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }

}

function startAuto() {

  stopAuto()

  if (slides.value.length < 2) {
    return
  }

  autoTimer = setInterval(() => {

    if (storyVisible.value || isDown) {
      return
    }

    goToSlide(currentIndex.value + 1)

  }, 4000)

}

watch(() => slides.value.length, startAuto)

onMounted(startAuto)

onUnmounted(() => {

  stopAuto()

  if (raf) {
    cancelAnimationFrame(raf)
  }

})

/* =========================================
   ARRASTRE (MOUSE)
========================================= */

function startDrag(e) {

  const el = scrollContainer.value

  if (!el) {
    return
  }

  isDown = true
  dragged = false

  startX = e.pageX
  startScroll = el.scrollLeft

  el.style.scrollSnapType = 'none'
  el.style.scrollBehavior = 'auto'

}

function onDrag(e) {

  if (!isDown) {
    return
  }

  const el = scrollContainer.value

  if (!el) {
    return
  }

  const walk = e.pageX - startX

  if (Math.abs(walk) > 5) {
    dragged = true
  }

  el.scrollLeft = startScroll - walk

}

function stopDrag() {

  if (!isDown) {
    return
  }

  isDown = false

  const el = scrollContainer.value

  if (!el) {
    return
  }

  el.style.scrollSnapType = ''
  el.style.scrollBehavior = ''

  if (dragged && el.clientWidth) {
    goToSlide(Math.round(el.scrollLeft / el.clientWidth))
  }

}

</script>

<style scoped>
.hero-vacio {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  text-align: center;
  font-family: var(--font-title, inherit);
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  color: var(--bg, #fff);
  -webkit-text-stroke: var(--stroke, 0) var(--primary, transparent);
  paint-order: stroke fill;
}
</style>