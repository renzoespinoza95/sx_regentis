<template>
  <div class="px-4 mt-4">

    <div ref="scrollContainer"
      class="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
      @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchstart="startDrag"
      @touchmove="onDrag" @touchend="stopDrag">

      <span v-for="cat in categorias" :key="cat"
        class="bg-white shadow-sm px-3 py-1 rounded-full text-xs cursor-pointer hover:scale-105 transition">
        {{ cat }}
      </span>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const scrollContainer = ref(null)

let isDown = false
let startX
let scrollLeft

const categorias = [
  'Italian',
  'Mexican',
  'South Indian',
  'Chinese',
  'Peruvian',
  'Japanese',
  'Healthy',
  'Fast Food'
]

function startDrag(e) {
  isDown = true
  const pageX = e.touches ? e.touches[0].pageX : e.pageX
  startX = pageX - scrollContainer.value.offsetLeft
  scrollLeft = scrollContainer.value.scrollLeft
}

function onDrag(e) {
  if (!isDown) return
  e.preventDefault()

  const pageX = e.touches ? e.touches[0].pageX : e.pageX
  const x = pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX) * 1.2
  scrollContainer.value.scrollLeft = scrollLeft - walk
}

function stopDrag() {
  isDown = false
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>