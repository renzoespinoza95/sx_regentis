<template>
  <div class="px-4 mt-5">

    <div ref="container" style="
    touch-action: pan-y;
  " class="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth cursor-grab"
      @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchstart="startDrag"
      @touchmove="onDrag" @touchend="stopDrag">

      <div v-for="(item, index) in slides" :key="index"
        class="min-w-full snap-start bg-white rounded-2xl shadow-md overflow-hidden">
        <img :src="item" draggable="false" class="
    w-full
    h-48
    object-cover

    pointer-events-none
    select-none
    user-select-none
  " />
      </div>

    </div>

    <!-- Indicadores -->
    <div class="flex justify-center gap-2 mt-3">
      <span v-for="(dot, i) in slides" :key="i" class="w-2 h-2 rounded-full transition-all"
        :class="currentIndex === i ? 'bg-orange-500 w-4' : 'bg-gray-300'"></span>
    </div>

  </div>
</template>

<script setup>
import { usePrincipal } from '../../../services/usePrincipal'
import { ref, onMounted, watchEffect } from 'vue'
import {
  onBeforeUnmount
}
  from 'vue'

const container = ref(null)

const slides = ref([])

const q = usePrincipal()
let autoplayInterval = null

if (q.data) {
  // Vue Query
  watchEffect(() => {
    if (q.data.value) {
      slides.value =

        q.data.value?.sliders
          ?.map(s => s.img)

        ||

        []
    }
  })
} else {
  // axios directo
  onMounted(async () => {
    const data = await q.refetch()
    slides.value =

      data?.sliders
        ?.map(s => s.img)

      ||

      []
  })
}

const currentIndex = ref(0)

let isDown = false
let startX
let scrollLeft

function startDrag(e) {

  stopAutoplay()
  isDown = true
  const pageX = e.touches ? e.touches[0].pageX : e.pageX
  startX = pageX - container.value.offsetLeft
  scrollLeft = container.value.scrollLeft
}

function onDrag(e) {
  if (!isDown) return
  e.preventDefault()

  const pageX = e.touches ? e.touches[0].pageX : e.pageX
  const x = pageX - container.value.offsetLeft
  const walk = (x - startX) * 1.2
  container.value.scrollLeft = scrollLeft - walk

  const width = container.value.clientWidth
  currentIndex.value = Math.round(container.value.scrollLeft / width)
}

function stopDrag() {

  isDown = false

  startAutoplay()

}

/* =========================================
   🔥 AUTOPLAY
========================================= */

function startAutoplay() {

  stopAutoplay()

  autoplayInterval = setInterval(() => {

    if (
      !container.value
      ||
      !slides.value.length
    ) {

      return

    }

    currentIndex.value++

    if (

      currentIndex.value
      >=
      slides.value.length

    ) {

      currentIndex.value = 0

    }

    const width =
      container.value.clientWidth

    container.value.scrollTo({

      left:
        width
        *
        currentIndex.value,

      behavior:
        'smooth'

    })

  }, 4000)

}

function stopAutoplay() {

  if (autoplayInterval) {

    clearInterval(
      autoplayInterval
    )

    autoplayInterval = null

  }

}

onMounted(() => {

  startAutoplay()

})

onBeforeUnmount(() => {

  stopAutoplay()

})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  scrollbar-width: none;
}
</style>