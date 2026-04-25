<template>
  <div>

    <!-- Botón superior -->
    <div class="bg-white p-3 shadow relative z-20">
      <button
        @click="openSheet"
        class="w-full bg-gray-100 rounded-full px-4 py-2 text-left flex items-center"
      >
        <i class="fa fa-map-marker text-red-500 mr-2"></i>
        Huamantanga
      </button>
    </div>

    <!-- BACKDROP -->
    <div
      ref="backdropEl"
      class="fixed inset-0 bg-black/40 opacity-0 pointer-events-none z-40"
      @click="closeSheet"
    ></div>

    <!-- ACTION SHEET -->
    <div
      ref="sheetEl"
      class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4 shadow-2xl z-50 translate-y-full"
    >
      <!-- indicador superior -->
      <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

      <div class="space-y-3 max-h-[60vh] overflow-auto">
        <button
          v-for="lugar in lugares"
          :key="lugar.nombre"
          @click="selectLugar(lugar)"
          class="w-full text-left px-3 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-3"
        >
          <i class="fa fa-map-marker text-orange-500"></i>
          {{ lugar.nombre }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'

defineProps(['lugares'])
const emit = defineEmits(['selectLugar'])

const sheetEl = ref(null)
const backdropEl = ref(null)

let isOpen = false

function openSheet() {
  if (isOpen) return
  isOpen = true

  backdropEl.value.style.pointerEvents = 'auto'

  // Backdrop fade
  gsap.to(backdropEl.value, {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out"
  })

  // Sheet slide up
  gsap.to(sheetEl.value, {
    y: 0,
    duration: 0.4,
    ease: "power3.out"
  })
}

function closeSheet() {
  if (!isOpen) return
  isOpen = false

  // Backdrop fade out
  gsap.to(backdropEl.value, {
    opacity: 0,
    duration: 0.25,
    ease: "power2.in",
    onComplete: () => {
      backdropEl.value.style.pointerEvents = 'none'
    }
  })

  // Sheet slide down
  gsap.to(sheetEl.value, {
    y: "100%",
    duration: 0.35,
    ease: "power3.in"
  })
}

function selectLugar(lugar) {
  emit('selectLugar', lugar)
  closeSheet()
}
</script>