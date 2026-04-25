<template>
  <div class="mt-4 px-4">
    <div ref="scrollContainer"
      class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
      @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchstart="startDrag"
      @touchmove="onDrag" @touchend="stopDrag">
      <div v-for="(item, index) in banners" :key="index"
        class="min-w-full snap-start relative rounded-2xl overflow-hidden select-none">
        <img :src="item.img" class="w-full h-48 object-cover pointer-events-none" />

        <div class="absolute bottom-4 left-4 text-white">
          <h2 class="text-xl font-semibold">
            {{ item.title }}
          </h2>
          <p class="text-sm">
            {{ item.subtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- INDICADORES -->
    <div class="flex justify-center gap-2 mt-3">
      <span v-for="(dot, i) in banners" :key="i" class="w-2 h-2 rounded-full transition-all"
        :class="currentIndex === i ? 'bg-orange-500 w-4' : 'bg-gray-300'"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollContainer = ref(null)

const banners = [
  { title: 'Thai Style', subtitle: '12 Places', img: 'https://picsum.photos/600/300?random=201' },
  { title: 'Italian Food', subtitle: '8 Places', img: 'https://picsum.photos/600/300?random=202' },
  { title: 'Mexican Fiesta', subtitle: '15 Places', img: 'https://picsum.photos/600/300?random=203' }
]

const currentIndex = ref(0)
let interval = null

function goToSlide(index) {
  const width = scrollContainer.value.clientWidth
  scrollContainer.value.scrollTo({
    left: width * index,
    behavior: 'smooth'
  })
  currentIndex.value = index
}

function autoSlide() {
  currentIndex.value = (currentIndex.value + 1) % banners.length
  goToSlide(currentIndex.value)
}

onMounted(() => {
  interval = setInterval(autoSlide, 4000)
})

onUnmounted(() => {
  clearInterval(interval)
})



let isDown = false
let startX
let scrollLeft



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