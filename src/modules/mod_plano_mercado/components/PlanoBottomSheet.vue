<template>
  <transition name="sheet">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">

      <!-- overlay -->
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

      <!-- modal -->
      <div class="relative bg-white w-[90%] max-w-md rounded-3xl shadow-2xl">

        <!-- header -->
        <div class="px-5 pt-4 pb-2 flex justify-between items-center">
          <div>
            <div class="text-lg font-semibold text-gray-800">
              {{ stall?.name }}
            </div>
            <div class="text-sm text-gray-500">
              {{ stall?.subtitle }}
            </div>
          </div>

          <button @click="$emit('close')">
            <i class="fa fa-times text-gray-500 text-xl"></i>
          </button>
        </div>

        <!-- productos -->
        <div class="px-4 pb-5">
          <div class="flex gap-4 overflow-x-auto">
            <PlanoProductoCard v-for="p in (stall?.products || [])" :key="p.id" :title="p.title" :price="p.price"
              :img="p.img" />
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import PlanoProductoCard from './PlanoProductoCard.vue'

defineProps({
  open: { type: Boolean, default: false },
  stall: { type: Object, default: null }
})

defineEmits(['close'])

const row = ref(null)

let isDown = false
let startX = 0
let scrollLeft = 0

function startDrag(e) {
  if (!row.value) return
  isDown = true
  const pageX = e.touches ? e.touches[0].pageX : e.pageX
  startX = pageX - row.value.offsetLeft
  scrollLeft = row.value.scrollLeft
}

function onDrag(e) {
  if (!isDown || !row.value) return
  e.preventDefault()
  const pageX = e.touches ? e.touches[0].pageX : e.pageX
  const x = pageX - row.value.offsetLeft
  const walk = (x - startX) * 1.2
  row.value.scrollLeft = scrollLeft - walk
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
  scrollbar-width: none;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: all .25s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.sheet-enter-to,
.sheet-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>