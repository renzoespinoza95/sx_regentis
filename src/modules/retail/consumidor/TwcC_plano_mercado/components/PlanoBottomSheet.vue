<template>
  <transition name="sheet">
    <div v-if="open" class="fixed inset-0 z-50">
      <!-- overlay -->
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

      <!-- sheet -->
      <div class="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl">
        <div class="pt-3 pb-2 flex items-center justify-center">
          <div class="w-14 h-1.5 rounded-full bg-gray-300"></div>
        </div>

        <div class="px-5 pb-3 flex items-center justify-between">
          <div>
            <div class="text-lg font-semibold text-gray-800">
              {{ stall?.name || 'Don Emiliano' }}
            </div>
            <div class="text-sm text-gray-500">
              {{ stall?.subtitle || 'Pasillo 2 - Puesto 24' }}
            </div>
          </div>
          <button class="text-gray-500" @click="$emit('close')">
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>

        <!-- Carrusel productos -->
        <div class="px-4 pb-6">
          <div
            ref="row"
            class="flex gap-4 overflow-x-auto no-scrollbar cursor-grab select-none"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            @touchstart="startDrag"
            @touchmove="onDrag"
            @touchend="stopDrag"
          >
            <PlanoProductoCard
              v-for="p in (stall?.products || [])"
              :key="p.id"
              :title="p.title"
              :price="p.price"
              :img="p.img"
            />
          </div>

          <!-- dots simple -->
          <div class="flex justify-center gap-2 mt-3 opacity-60">
            <span class="w-2 h-2 rounded-full bg-gray-300"></span>
            <span class="w-2 h-2 rounded-full bg-gray-400"></span>
            <span class="w-2 h-2 rounded-full bg-gray-300"></span>
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
.no-scrollbar::-webkit-scrollbar { display:none; }
.no-scrollbar { scrollbar-width:none; }

.sheet-enter-active, .sheet-leave-active { transition: all .25s ease; }
.sheet-enter-from, .sheet-leave-to { transform: translateY(20px); opacity: 0; }
.sheet-enter-to, .sheet-leave-from { transform: translateY(0); opacity: 1; }
</style>